import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from "./case-converters";

describe("convertKeysToCamelCase", () => {
  it("should convert keys to camelCase", () => {
    const input = { snake_case_key: "value", another_key: "anotherValue" };

    const result = convertKeysToCamelCase(input);
    expect(result).toEqual({
      snakeCaseKey: "value",
      anotherKey: "anotherValue",
    });
  });
  it("should convert keys to camelCase deep", () => {
    const input = {
      snake_case_key: {
        snake_case_key_a: {
          snake_case_key_b: 2,
        },
      },
      another_key: {
        snake_case_key_c: {
          snake_case_key_d: "asdadsad",
          snake_case_key_e: [{a_b: "asdadsad"}, {a_b: "bic"}],
        },
      },
      another_key_a: {
        snake_case_key_c: null,
      },
      another_key_b: [1, 2, 3],
      another_key_c: "undefined",
    };

    const result = convertKeysToCamelCase(input);
    expect(result).toEqual({
      anotherKey: {
        snakeCaseKeyC: {
          snakeCaseKeyD: "asdadsad",
          "snakeCaseKeyE": [
            {
            "aB": "asdadsad",
            },
            {
                "aB": "bic",
              },
            ],
        },
      },
      snakeCaseKey: {
        snakeCaseKeyA: {
          snakeCaseKeyB: 2,
        },
      },
      anotherKeyA: { snakeCaseKeyC: null },
      anotherKeyB: [1, 2, 3],
      anotherKeyC: "undefined",
    });
  });
  it("should handle an empty object", () => {
    const input = {};
    const result = convertKeysToCamelCase(input);
    expect(result).toEqual({});
  });
});

describe("convertKeysToSnakeCase", () => {
  it("should convert keys to snake_case", () => {
    const input = {
      anotherKey: {
        snakeCaseKeyC: {
          snakeCaseKeyD: "asdadsad",
        },
      },
      snakeCaseKey: {
        snakeCaseKeyA: {
          snakeCaseKeyB: 2,
        },
      },
      anotherKeyA: { snakeCaseKeyC: null },
      anotherKeyB: [1, 2, 3],
      anotherKeyC: "undefined",
    };

    const result = convertKeysToSnakeCase(input);
    expect(result).toEqual({
      another_key: {
        snake_case_key_c: {
          snake_case_key_d: "asdadsad",
        },
      },
      another_key_a: {
        snake_case_key_c: null,
      },
      another_key_b: [1, 2, 3],
      another_key_c: "undefined",
      snake_case_key: {
        snake_case_key_a: {
          snake_case_key_b: 2,
        },
      },
    });
  });

  it("should handle an empty object", () => {
    const input = {};
    const result = convertKeysToSnakeCase(input);
    expect(result).toEqual({});
  });
});
