/**
 * @file Argument
 * @module kronk/lib/Argument
 */

import initialArgument from '#constructs/initial-argument'
import chars from '#enums/chars'
import tt from '#enums/tt'
import KronkError from '#errors/kronk.error'
import identity from '#internal/identity'
import kArgument from '#internal/k-argument'
import {
  ev,
  tokenize,
  type Event,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type {
  ArgumentData,
  ArgumentInfo,
  ArgumentMetadata,
  ArgumentSyntax,
  DefaultInfo,
  List,
  ParseArg
} from '@flex-development/kronk'
import { fallback, isNIL } from '@flex-development/tutils'
import { ok } from 'devlop'

/**
 * Data model representing a command-argument.
 *
 * @class
 */
class Argument {
  /**
   * Argument metadata.
   *
   * @see {@linkcode ArgumentMetadata}
   *
   * @protected
   * @instance
   * @member {ArgumentMetadata} info
   */
  protected info: ArgumentMetadata

  /**
   * Create a new command-argument.
   *
   * @see {@linkcode ArgumentInfo}
   *
   * @param {ArgumentInfo | string} info
   *  Argument info or syntax
   */
  constructor(info: ArgumentInfo | string)

  /**
   * Create a new command-argument.
   *
   * @see {@linkcode ArgumentData}
   *
   * @param {string} syntax
   *  Argument syntax
   * @param {ArgumentData | null | undefined} [info]
   *  Argument data
   */
  constructor(syntax: string, info?: ArgumentData | null | undefined)

  /**
   * Create a new command-argument.
   *
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentInfo}
   *
   * @param {ArgumentInfo | string} info
   *  Argument info or syntax
   * @param {ArgumentData | null | undefined} [data]
   *  Argument data
   */
  constructor(
    info: ArgumentInfo | string,
    data?: ArgumentData | null | undefined
  ) {
    if (typeof info === 'string') info = { ...data, syntax: info }

    this.info = {
      ...info,
      id: chars.empty,
      required: false,
      syntax: info.syntax.trim(),
      variadic: false
    }

    Object.defineProperty(this, kArgument, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    void this.tokenizeSyntax()

    this.choices(this.info.choices)
    this.default(this.info.default)
    this.description(this.info.description)
    this.parser(this.info.parser)
  }

  /**
   * Get the argument syntax id.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Argument syntax id
   */
  public get id(): string {
    return this.info.id
  }

  /**
   * Get a boolean indicating if the argument must have a value after parsing.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  `true` if `this` argument value is required, `false` otherwise
   */
  public get required(): boolean {
    return this.info.required
  }

  /**
   * Get the syntax for the argument.
   *
   * @see {@linkcode ArgumentSyntax}
   *
   * @public
   * @instance
   *
   * @return {ArgumentSyntax}
   *  Argument syntax
   */
  public get syntax(): ArgumentSyntax {
    return this.info.syntax as ArgumentSyntax
  }

  /**
   * Get a boolean indicating if the argument can be specified multiple times.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if argument can be specified multiple times, `false` otherwise
   */
  public get variadic(): boolean {
    return this.info.variadic
  }

  /**
   * Set argument choices.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} choices
   *  List of argument choices
   * @return {this}
   *  `this` argument
   */
  public choices(choices: List<string> | null | undefined): this

  /**
   * Get argument choices.
   *
   * @public
   * @instance
   *
   * @return {Set<string>}
   *  List of argument choices
   */
  public choices(): Set<string>

  /**
   * Get or set argument choices.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} [choices]
   *  List of argument choices
   * @return {Set<string> | this}
   *  List of argument choices or `this` argument
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
   *  `this` argument
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
   *  Default value info or `this` argument
   */
  public default(
    info?: DefaultInfo | null | undefined
  ): DefaultInfo | this {
    if (arguments.length) return this.info.default = info, this
    return fallback(this.info.default, { value: undefined }, isNIL)
  }

  /**
   * Set the argument description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} description
   *  Description of argument
   * @return {this}
   *  `this` argument
   */
  public description(description: URL | string | null | undefined): this

  /**
   * Get the argument description.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Description of `this` argument
   */
  public description(): string

  /**
   * Get or set the argument description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} [description]
   *  Description of argument
   * @return {string | this}
   *  Description of `this` argument or `this` argument
   */
  public description(
    description?: URL | string | null | undefined
  ): string | this {
    if (!arguments.length) return String(this.info.description ?? chars.empty)
    return this.info.description = description && String(description), this
  }

  /**
   * Set the handler used to parse command-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @template {any} [T=unknown]
   *  Parsed argument
   *
   * @param {ParseArg<T> | null | undefined} parser
   *  Command-argument parser
   * @return {this}
   *  `this` argument
   */
  public parser(parser: ParseArg<any, any> | null | undefined): this

  /**
   * Get the handler used to parse command-arguments.
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
   *  Command-argument parser
   */
  public parser<
    T,
    V extends string | string[] = string | string[]
  >(): ParseArg<T, V>

  /**
   * Get or set the handler used to parse command-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @param {ParseArg | null | undefined} [parser]
   *  Command-argument parser
   * @return {ParseArg | null | this}
   *  Command-argument parser or `this` argument
   */
  public parser(parser?: ParseArg | null | undefined): ParseArg | this {
    if (!arguments.length) return fallback(this.info.parser, identity, isNIL)
    return this.info.parser = parser, this
  }

  /**
   * Get the human readable equivalent of the argument.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  String representation of `this` argument
   */
  public toString(): string {
    return `Argument(${JSON.stringify(this.syntax).slice(1, -1)})`
  }

  /**
   * Tokenize argument `syntax`.
   *
   * > 👉 **Note**: Modifies `this.info.syntax` and expects its value to be a
   * > trimmed string before modification.
   *
   * @see {@linkcode KronkError}
   *
   * @protected
   * @instance
   *
   * @return {undefined}
   * @throws {KronkError}
   *  If argument `syntax` is invalid
   */
  protected tokenizeSyntax(): undefined {
    /**
     * List of events.
     *
     * @const {Event[]} events
     */
    const events: Event[] = tokenize(this.info.syntax, {
      debug: 'kronk/argument',
      /**
       * @this {void}
       *
       * @param {TokenizeContext} context
       *  Base tokenize context
       * @return {undefined}
       */
      finalizeContext(this: void, context: TokenizeContext): undefined {
        return context[kArgument] = true, void context
      },
      initial: initialArgument
    })

    if (events.length) {
      ok(events.length === 2, 'expected `2` events')
      ok(events[0]![0] === ev.enter, 'expected enter event')
      ok(events[1]![0] === ev.exit, 'expected exit event')
      const [, token] = events[0]!

      ok(token.type === tt.argtax, 'expected argument syntax token')
      ok(typeof token.id === 'string', 'expected `token.id`')
      ok(typeof token.required === 'boolean', 'expected `token.required`')
      ok(typeof token.value === 'string', 'expected string token value')
      ok(typeof token.variadic === 'boolean', 'expected `token.variadic`')

      // capture metadata.
      this.info.id = token.id
      this.info.required = token.required
      this.info.variadic = token.variadic
      this.info.syntax = token.value
    } else {
      throw new KronkError({
        cause: { syntax: this.info.syntax },
        id: 'kronk/invalid-argument-syntax',
        reason: `Invalid command-argument syntax for ${String(this)}`
      })
    }

    return void this
  }
}

export default Argument
