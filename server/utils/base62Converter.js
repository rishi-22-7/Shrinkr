const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = 62;

/**
 * Converts a Base-10 integer to a Base-62 string.
 * @param {number} number - Non-negative integer
 * @returns {string}
 */
function encode(number) {
  if (!Number.isInteger(number) || number < 0) {
    throw new Error('encode() requires a non-negative integer');
  }
  if (number === 0) {
    return CHARSET[0];
  }

  let result = '';
  let n = number;

  while (n > 0) {
    result = CHARSET[n % BASE] + result;
    n = Math.floor(n / BASE);
  }

  return result;
}

/**
 * Converts a Base-62 string back to a Base-10 integer.
 * @param {string} str - Base-62 encoded string
 * @returns {number}
 */
function decode(str) {
  if (typeof str !== 'string' || str.length === 0) {
    throw new Error('decode() requires a non-empty string');
  }

  let result = 0;

  for (let i = 0; i < str.length; i += 1) {
    const index = CHARSET.indexOf(str[i]);
    if (index === -1) {
      throw new Error(`Invalid Base-62 character: ${str[i]}`);
    }
    result = result * BASE + index;
  }

  return result;
}

module.exports = { encode, decode, CHARSET, BASE };
