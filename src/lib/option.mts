/**
 * @file Option
 * @module kronk/lib/Option
 */

import argumentSyntax from '#constructs/argument-syntax'
import longFlag from '#constructs/flag-long'
import shortFlag from '#constructs/flag-short'
import chars from '#enums/chars'
import codes from '#enums/codes'
import tt from '#enums/tt'
import KronkError from '#errors/kronk.error'
import camelcase from '#internal/camelcase'
import kOption from '#internal/k-option'
import snakecase from '#internal/snakecase'
import toChunks from '#internal/to-chunks'
import tokenize from '#internal/tokenize'
import type {
  DefaultInfo,
  Flags,
  List,
  OptionData,
  OptionInfo,
  OptionMetadata,
  ParseArg
} from '@flex-development/kronk'
import {
  fallback,
  identity,
  ifelse,
  isNIL,
  isString
} from '@flex-development/tutils'
import {
  createTokenizer,
  ev,
  initialize,
  type Event,
  type TokenizeContext
} from '@flex-development/vfile-tokenizer'
import { ok } from 'devlop'

/**
 * Data model representing a command option.
 *
 * @class
 */
class Option {
  /**
   * Option metadata.
   *
   * @see {@linkcode OptionMetadata}
   *
   * @protected
   * @instance
   * @member {OptionMetadata} info
   */
  protected info: OptionMetadata

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
   *  Option data
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
   *  Option data
   */
  constructor(
    info: Flags | OptionInfo,
    data?: OptionData | null | undefined
  ) {
    if (typeof info === 'string') info = { ...data, flags: info }

    this.info = {
      ...info,
      flags: info.flags.trim(),
      long: undefined,
      optional: false,
      required: false,
      short: undefined,
      variadic: false
    }

    Object.defineProperty(this, kOption, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    void this.tokenizeFlags()

    this.choices(this.info.choices)
    this.default(this.info.default)
    this.description(this.info.description)
    this.env(this.info.env)
    this.hide(!!this.info.hidden)
    this.parser(this.info.parser)
    this.preset(this.info.preset)
  }

  /**
   * Get a boolean indicating if `this` option is a boolean option. Boolean
   * options are options that do not take any option-arguments.
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
   * Get option flags.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Option flags
   */
  public get flags(): string {
    return this.info.flags
  }

  /**
   * Get a boolean indicating if the option should **not** be displayed in
   * help text.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option should not be displayed in help text, `false` otherwise
   */
  public get hidden(): boolean {
    ok(typeof this.info.hidden === 'boolean', 'expected `info.hidden`')
    return this.info.hidden
  }

  /**
   * Get the option id.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Option id
   */
  public get id(): string {
    if (this.long) return this.long.replace(/^--/, chars.empty)
    ok(this.short, 'expected short flag')
    return this.short.replace(/^-/, chars.empty)
  }

  /**
   * Get the name of the option in a format that can be used an object property
   * key.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Property key
   */
  public get key(): string {
    return ifelse(this.info.snakecase, snakecase, camelcase)(this.id)
  }

  /**
   * Get the long flag for the option.
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
    return fallback(this.info.long, null)
  }

  /**
   * Get a boolean indicating if the option must have a value after parsing.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option must have value after parsing, `false` otherwise
   */
  public get mandatory(): boolean {
    return !!this.info.mandatory
  }

  /**
   * Get a boolean indicating if a value is optional when the option is
   * specified.
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
   * Get a boolean indicating if a value must be supplied when the option is
   * specified.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option-argument is required, `false` otherwise
   */
  public get required(): boolean {
    return this.info.required
  }

  /**
   * Get the short flag for the option.
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
    return fallback(this.info.short, null)
  }

  /**
   * Get a boolean indicating if the option can be specified multiple times.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if option can be specified multiple times, `false` otherwise
   */
  public get variadic(): boolean {
    return this.info.variadic
  }

  /**
   * Set option choices.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} choices
   *  List of option choices
   * @return {this}
   *  `this` option
   */
  public choices(choices: List<string> | null | undefined): this

  /**
   * Get option choices.
   *
   * @public
   * @instance
   *
   * @return {Set<string>}
   *  List of option choices
   */
  public choices(): Set<string>

  /**
   * Get or set option choices.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} [choices]
   *  List of option choices
   * @return {Set<string> | this}
   *  List of option choices or `this` option
   */
  public choices(
    choices?: List<string> | null | undefined
  ): Set<string> | this {
    if (arguments.length) return this.info.choices = choices, this
    return new Set(this.info.choices)
  }

  /**
   * Set the default value configuration.
   *
   * @see {@linkcode DefaultInfo}
   *
   * @public
   * @instance
   *
   * @param {DefaultInfo | null | undefined} info
   *  Default value info
   * @return {this}
   *  `this` option
   */
  public default(info: DefaultInfo | null | undefined): this

  /**
   * Get the default value configuration.
   *
   * @see {@linkcode DefaultInfo}
   *
   * @template {any} T
   *  Default value type
   *
   * @public
   * @instance
   *
   * @return {DefaultInfo<T>}
   *  Default value info
   */
  public default<T>(): DefaultInfo<T>

  /**
   * Get or set the default value configuration.
   *
   * @see {@linkcode DefaultInfo}
   *
   * @public
   * @instance
   *
   * @param {DefaultInfo | null | undefined} [info]
   *  Default value info
   * @return {DefaultInfo | this}
   *  Default value info or `this` option
   */
  public default(
    info?: DefaultInfo | null | undefined
  ): DefaultInfo | this {
    if (arguments.length) return this.info.default = info, this
    return fallback(this.info.default, { value: undefined }, isNIL)
  }

  /**
   * Set the option description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} description
   *  Description of option
   * @return {this}
   *  `this` option
   */
  public description(description: URL | string | null | undefined): this

  /**
   * Get the option description.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Description of `this` option
   */
  public description(): string

  /**
   * Get or set the option description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} [description]
   *  Description of option
   * @return {string | this}
   *  Description of `this` option or `this` option
   */
  public description(
    description?: URL | string | null | undefined
  ): string | this {
    if (!arguments.length) return String(this.info.description ?? chars.empty)
    return this.info.description = description && String(description), this
  }

  /**
   * Set the environment variable to check for the value of the option.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} name
   *  Environment variable name
   * @return {this}
   *  `this` option
   */
  public env(name: string | null | undefined): this

  /**
   * Get the name of the environment variable to check for the value of the
   * option.
   *
   * @public
   * @instance
   *
   * @return {string | null}
   *  Environment variable name
   */
  public env(): string | null

  /**
   * Get or set the name of the environment variable to check for the value of
   * the option.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} [name]
   *  Environment variable name
   * @return {string | this | null}
   *  Environment variable name or `this` option
   */
  public env(name?: string | null | undefined): string | this | null {
    if (!arguments.length) return fallback(this.info.env, null)
    return this.info.env = name, this
  }

  /**
   * Remove the option from help text.
   *
   * @public
   * @instance
   *
   * @param {boolean | null | undefined} [hidden=true]
   *  Whether the option should be hidden
   * @return {this}
   *  `this` option
   */
  public hide(hidden?: boolean | null | undefined): this {
    return this.info.hidden = fallback(hidden, true, isNIL), this
  }

  /**
   * Set the handler used to parse option-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @param {ParseArg<any, any> | null | undefined} parser
   *  Option-argument parser
   * @return {this}
   *  `this` option
   */
  public parser(parser: ParseArg<any, any> | null | undefined): this

  /**
   * Get the handler used to parse option-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  Parse result
   * @template {string | string[]} [V=string|string[]]
   *  The argument or arguments to parse
   *
   * @return {ParseArg<T, V>}
   *  Option-argument parser
   */
  public parser<
    T,
    V extends string | string[] = string | string[]
  >(): ParseArg<T, V>

  /**
   * Get or set the handler used to parse option-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @param {ParseArg | null | undefined} [parser]
   *  Option-argument parser
   * @return {ParseArg | this}
   *  Option-argument parser or `this` option
   */
  public parser(parser?: ParseArg | null | undefined): ParseArg | this {
    if (arguments.length) return this.info.parser = parser, this
    return fallback(this.info.parser as ParseArg, identity, isNIL)
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
   *  Option-argument preset
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
   * @return {string | null}
   *  Option-argument preset
   */
  public preset(): string | null

  /**
   * Get or set the preset to use when the option is specified without an
   * argument.
   *
   * The handler used to parse option-arguments, {@linkcode ParseArg}, will be
   * called.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} [preset]
   *  Preset to use when option is specified without an option-argument
   * @return {string | this | null}
   *  Option-argument preset or `this` option
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
      const events: Event[] = tokenize(chunks as string[], createTokenizer({
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
        initialize: initialize({
          [codes.hyphen]: [longFlag, shortFlag],
          [codes.leftBracket]: argumentSyntax,
          [codes.lt]: argumentSyntax
        })
      }))

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

        // process flag, but skip if long and short flag were already processed.
        // any unprocessed flags will be left in `parts`.
        if (token.type === tt.flag && (!this.info.long || !this.info.short)) {
          ok(event === ev.enter, 'expected flag enter event')
          ok(typeof token.chunk === 'number', 'expected `token.chunk`')
          ok(typeof token.value === 'string', 'expected string token value')

          // capture flag.
          if (token.long && !this.info.long) {
            this.info.long = token.value
          } else if (!this.info.short) {
            this.info.short = token.value
          }

          // mark flag as processed.
          chunks[token.chunk] = null

          // skip flag exit event.
          index++
        }

        // process option-argument syntax.
        if (token.type === tt.argtax && token.chunk === chunks.length - 1) {
          ok(event === ev.enter, 'expected option-argument syntax enter event')
          ok(typeof token.mandatory === 'boolean', 'expected `token.mandatory`')
          ok(typeof token.required === 'boolean', 'expected `token.required`')
          ok(typeof token.variadic === 'boolean', 'expected `token.variadic`')

          // capture option metadata.
          this.info.optional = !token.required
          this.info.required = token.required
          this.info.variadic = token.variadic

          // mandatory option-argument syntax overrides `info.mandatory` if both
          // are defined as booleans.
          if (token.mandatory || typeof this.info.mandatory !== 'boolean') {
            this.info.mandatory = token.mandatory
          }

          // mark option-argument syntax as processed.
          chunks[token.chunk] = null

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
          id: 'kronk/invalid-flags',
          reason: reason
        })
      }
    }

    // check for at least one flag.
    if (!this.info.long && !this.info.short) {
      throw new KronkError({
        cause: { flags: this.info.flags },
        id: 'kronk/no-flags',
        reason: `No flags found in ${String(this)}`
      })
    }

    return void this
  }
}

export default Option
