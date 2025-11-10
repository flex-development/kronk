/**
 * @file Argument
 * @module kronk/lib/Argument
 */

import initialArgument from '#constructs/initial-argument'
import keid from '#enums/keid'
import tt from '#enums/tt'
import KronkError from '#errors/kronk.error'
import kArgument from '#internal/k-argument'
import Parseable from '#lib/parseable.abstract'
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
  ArgumentSyntax
} from '@flex-development/kronk'
import { ok } from 'devlop'

/**
 * A command-argument.
 *
 * The `Argument` model is used to define the expected arguments of a command.
 *
 * Argument syntax is tokenized using {@linkcode initialArgument} construct.
 *
 * @see {@linkcode Parseable}
 *
 * @class
 * @extends {Parseable}
 */
class Argument extends Parseable {
  /**
   * Argument metadata.
   *
   * @see {@linkcode ArgumentMetadata}
   *
   * @protected
   * @instance
   * @override
   * @member {ArgumentMetadata} info
   */
  declare protected info: ArgumentMetadata

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
   *  Additional argument data
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
   *  Additional argument data
   */
  constructor(
    info: ArgumentInfo | string,
    data?: ArgumentData | null | undefined
  ) {
    if (typeof info === 'string') info = { ...data, syntax: info }

    super(info)

    Object.defineProperty(this, kArgument, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    this.info.syntax = info.syntax.trim()

    void this.tokenizeSyntax()
  }

  /**
   * The argument syntax id.
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
   * The normalized argument syntax string.
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
   * Get the argument as a human-readable string.
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
        id: keid.invalid_argument_syntax,
        reason: `Invalid command-argument syntax for ${String(this)}`
      })
    }

    return void this
  }
}

export default Argument
