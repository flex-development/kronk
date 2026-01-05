/**
 * @file Test Parsers - files
 * @module tests/parsers/files
 */

/**
 * The list of files.
 *
 * @const {Set<string>} list
 */
const list: Set<string> = new Set()

files.list = list
export default files

/**
 * Parse a list of files.
 *
 * @this {void}
 *
 * @async
 *
 * @param {string} value
 *  The file to add
 * @param {Promise<Set<string>>} previous
 *  The previous parse result
 * @return {Promise<Set<string>>}
 *  The list of files
 */
async function files(
  this: void,
  value: string,
  previous: Promise<Set<string>> | undefined
): Promise<Set<string>> {
  if (previous) await previous
  return new Promise(resolve => resolve((list.add(value), list)))
}
