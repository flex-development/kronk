/**
 * @file Type Aliases - OptionEventListener
 * @module kronk/types/OptionEventListener
 */

import type { Option, OptionEvent } from '@flex-development/kronk'

/**
 * Handle a parsed command option `event`.
 *
 * @see {@linkcode Option}
 * @see {@linkcode OptionEvent}
 *
 * @template {Option} [T=Option]
 *  Parsed command option
 *
 * @param {OptionEvent<T>} event
 *  The emitted parsed option event
 * @return {undefined}
 */
type OptionEventListener<T extends Option = Option> = (
  event: OptionEvent<T>
) => undefined

export type { OptionEventListener as default }
