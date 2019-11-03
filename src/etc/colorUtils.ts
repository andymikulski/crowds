export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(result[1], 16),
  parseInt(result[2], 16),
  parseInt(result[3], 16)];
}
const lerp = (start: number, end: number, percentAmount: number) => {
  const a = start * percentAmount;
  const b = end * (1 - percentAmount);
  return Math.round(a + b);
};
export const mixColors = (hexColorA: string, hexColorB: string, mixPercent: number, alpha: number = 1) => {
  const rgbA = hexToRgb(hexColorA);
  const rgbB = hexToRgb(hexColorB);
  const r = lerp(rgbA[0], rgbB[0], mixPercent);
  const g = lerp(rgbA[1], rgbB[1], mixPercent);
  const b = lerp(rgbA[2], rgbB[2], mixPercent);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
