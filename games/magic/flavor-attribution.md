# Flavor attribution alignment

For original ordinary English printings, the reviewed scans support a printing-era
rule. Text length alone does not explain the switch: short and long passages in
Eighth Edition and M21 both put credits at the left.

| Printing family                                                       | Default credit alignment | Reviewed boundary examples                                                 |
| --------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| Early sets through Alliances                                          | Left                     | Revised, Fourth Edition, Ice Age, Alliances                                |
| Mirage through Scourge expansions; Fifth–Seventh Edition; Portal sets | Right                    | Every listed expansion/core/Portal set has scan evidence in the fixture    |
| Eighth Edition onward                                                 | Left                     | Eighth Edition and M21; this is the existing default for other modern sets |

The renderer uses an explicit set list for the middle group. It does not assume
that a later retro frame or supplemental reprint uses the original-era policy.
The [review fixture](fixtures/accuracy/flavor-attribution-policy.json) records
printing IDs, source hashes, observations and known exceptions.

Precedence:

1. Explicit `RulesParagraph.align` wins, including a printing-specific correction.
2. A centered passage keeps its attribution centered.
3. The set policy applies only to a final flavor line beginning with `—`, `–` or
   `--`. It preserves styled runs and right-aligns wrapped credit lines together.
4. A dash inside a quotation or rules paragraph does not create an attribution.

Known exceptions and limits:

- Revised Obsianus Golem has a centered flavor passage and credit.
- Revised Aladdin's Ring starts its credit on the quotation's final line. A source
  newline can therefore misrepresent its printed layout; alignment alone cannot
  repair that content/layout mismatch.
- Seventh Edition Abyssal Horror places its right-aligned credit on the same
  baseline as the final words of its quotation. Exact inline packing remains a
  review item. Do not automatically merge every credit that happens to fit.
- Some scans have manual indentation, and later retro/special treatments need
  their own evidence. Store such exceptions as printing annotations rather than
  changing a shared set rule to accommodate one card.

These observations justify an alignment default. They do not certify font size,
line spacing or wrapping across an entire set.
