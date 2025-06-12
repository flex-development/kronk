/**
 * @file Type Aliases - OptionEventHandler
 * @module kronk/types/OptionEventHandler
 */

import type {
  Flags,
  Option,
  OptionValueSource,
  RawOptionValue
} from '@flex-development/kronk'

/**
 * Handle an `option` event.
 *
 * @see {@linkcode Flags}
 * @see {@linkcode Option}
 * @see {@linkcode OptionValueSource}
 * @see {@linkcode RawOptionValue}
 *
 * @template {Option} [T=Option]
 *  Command option
 *
 * @this {void}
 *
 * @param {T} option
 *  The command option instance
 * @param {RawOptionValue} value
 *  The raw `option` value
 * @param {OptionValueSource | null | undefined} [source]
 *  The source of the raw option `value`
 * @param {Flags | null | undefined} [flag]
 *  The parsed option flag
 * @return {undefined}
 */
type OptionEventHandler<T extends Option = Option> = (
  this: void,
  option: T,
  value: RawOptionValue,
  source?: OptionValueSource | null | undefined,
  flag?: Flags | null | undefined
) => undefined

export type { OptionEventHandler as default }
