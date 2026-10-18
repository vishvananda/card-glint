let s = (e, t) => fetch(e, { ...t, mode: "cors" });
function c(e) {
  s = e;
}
function f(e, t) {
  return s(e, t);
}
export {
  f,
  c as s
};
