/**
 * @file Option
 * @module kronk/lib/Option
 */

import initialOption from '#constructs/initial-option'
import chars from '#enums/chars'
import keid from '#enums/keid'
import tt from '#enums/tt'
import camelcase from '#internal/camelcase'
import kOption from '#internal/k-option'
import snakecase from '#internal/snakecase'
import toChunks from '#internal/to-chunks'
import toList from '#internal/to-list'
import Parseable from '#lib/parseable.abstract'
import {
  ev,
  tokenize,
  type Event,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type {
  Flags,
  List,
  OptionData,
  OptionEventName,
  OptionInfo,
  OptionMetadata,
  OptionValues,
  ParseArg
} from '@flex-development/kronk'
import { KronkError } from '@flex-development/kronk/errors'
import {
  fallback,
  ifelse,
  isFalsy,
  isNIL,
  isString
} from '@flex-development/tutils'
import { ok } from 'devlop'

/**
 * A command option.
 *
 * The `Option` model is used to define the expected options of a command.
 *
 * Option flags and argument syntax are tokenized
 * using the {@linkcode initialOption} construct.
 *
 * @see {@linkcode Parseable}
 *
 * @class
 * @extends {Parseable}
 */
class Option extends Parseable {
  /**
   * Option metadata.
   *
   * @see {@linkcode OptionMetadata}
   *
   * @protected
   * @instance
   * @override
   * @member {OptionMetadata} info
   */
  declare protected info: OptionMetadata

  /**
   * Whether the option is mandatory.
   *
   * @private
   * @instance
   * @member {boolean | null | undefined}
   */
  #mandatory: boolean | null | undefined

  /**
   * Create a new option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionInfo}
   *
   * @param {Flags | OptionInfo} info
   *  Option flags or info
   */
  constructor(info: Flags | OptionInfo)

  /**
   * Create a new option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionData}
   *
   * @param {Flags} flags
   *  Option flags
   * @param {OptionData | null | undefined} [info]
   *  Additional option data
   */
  constructor(flags: Flags, info?: OptionData | null | undefined)

  /**
   * Create a new option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionData}
   * @see {@linkcode OptionInfo}
   *
   * @param {Flags | OptionInfo} info
   *  Option flags or info
   * @param {OptionData | null | undefined} [data]
   *  Additional option data
   */
  constructor(
    info: Flags | OptionInfo,
    data?: OptionData | null | undefined
  ) {
    if (typeof info === 'string') info = { ...data, flags: info }

    super(info)

    Object.defineProperty(this, kOption, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    this.#mandatory = null
    this.info.flags = info.flags.trim()

    void this.tokenizeFlags()

    this.conflicts(this.info.conflicts)
    this.env(this.info.env)
    this.implies(this.info.implies)
    this.preset(this.info.preset)
  }

  /**
   * Whether the option is a boolean option.
   * Boolean options are options that do not take any option-arguments.
   *
   * > 👉 **Note**: Options are either boolean, optional, or required.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option is a boolean option, `false` otherwise
   */
  public get boolean(): boolean {
    return !this.required && !this.optional
  }

  /**
   * The event name for the option.
   *
   * @see {@linkcode OptionEventName}
   *
   * @public
   * @instance
   *
   * @return {OptionEventName}
   *  Option event name
   */
  public get event(): OptionEventName {
    return `option:${this.id}`
  }

  /**
   * The normalized option flags.
   *
   * @see {@linkcode Flags}
   *
   * @public
   * @instance
   *
   * @return {Flags}
   *  Option flags
   */
  public get flags(): Flags {
    return this.info.flags
  }

  /**
   * The option id.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Option id
   */
  public get id(): string {
    if (this.short && !this.long) return this.short.replace(/^-/, chars.empty)
    ok(this.long, 'expected long flag')
    return this.long.replace(/^--/, chars.empty)
  }

  /**
   * The option {@linkcode id} in a format
   * that can be used an object property key.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Object property key
   */
  public get key(): string {
    return ifelse(this.info.snakecase, snakecase, camelcase)(this.id)
  }

  /**
   * The long flag for the option.
   *
   * > 👉 **Note**: If `null`, {@linkcode short} will be a non-empty string.
   *
   * @public
   * @instance
   *
   * @return {string | null}
   *  Long flag
   */
  public get long(): string | null {
    return fallback(this.info.long, null, isFalsy)
  }

  /**
   * Whether the option must have a value after parsing.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option must have value after parsing, `false` otherwise
   */
  public get mandatory(): boolean {
    return this.#mandatory || !!this.info.mandatory
  }

  /**
   * Whether a value is optional when the option is specified.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option-argument is optional, `false` otherwise
   */
  public get optional(): boolean {
    return this.info.optional
  }

  /**
   * The short flag for the option.
   *
   * > 👉 **Note**: If `null`, {@linkcode long} will be a non-empty string.
   *
   * @public
   * @instance
   *
   * @return {string | null}
   *  Short flag
   */
  public get short(): string | null {
    return fallback(this.info.short, null, isFalsy)
  }

  /**
   * Set option names that conflict with this option.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} conflicts
   *  An option name, or list of option names, that conflict with the option
   * @return {this}
   *  `this` option
   */
  public conflicts(conflicts: List<string> | string | null | undefined): this

  /**
   * Get a list of option names that conflict with this option.
   *
   * @public
   * @instance
   *
   * @return {Set<string>}
   *  List of conflicting option names
   */
  public conflicts(): Set<string>

  /**
   * Get or set option names that conflict with the option.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} [conflicts]
   *  An option name, or list of option names, that conflict with the option
   * @return {Set<string> | this}
   *  List of conflicting option names or `this` option
   */
  public conflicts(
    conflicts?: List<string> | string | null | undefined
  ): Set<string> | this {
    if (arguments.length) return this.info.conflicts = conflicts, this
    return new Set(toList(this.info.conflicts))
  }

  /**
   * Set the environment variables to check for the value of the option.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} env
   *  The name of the environment variable to check,
   *  or a list of names, in order of priority, to check
   * @return {this}
   *  `this` option
   */
  public env(env: List<string> | string | null | undefined): this

  /**
   * Get a list of environment variables to check for the value of the option.
   *
   * @public
   * @instance
   *
   * @return {Set<string>}
   *  Environment variable names
   */
  public env(): Set<string>

  /**
   * Get or set the environment variables to check for the value of the option.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} [env]
   *  The name of the environment variable to check,
   *  or a list of names, in order of priority, to check
   * @return {Set<string> | this}
   *  Environment variable names or `this` option
   */
  public env(
    env?: List<string> | string | null | undefined
  ): Set<string> | this {
    if (arguments.length) return this.info.env = env, this
    return new Set(toList(this.info.env))
  }

  /**
   * Set implied option values.
   *
   * Implied option values are values that are set on other options when `this`
   * option is passed, but the implied option is not.
   *
   * Lone keys (string `implies`) imply `true`, i.e. `{ [implies]: true }`.
   *
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @param {OptionValues | string | null | undefined} implies
   *  The key of an implied option, or a map where each key
   *  is an implied option key and each value is the value to use
   *  when the option is set but the implied option is not
   * @return {this}
   *  `this` option
   */
  public implies(implies: OptionValues | string | null | undefined): this

  /**
   * Get implied option values.
   *
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} T
   *  Implied option values
   *
   * @return {T}
   *  Map of implied option values
   */
  public implies<T extends OptionValues>(): T

  /**
   * Get or set implied option values.
   *
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @param {OptionValues | string | null | undefined} [implies]
   *  The key of an implied option, or a map where each key
   *  is an implied option key and each value is the value to use
   *  when the option is set but the implied option is not
   * @return {OptionValues | this}
   *  Map of implied option values or `this` option
   */
  public implies(
    implies?: OptionValues | string | null | undefined
  ): OptionValues | this {
    ok(
      typeof this.info.implies !== 'string',
      'expected `info.implies` not to be a string'
    )

    if (arguments.length) {
      if (typeof implies === 'string') implies = { [implies]: true }
      this.info.implies = Object.assign(this.info.implies ?? {}, implies)
      return this
    }

    return ok(this.info.implies, 'expected `info.implies`'), this.info.implies
  }

  /**
   * Specify if the option is mandatory.
   *
   * Mandatory options must have a value after parsing, which usually means the
   * option must be specified on the command line.
   *
   * > 👉 **Note**: This method is a no-op if mandatory option syntax was used
   * > when defining option flags (i.e. `new Option('--token <!>')`).
   *
   * @public
   * @instance
   *
   * @param {boolean | null | undefined} [mandatory=true]
   *  Whether the option must have a value after parsing
   * @return {this}
   *  `this` option
   */
  public mandate(mandatory?: boolean | null | undefined): this {
    mandatory = this.#mandatory || fallback(mandatory, true, isNIL)
    return this.info.mandatory = mandatory, this
  }

  /**
   * Set the preset to use when the option is specified without an argument.
   *
   * The handler used to parse option-arguments, {@linkcode ParseArg}, will be
   * called.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} preset
   *  The option-argument preset
   * @return {this}
   *  `this` option
   */
  public preset(preset: string | null | undefined): this

  /**
   * Get the preset to use when the option is specified without an argument.
   *
   * @public
   * @instance
   *
   * @template {string} T
   *  Option-argument preset
   *
   * @return {string | null}
   *  The option-argument preset
   */
  public preset<T extends string>(): T | null

  /**
   * Get or set the preset to use when the option is specified without an
   * argument.
   *
   * The option-argument {@linkcode parser} will be called.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} [preset]
   *  Preset to use when option is specified without an option-argument
   * @return {string | this | null}
   *  The option-argument preset or `this` option
   */
  public preset(preset?: string | null | undefined): string | this | null {
    if (!arguments.length) return fallback(this.info.preset, null)
    return this.info.preset = preset, this
  }

  /**
   * Get the option as a human-readable string.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  String representation of `this` option
   */
  public toString(): string {
    return `Option(${JSON.stringify(this.flags).slice(1, -1)})`
  }

  /**
   * Parse long and short flags from {@linkcode info.flags}.
   *
   * @see {@linkcode KronkError}
   *
   * @protected
   * @instance
   *
   * @return {undefined}
   * @throws {KronkError}
   *  If any flags are invalid or no flags are found
   */
  protected tokenizeFlags(): undefined {
    /**
     * Flag string parts.
     *
     * @var {(string | null)[]} chunks
     */
    let chunks: (string | null)[] = toChunks(this.info.flags, kOption)

    if (chunks.length) {
      /**
       * List of events.
       *
       * @const {Event[]} events
       */
      const events: Event[] = tokenize(chunks as string[], {
        debug: 'kronk/option',
        /**
         * @this {void}
         *
         * @param {TokenizeContext} context
         *  Base tokenize context
         * @return {undefined}
         */
        finalizeContext(this: void, context: TokenizeContext): undefined {
          return context[kOption] = true, void context
        },
        initial: initialOption
      })

      /**
       * Index of current event.
       *
       * @var {number} index
       */
      let index: number = -1

      // compile events to capture option metadata.
      while (++index < events.length) {
        ok(events[index], 'expected `events[index]`')
        const [event, token] = events[index]!

        // process flag.
        if (token.type === tt.flag) {
          ok(event === ev.enter, 'expected flag enter event')
          ok(token.long || token.short, 'expected long or short flag')
          ok(typeof token.value === 'string', 'expected string token value')

          // capture flags.
          if (token.long && !this.info.long) {
            this.info.long = token.value // capture long flag
            chunks[token.start._index] = null // mark flag as processed
          } else if (!this.info.short) {
            this.info.short = token.value // capture short flag
            chunks[token.start._index] = null // mark flag as processed
          } else {
            // do nothing.
            // a long flag and short flag were already found.
          }

          // skip flag exit event.
          index++
        }

        // process option-argument syntax.
        if (token.type === tt.argtax) {
          ok(event === ev.enter, 'expected option-argument syntax enter event')

          ok(typeof token.mandatory === 'boolean', 'expected `token.mandatory`')
          ok(typeof token.required === 'boolean', 'expected `token.required`')
          ok(typeof token.variadic === 'boolean', 'expected `token.variadic`')

          ok(
            token.start._index === chunks.length - 1,
            'expected argument syntax to be from last chunk'
          )

          // capture option metadata.
          this.info.optional = !token.required
          this.info.required = token.required
          this.info.variadic = token.variadic

          // mandatory syntax overrides `info.mandatory` if both are defined.
          if (token.mandatory || typeof this.info.mandatory !== 'boolean') {
            this.info.mandatory = token.mandatory

            // if mandatory option syntax is used, `mandate` is a no-op.
            if (token.mandatory) this.#mandatory = token.mandatory
          }

          // mark option-argument syntax as processed.
          chunks[token.start._index] = null

          // skip argument syntax exit event.
          index++
        }
      }

      // swap flags if long (shortish) flag is shorter than short flag.
      if (
        this.info.long &&
        this.info.short &&
        this.info.long.slice(0, 2) === this.info.short.slice(0, 2) &&
        this.info.short.length >= this.info.long.length
      ) {
        const { long, short } = this.info

        this.info.long = short
        this.info.short = long
      }

      // check for unprocessed flag parts.
      if ((chunks = chunks.filter(isString)).length) {
        /**
         * First invalid flag part.
         *
         * @const {string} part
         */
        const part: string = chunks[0]!

        /**
         * Reason for error.
         *
         * @var {string} reason
         */
        let reason: string = `${String(this)} failed due to`

        reason += chars.space
        reason += chars.apostrophe
        reason += JSON.stringify(part).slice(1, -1)
        reason += chars.apostrophe

        throw new KronkError({
          cause: { flags: this.info.flags, part },
          id: keid.invalid_flags,
          reason
        })
      }
    }

    // check for at least one flag.
    if (!this.info.long && !this.info.short) {
      throw new KronkError({
        cause: { flags: this.info.flags },
        id: keid.no_flags,
        reason: `No flags found in ${String(this)}`
      })
    }

    return void this
  }
}

export default Option
