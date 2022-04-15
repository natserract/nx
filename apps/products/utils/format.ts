
export function formatMoney(num: number, prefix = '') {
  const p = num.toFixed(2).split(".");

  return prefix + p[0].split("").reverse().reduce(function (acc, num, i) {
    return num + (num !== "-" && i && !(i % 3) ? "," : "") + acc;
  }, "");
}
