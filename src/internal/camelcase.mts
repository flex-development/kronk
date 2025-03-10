/**
 * @file Internal - camelcase
 * @module kronk/internal/camelcase
 */

/**
 * Convert a kebab-case `string` to camelCase.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string} string
 *  The string to convert
 * @return {string}
 *  Camel cased `string`
 */
function camelcase(this: void, string: string): string {
  return string.split('-').reduce((acc, part) => {
    return acc + part[0]!.toUpperCase() + part.slice(1)
  })
}

export default camelcase
