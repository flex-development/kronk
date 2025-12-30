/**
 * @file Internal - toChunks
 * @module kronk/internal/toChunks
 */

import kOption from '#internal/k-option'

/**
 * Turn a `string` into chunks.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string} string
 *  The string to chunk
 * @param {symbol} context
 *  The context symbol
 * @return {string[]}
 *  List of chunks created from `string`
 */
function toChunks(this: void, string: string, context: symbol): string[] {
  if (context === kOption && !string.trim()) return []
  return string.split(context === kOption ? /[\t ,|]+/ : /[\t ]+/)
}

export default toChunks
