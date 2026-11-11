// Shared by provider import and scan tools. No game-state or image inference.
const PRE_INDICATOR = new Set(
  (
    'lea leb 2ed 3ed 4ed 5ed 6ed 7ed 8ed 9ed 10e arn atq leg drk fem ice hml all mir vis wth tmp ' +
    'sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr rin dst 5dn ' +
    'mrd chk bok sok rav gpt dis csp tsp tsb plc fut lrw mor shm eve ala con arb m10 zen wwk roe ' +
    'm11 som mbs nph m12'
  ).split(' '),
);
const POST_INDICATOR = new Set('isd dka avr m13 rtr gtc dgm m14 ths bng jou'.split(' '));
/** @param {unknown} value */
function colors(value) {
  if (
    !Array.isArray(value) ||
    value.length > 5 ||
    !value.every((color) => typeof color === 'string' && /^[WUBRG]$/.test(color))
  )
    throw Error('Invalid provider color indicator');
  return [...'WUBRG'].filter((color) => value.includes(color));
}
/** Physical visibility differs from Oracle data on older printings.
 * @param {{color_indicator?: unknown, released_at?: unknown, frame?: unknown, set?: unknown}} card
 * @param {{printingDate?: string, colorIndicator?: readonly string[] | null}} [options]
 */
export function providerColorIndicator(card, options = {}) {
  const oracle = card.color_indicator == null ? [] : colors(card.color_indicator);
  if (options.colorIndicator !== undefined)
    return {
      colorIndicator: options.colorIndicator === null ? [] : colors(options.colorIndicator),
      ...(oracle.length ? { oracleColorIndicator: oracle } : {}),
    };
  if (!oracle.length) return {};
  const date = options.printingDate ?? card.released_at;
  if (
    date !== undefined &&
    (typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date)
  )
    throw Error('Invalid printing release date');
  const set = typeof card.set === 'string' ? card.set.toLowerCase() : '';
  const present =
    date !== undefined
      ? date >= '2011-09-30'
      : card.frame === '2015' || POST_INDICATOR.has(set)
        ? true
        : PRE_INDICATOR.has(set)
          ? false
          : undefined;
  return {
    oracleColorIndicator: oracle,
    ...(present === undefined
      ? { colorIndicatorPrinting: 'unknown' }
      : { colorIndicator: present ? oracle : [] }),
  };
}
