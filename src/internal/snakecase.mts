/**
 * @file Internal - snakecase
 * @module kronk/internal/snakecase
 */

/**
 * Convert a kebab-case `string` to snake_case.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string} string
 *  The string to convert
 * @return {string}
 *  Snake cased `string`
 */
function snakecase(this: void, string: string): string {
  return string.split('-').reduce((acc, part) => {
    return acc + '_' + part.toLowerCase()
  })
}

export default snakecase
