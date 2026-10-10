//! Byte-bounded LRU admission. Pinned resources cannot be evicted.
use serde::Serialize;
use std::collections::BTreeMap;

#[derive(Clone, Copy, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    pub hits: u64,
    pub misses: u64,
    pub admissions: u64,
    pub evictions: u64,
    pub bytes: u64,
    pub peak_bytes: u64,
    pub rejected: u64,
}

#[derive(Debug)]
struct Entry {
    key: String,
    bytes: u64,
    used: u64,
    pins: u32,
    priority: u8,
}

#[derive(Debug, Serialize)]
pub struct Admission {
    pub handle: u32,
    pub evicted: Vec<u32>,
}

#[derive(Debug)]
pub struct Cache {
    limit: u64,
    clock: u64,
    next: u32,
    entries: BTreeMap<u32, Entry>,
    keys: BTreeMap<String, u32>,
    pub stats: Stats,
}

impl Cache {
    #[must_use]
    pub fn new(limit: u64) -> Self {
        Self {
            limit,
            clock: 0,
            next: 1,
            entries: BTreeMap::new(),
            keys: BTreeMap::new(),
            stats: Stats::default(),
        }
    }

    /// Lookup changes recency but does not allocate, upload, or rebuild.
    pub fn get(&mut self, key: &str) -> Option<u32> {
        self.clock += 1;
        if let Some(&handle) = self.keys.get(key) {
            if let Some(entry) = self.entries.get_mut(&handle) {
                entry.used = self.clock;
            }
            self.stats.hits += 1;
            Some(handle)
        } else {
            self.stats.misses += 1;
            None
        }
    }

    /// Admit only after identifying enough unpinned victims. Refused admission
    /// never partially evicts the previous working set.
    ///
    /// # Errors
    /// Rejects invalid keys, exhausted handles and requests exceeding the budget.
    pub fn admit(&mut self, key: String, bytes: u64) -> Result<Admission, &'static str> {
        self.admit_with_priority(key, bytes, 1)
    }

    /// Lower priorities are evicted before final display surfaces.
    /// # Errors
    /// Refuses requests exceeding the budget or available unpinned space.
    pub fn admit_with_priority(
        &mut self,
        key: String,
        bytes: u64,
        priority: u8,
    ) -> Result<Admission, &'static str> {
        if key.is_empty() || key.len() > 131_072 || bytes == 0 {
            return Err("Invalid resource key or byte length");
        }
        if let Some(&handle) = self.keys.get(&key) {
            return Ok(Admission {
                handle,
                evicted: vec![],
            });
        }
        let next = self
            .next
            .checked_add(1)
            .ok_or("Resource handle space exhausted")?;
        let needed = self
            .stats
            .bytes
            .saturating_add(bytes)
            .saturating_sub(self.limit);
        let mut victims: Vec<_> = self.entries.iter().filter(|(_, e)| e.pins == 0).collect();
        victims.sort_by_key(|(id, e)| (e.priority, e.used, **id));
        let mut freed = 0;
        let mut evicted = Vec::new();
        for (&id, entry) in victims {
            if freed >= needed {
                break;
            }
            freed += entry.bytes;
            evicted.push(id);
        }
        if bytes > self.limit || freed < needed || self.entries.len() >= 20_000 {
            self.stats.rejected += 1;
            return Err("Resource budget exhausted; release pins or lower the resolution");
        }
        for id in &evicted {
            self.remove(*id);
        }
        self.stats.evictions += evicted.len() as u64;
        let handle = self.next;
        self.next = next;
        self.clock += 1;
        self.entries.insert(
            handle,
            Entry {
                key: key.clone(),
                bytes,
                used: self.clock,
                pins: 0,
                priority,
            },
        );
        self.keys.insert(key, handle);
        self.stats.bytes += bytes;
        self.stats.peak_bytes = self.stats.peak_bytes.max(self.stats.bytes);
        self.stats.admissions += 1;
        Ok(Admission { handle, evicted })
    }

    /// # Errors
    /// Refuses stale handles and unbalanced leases.
    pub fn pin(&mut self, handle: u32, acquire: bool) -> Result<(), &'static str> {
        let entry = self
            .entries
            .get_mut(&handle)
            .ok_or("Stale resource handle")?;
        entry.pins = if acquire {
            entry.pins.checked_add(1)
        } else {
            entry.pins.checked_sub(1)
        }
        .ok_or("Unbalanced resource lease")?;
        Ok(())
    }

    /// Explicit invalidation. The caller disposes the returned graphics handle.
    pub fn remove(&mut self, handle: u32) -> bool {
        if let Some(entry) = self.entries.remove(&handle) {
            self.keys.remove(&entry.key);
            self.stats.bytes -= entry.bytes;
            true
        } else {
            false
        }
    }

    /// Privacy/context reset invalidates all leases. Handle IDs are never reused.
    pub fn clear(&mut self) -> Vec<u32> {
        let handles = self.entries.keys().copied().collect();
        self.entries.clear();
        self.keys.clear();
        self.stats.bytes = 0;
        handles
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn recency_and_pins_protect_resident_assets() {
        let mut cache = Cache::new(20);
        let a = cache.admit("a".into(), 10).unwrap().handle;
        let b = cache.admit("b".into(), 10).unwrap().handle;
        cache.pin(a, true).unwrap();
        let c = cache.admit("c".into(), 10).unwrap();
        assert_eq!(c.evicted, vec![b]);
        cache.get("a");
        cache.pin(a, false).unwrap();
        assert_eq!(cache.admit("d".into(), 10).unwrap().evicted, vec![c.handle]);
        assert_eq!(cache.stats.bytes, 20);
    }
    #[test]
    fn intermediate_resources_do_not_displace_final_surfaces() {
        let mut cache = Cache::new(20);
        let face = cache.admit("face".into(), 10).unwrap().handle;
        let edge = cache
            .admit_with_priority("edge".into(), 10, 0)
            .unwrap()
            .handle;
        cache.get("edge");
        assert_eq!(
            cache.admit("other face".into(), 10).unwrap().evicted,
            vec![edge]
        );
        assert_eq!(cache.get("face"), Some(face));
    }
    #[test]
    fn refusal_is_transactional_and_reset_never_reuses_ids() {
        let mut cache = Cache::new(10);
        let a = cache.admit("a".into(), 10).unwrap().handle;
        cache.pin(a, true).unwrap();
        assert!(cache.admit("b".into(), 10).is_err());
        assert!(cache.admit("huge".into(), 11).is_err());
        assert_eq!(cache.get("a"), Some(a));
        assert_eq!(cache.clear(), vec![a]);
        assert!(cache.pin(a, false).is_err());
        assert!(cache.admit("a".into(), 10).unwrap().handle > a);
    }
}
