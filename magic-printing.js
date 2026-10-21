import { s as i } from "./registry-CXWh8XrR.js";
import { b as o } from "./load-CrUZUcaw.js";
import { r as e, a as n } from "./artist-Bwqu4utB.js";
async function c(r, ...t) {
  return await o(r), n(
    i(r.trim().toLowerCase(), "printingCorrections"),
    ...t
  );
}
async function l(r, ...t) {
  return await o(r), e(
    i(r.trim().toLowerCase(), "artistCredits"),
    ...t
  );
}
export {
  l as resolveSetPrintingArtist,
  c as resolveSetPrintingWording
};
