/**
 * @file Internal - tokenize
 * @module kronk/internal/tokenize
 */

import chars from '#enums/chars'
import isList from '#internal/is-list'
import preprocess from '#internal/preprocess'
import type { List } from '@flex-development/kronk'
import type { Event, TokenizeContext } from '@flex-development/vfile-tokenizer'

/**
 * Tokenize a list of `chunks`.
 *
 * @see {@linkcode Event}
 * @see {@linkcode List}
 * @see {@linkcode TokenizeContext}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {List<string> | null | undefined} chunks
 *  List of prepared command-line arguments
 * @param {TokenizeContext} tokenizer
 *  The tokenize context object
 * @return {Event[]}
 *  List of events
 */
function tokenize(
  this: void,
  chunks: List<string> | null | undefined,
  tokenizer: TokenizeContext
): Event[] {
  /**
   * List of events.
   *
   * @const {Event[]} events
   */
  const events: Event[] = []

  if (isList(chunks)) {
    for (const [i, chunk] of (chunks = [...chunks]).entries()) {
      tokenizer.chunk = i

      /**
       * Whether this is the end of the stream.
       *
       * @const {boolean} end
       */
      const end: boolean = i === chunks.length - 1

      // add new events
      events.push(...tokenizer.write(preprocess(chunk, 'utf8', end)))

      // write stream break to separate chunks
      if (!end) tokenizer.write(preprocess(chars.break, 'utf8'))
    }

    tokenizer.chunk = null
  }

  return events
}

export default tokenize
