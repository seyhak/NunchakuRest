import { camelCase, snakeCase } from "lodash"

export const convertKeysToCamelCase = (data: object) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [camelCase(key), value])
  )
}

export function convertKeysToSnakeCase(data: object) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [snakeCase(key), value])
  )
}
