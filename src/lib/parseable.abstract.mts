/**
 * @file Parseable
 * @module kronk/lib/Parseable
 */

import identity from '#internal/identity'
import Helpable from '#lib/helpable.abstract'
import type {
  DefaultInfo,
  List,
  ParseableInfo,
  ParseableMetadata,
  ParseArg
} from '@flex-development/kronk'
import { fallback, isNIL } from '@flex-development/tutils'
import { ok } from 'devlop'

/**
 * A parse candidate.
 *
 * Parse candidates are the parseable components
 * of commands (e.g. arguments and options).
 *
 * @class
 * @abstract
 * @extends {Helpable}
 */
abstract class Parseable extends Helpable {
  /**
   * Candidate metadata.
   *
   * @see {@linkcode ParseableMetadata}
   *
   * @protected
   * @instance
   * @override
   * @member {ParseableMetadata} info
   */
  declare protected info: ParseableMetadata

  /**
   * Create a new parse candidate.
   *
   * @param {ParseableInfo | null | undefined} [info]
   *  Parse candidate info
   */
  constructor(info?: ParseableInfo | null | undefined) {
    super(info)

    ok(this.info, 'expected `this.info`')

    Object.assign(this.info, {
      choices: info?.choices,
      default: info?.default,
      parser: info?.parser
    })

    this.choices(this.info.choices)
    this.default(this.info.default)
    this.parser(this.info.parser)
  }

  /**
   * The unique id for the candidate.
   *
   * @public
   * @abstract
   * @instance
   *
   * @return {string}
   *  Unique candidate id
   */
  public abstract get id(): string

  /**
   * Whether the candidate is required.
   *
   * Required arguments must have a value after parsing.
   * Required options must have a value supplied when the option is specified.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  `true` if required syntax was used, `false` otherwise
   */
  public get required(): boolean {
    return !!this.info.required
  }

  /**
   * Whether the candidate can be specified multiple times.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  `true` if candidate can be specified multiple times, `false` otherwise
   */
  public get variadic(): boolean {
    return !!this.info.variadic
  }

  /**
   * Set candidate choices.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} choices
   *  The list of allowed candidate choices
   * @return {this}
   *  `this` candidate
   */
  public choices(choices: List<string> | null | undefined): this

  /**
   * Get candidate choices.
   *
   * @public
   * @instance
   *
   * @template {string} T
   *  Candidate choice
   *
   * @return {Set<T>}
   *  The list of candidate choices
   */
  public choices<T extends string>(): Set<T>

  /**
   * Get or set candidate choices.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} [choices]
   *  The list of candidate choices
   * @return {Set<string> | this}
   *  The list of candidate choices or `this` candidate
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
   *  The default value info
   * @return {this}
   *  `this` candidate
   */
  public default(info: DefaultInfo | null | undefined): this

  /**
   * Get the default value configuration.
   *
   * @see {@linkcode DefaultInfo}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  The default value
   *
   * @return {DefaultInfo<T> | undefined}
   *  The default value info
   */
  public default<T>(): DefaultInfo<T> | undefined

  /**
   * Get or set the default value configuration.
   *
   * @see {@linkcode DefaultInfo}
   *
   * @public
   * @instance
   *
   * @param {DefaultInfo | null | undefined} [info]
   *  The default value info
   * @return {DefaultInfo | this | undefined}
   *  The default value info or `this` candidate
   */
  public default(
    info?: DefaultInfo | null | undefined
  ): DefaultInfo | this | undefined {
    if (arguments.length) return this.info.default = info, this
    return this.info.default ?? undefined
  }

  /**
   * Set the handler used to parse candidate-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @param {ParseArg | null | undefined} parser
   *  The argument parser
   * @return {this}
   *  `this` candidate
   */
  public parser(parser: ParseArg | null | undefined): this

  /**
   * Get the handler used to parse candidate-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  The result of the parse
   * @template {any} [Previous=T]
   *  The previous parse result
   *
   * @return {ParseArg<T>}
   *  The argument parser
   */
  public parser<T, Previous = T>(): ParseArg<T, Previous>

  /**
   * Get or set the handler used to parse candidate-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @param {ParseArg | null | undefined} [parser]
   *  The argument parser
   * @return {ParseArg | this}
   *  The argument parser or `this` candidate
   */
  public parser(parser?: ParseArg | null | undefined): ParseArg | this {
    if (arguments.length) return this.info.parser = parser, this
    return fallback(this.info.parser, identity, isNIL)
  }

  /**
   * Get the candidate as a human-readable string.
   *
   * @public
   * @abstract
   * @instance
   * @override
   *
   * @return {string}
   *  String representation of `this` candidate
   */
  public abstract override toString(): string
}

export default Parseable
