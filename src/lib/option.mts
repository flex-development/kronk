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
import orNIL from '#internal/or-nil'
import snakecase from '#internal/snakecase'
import toChunks from '#internal/to-chunks'
import toList from '#internal/to-list'
import {
  ev,
  tokenize,
  type Event,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type {
  DefaultInfo,
  Flags,
  List,
  OptionData,
  OptionEventName,
  OptionInfo,
  OptionMetadata,
  ParseArg
} from '@flex-development/kronk'
import { KronkError } from '@flex-development/kronk/errors'
import {
  fallback,
  identity,
  ifelse,
  isFalsy,
  isNIL,
  isString
} from '@flex-development/tutils'
import { ok } from 'devlop'

/**
 * A command option.
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
   *  Additional option info
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
   *  Additional option info
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
   * Get the event name for the option.
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
   * Get option flags.
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
   * Whether the option should **not** be displayed in help text.
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
    if (this.short && !this.long) return this.short.replace(/^-/, chars.empty)
    ok(this.long, 'expected long flag')
    return this.long.replace(/^--/, chars.empty)
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
    return fallback(this.info.long, null, isFalsy)
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
    return fallback(this.info.short, null, isFalsy)
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
    return this.info.description = orNIL(description), this
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
   *  The name of the environment variable to check
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
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} [env]
   *  The name of the environment variable to check
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

          // capture flag.
          if (!this.info.long || !this.info.short) {
            if (token.long && !this.info.long) {
              this.info.long = token.value
            } else if (!this.info.short) {
              this.info.short = token.value
            }

            // mark flag as processed.
            chunks[token.start._index] = null
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

          // mandatory option-argument syntax overrides `info.mandatory` if
          // both are defined as booleans.
          if (token.mandatory || typeof this.info.mandatory !== 'boolean') {
            this.info.mandatory = token.mandatory
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
