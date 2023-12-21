// Import the functions to test
import { addDecimal, parseToFloatAndMultiply } from './decimal';

// Tests for parseToFloatIfNeeded
describe('parseToFloatIfNeeded', () => {
  it('should parse string to float', () => {
    expect(parseToFloatAndMultiply('3.14213', 2)).toEqual(314.21);
  });

  it('should not modify the number', () => {
    expect(parseToFloatAndMultiply(42.123, 2)).toEqual(4212.3);
  });
});

// Tests for addDecimal
describe('addDecimal', () => {
  it('should add two numbers with decimals', () => {
    expect(addDecimal(1.1, 2.2)).toEqual(3.3);
  });

  it('should return different precision', () => {
    expect(addDecimal(1.1, 2.2, 3)).toEqual(3.3);
  });

  it('should add two strings with decimals', () => {
    expect(addDecimal('1.1', '2.2')).toEqual(3.3);
  });

  it('should handle different decimal counts', () => {
    expect(addDecimal(1, 2, 0)).toEqual(3); // No decimals
    expect(addDecimal(1, 2, 3)).toEqual(3.000); // Three decimals
  });

  it('should handle a mix of strings and numbers', () => {
    expect(addDecimal('1.1', 2.2)).toEqual(3.3);
  });

  it('should handle non-numeric input gracefully', () => {
    expect(addDecimal('abc', 'def')).toEqual(NaN);
  });
});
