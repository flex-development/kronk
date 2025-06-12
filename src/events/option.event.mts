/**
 * @file Events - OptionEvent
 * @module kronk/events/OptionEvent
 */

import KronkEvent from '#events/kronk.event'
import type {
  Flags,
  Option,
  OptionValueSource,
  RawOptionValue
} from '@flex-development/kronk'

/**
 * Parsed option event model.
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
   * Unique id representing the event.
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
    public option: T,
    public value: RawOptionValue,
    public source: OptionValueSource,
    public flag?: Flags | null | undefined
  ) {
    super(option.event)
  }
}

export default OptionEvent
