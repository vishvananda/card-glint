import { median, quantile } from './metrics.mjs';

export function summarize(results) {
  const measured = results.filter((r) => !r.issue && r.comparisons);
  const distribution = (values) => ({
    count: values.length,
    median: median(values),
    p10: quantile(values, 0.1),
    p90: quantile(values, 0.9),
    mean: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null,
  });
  const output = {
    attempted: results.length,
    measured: measured.length,
    failed: results.length - measured.length,
    scanReviewed: measured.filter((r) => r.contentStatus === 'scan-reviewed').length,
    oracleUnverified: measured.filter((r) => r.contentStatus !== 'scan-reviewed').length,
    alignmentUncertain: measured.filter((r) => r.alignment.uncertain).length,
    clipped: measured.filter((r) => r.clipping).length,
    layoutMeasured: measured.filter((r) => r.layout != null).length,
    tiers: {},
  };
  for (const tier of ['inspect', 'table']) {
    const regions = {};
    for (const id of new Set(
      measured.flatMap((r) => r.comparisons[tier].regions.map((region) => region.id)),
    )) {
      const values = measured.flatMap((r) =>
        r.comparisons[tier].regions
          .filter((region) => region.id === id && region.edgeF1)
          .map((region) => region.edgeF1[1]),
      );
      regions[id] = distribution(values);
    }
    output.tiers[tier] = {
      text: distribution(
        measured.map((r) => r.comparisons[tier].textEdgeF1).filter((v) => v != null),
      ),
      regions,
      reviewedBody: distribution(
        measured
          .filter((r) => r.contentStatus === 'scan-reviewed' && !r.alignment.uncertain)
          .flatMap((r) =>
            r.comparisons[tier].regions
              .filter((region) => region.id === 'body' && region.edgeF1)
              .map((region) => region.edgeF1[1]),
          ),
      ),
    };
  }
  return output;
}

/** Associations for review, not automatic causal attribution: placement can resemble a bad asset. */
export function assetBacklog(results) {
  const groups = new Map();
  for (const result of results.filter((r) => !r.issue && r.comparisons)) {
    for (const region of result.comparisons.inspect.regions.filter(
      (r) => r.kind === 'asset' && r.edgeF1,
    )) {
      const binding = result.assets?.[region.assetRole];
      const urls = Array.isArray(binding) ? binding : binding ? [binding] : [];
      for (const url of new Set(urls)) {
        const key = `${url}:${region.assetRole}`;
        if (!groups.has(key)) groups.set(key, { url, role: region.assetRole, cards: new Map() });
        const group = groups.get(key);
        if (!group.cards.has(result.id))
          group.cards.set(result.id, {
            id: result.id,
            name: result.name,
            family: result.alignment.family,
            alignmentUncertain: result.alignment.uncertain,
            scores: [],
            distances: [],
          });
        const card = group.cards.get(result.id);
        card.scores.push(region.edgeF1[1]);
        if (region.meanDistance != null) card.distances.push(region.meanDistance);
      }
    }
  }
  return [...groups.values()]
    .map((group) => {
      const cards = [...group.cards.values()].map((c) => ({
        ...c,
        score: median(c.scores),
        meanDistance: median(c.distances),
      }));
      const confident = cards.filter((c) => !c.alignmentUncertain);
      return {
        url: group.url,
        role: group.role,
        cardCount: cards.length,
        confidentCount: confident.length,
        medianEdgeF1: median(confident.map((c) => c.score)),
        allCardMedianEdgeF1: median(cards.map((c) => c.score)),
        status:
          confident.length >= 3 && median(confident.map((c) => c.score)) < 0.6
            ? 'review-asset-or-placement'
            : confident.length < 3
              ? 'insufficient-confident-evidence'
              : 'monitor',
        examples: cards.sort((a, b) => a.score - b.score).slice(0, 8),
        families: [...new Set(cards.map((c) => c.family))],
        caveat:
          'Color is not scored. Frame geometry, scan alignment, and co-occurring components can contribute; inspect examples before replacing assets.',
      };
    })
    .sort((a, b) => (a.medianEdgeF1 ?? 1) - (b.medianEdgeF1 ?? 1));
}
