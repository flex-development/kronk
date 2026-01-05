/**
 * @file Test Parsers - file
 * @module tests/parsers/file
 */

/**
 * Parse a file.
 *
 * @this {void}
 *
 * @async
 *
 * @param {string} value
 *  The file path
 * @return {Promise<string>}
 *  The validated file path
 */
async function file(this: void, value: string): Promise<string> {
  return new Promise(resolve => resolve(value))
}

export default file
