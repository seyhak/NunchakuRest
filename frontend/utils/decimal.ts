export const parseToFloatAndMultiply = (a: string | number, decimalCount: number) => {
  const precision = Math.pow(10, decimalCount)
  const num = typeof(a) === "string" ? parseFloat(a) : a
  return parseFloat((num * precision).toFixed(decimalCount))
}

export const addDecimal = (a: string | number, b: string | number, decimalCount = 2) => {
  const precision = Math.pow(10, decimalCount)
  const fa = parseToFloatAndMultiply(a, decimalCount)
  const fb = parseToFloatAndMultiply(b, decimalCount)
  return ((fa + fb) / precision)
}
