import { s as i } from "./registry-Cg8tIhk4.js";
import { b as o } from "./load-CIzR6IZN.js";
import { r as e, a as n } from "./artist-6BNft4x6.js";
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
