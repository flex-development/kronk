/**
 * @file Events - OptionEvent
 * @module kronk/events/OptionEvent
 */

import KronkEvent from '#events/kronk.event'
import type {
  Flags,
  Option,
  optionValueSource,
  OptionValueSource,
  RawOptionValue
} from '@flex-development/kronk'

/**
 * A parsed option event.
 *
 * @see {@linkcode KronkEvent}
 * @see {@linkcode Option}
 *
 * @template {Option} [T=Option]
 *  Parsed command option
 *
 * @category
 *  events
 *
 * @class
 * @extends {KronkEvent}
 */
class OptionEvent<T extends Option = Option> extends KronkEvent {
  /**
   * The option event name.
   *
   * @see {@linkcode Option.event}
   *
   * @public
   * @instance
   * @member {Option['event']} id
   */
  declare public id: Option['event']

  /**
   * Create a new parsed `option` event.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionValueSource}
   * @see {@linkcode RawOptionValue}
   *
   * @param {T} option
   *  The command option instance
   * @param {RawOptionValue} value
   *  The raw `option` value
   * @param {OptionValueSource} source
   *  The source of the raw option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   */
  constructor(
    option: T,
    value: RawOptionValue,
    source: OptionValueSource,
    flag?: Flags | null | undefined
  )

  /**
   * Create a new implied `option` event.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode optionValueSource}
   *
   * @param {T} option
   *  The command option instance
   * @param {unknown} value
   *  The implied `option` value
   * @param {optionValueSource.implied} source
   *  The source of the option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   */
  constructor(
    option: T,
    value: unknown,
    source: optionValueSource.implied,
    flag?: Flags | null | undefined
  )

  /**
   * Create a new parsed `option` event.
   *
   * > 👉 **Note**: For options where the `source` is `'implied'`, the `value`
   * > may not be a raw option value.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionValueSource}
   *
   * @param {T} option
   *  The command option instance
   * @param {unknown} value
   *  The raw or implied `option` value
   * @param {OptionValueSource} source
   *  The source of the option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   */
  constructor(
    public option: T,
    public value: unknown,
    public source: OptionValueSource,
    public flag?: Flags | null | undefined
  ) {
    super(option.event)
  }
}

export default OptionEvent
