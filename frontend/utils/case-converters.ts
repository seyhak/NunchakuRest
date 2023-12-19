import { camelCase, isPlainObject, snakeCase } from "lodash"

const convertCase = (data: object, converter: (key: string) => string): {[key:string]: any} => {
  const isArray = Array.isArray(data)
  const returnValue = Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if(isPlainObject(value)) {
        return [converter(key), convertCase(value, converter)]
      }
      const isArrayOfObjects = Array.isArray(value) && value.length && isPlainObject(value[0])
      if(isArrayOfObjects){
        return [converter(key), value.map(v=> convertCase(v, converter))]
      }
      return [converter(key), value]
    })
  )
  return isArray ? Object.values(returnValue) : returnValue
}
export const convertKeysToCamelCase = (data: object): {[key:string]: any} => {
  return convertCase(data, camelCase)
}

export function convertKeysToSnakeCase(data: object) {
  return convertCase(data, snakeCase)
}
