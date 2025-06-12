/**
 * @file Type Aliases - OptionEventHandler
 * @module kronk/types/OptionEventHandler
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
 * @this {void}
 *
 * @param {OptionEvent<T>} event
 *  The emitted parsed option event
 * @return {undefined}
 */
type OptionEventHandler<T extends Option = Option> = (
  this: void,
  event: OptionEvent<T>
) => undefined

export type { OptionEventHandler as default }
