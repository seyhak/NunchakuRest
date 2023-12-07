import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from "./case-converters"

describe("convertKeysToCamelCase", () => {
  it("should convert keys to camelCase", () => {
    const input = { snake_case_key: "value", another_key: "anotherValue" }

    const result = convertKeysToCamelCase(input)
    expect(result).toEqual({
      snakeCaseKey: "value",
      anotherKey: "anotherValue",
    })
  })

  it("should handle an empty object", () => {
    const input = {}
    const result = convertKeysToCamelCase(input)
    expect(result).toEqual({})
  })
})

describe("convertKeysToSnakeCase", () => {
  it("should convert keys to snake_case", () => {
    const input = { camelCaseKey: "value", anotherKey: "anotherValue" }

    const result = convertKeysToSnakeCase(input)
    expect(result).toEqual({
      camel_case_key: "value",
      another_key: "anotherValue",
    })
  })

  it("should handle an empty object", () => {
    const input = {}
    const result = convertKeysToSnakeCase(input)
    expect(result).toEqual({})
  })
})
