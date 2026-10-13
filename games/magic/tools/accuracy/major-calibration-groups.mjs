/** Disjoint deterministic shards share cached objects, never group outputs. */
export function calibrationGroups(rows, args) {
  const option = args.find((a) => a.startsWith('--shard='));
  const filter = args.filter((a) => !a.startsWith('--shard='));
  const selected = rows.filter(
    (r) => !filter.length || filter.includes(r.set) || filter.includes(r.family),
  );
  if (!option) return selected;
  const match = /^--shard=(\d+)\/(\d+)$/.exec(option);
  if (!match) throw Error('Expected --shard=0/2 (zero-based index/count)');
  const index = Number(match[1]),
    count = Number(match[2]);
  if (count < 1 || count > 8 || index >= count) throw Error('Invalid calibration shard');
  return selected.filter((_, i) => i % count === index);
}
