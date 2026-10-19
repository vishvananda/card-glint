function s(r, i, n) {
  if (r.measureText(i).width <= n) return i;
  const e = [...i];
  for (; e.length && r.measureText(`${e.join("")}…`).width > n; ) e.pop();
  return e.length || r.measureText("…").width <= n ? `${e.join("")}…` : "";
}
export {
  s as e
};
