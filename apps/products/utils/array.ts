
export function convertIntObj(obj) {
  const res = {}
  for (const key in obj) {
    res[key] = {};
    for (const prop in obj[key]) {
      const value = obj[key][prop]
      res[key][prop] = value

      if (typeof value === "string") {
        const parsed = parseInt(obj[key][prop], 10);
        res[key][prop] = parsed
      }

      if (typeof value === "object") {
        res[key][prop] = Array.from(value).map(v => +v)
      }
    }
  }
  return res;
}
