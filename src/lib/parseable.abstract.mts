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
  ParseArg,
  RawParseValue
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
   *  List of allowed candidate choices
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
   *  List of candidate choices
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
   *  List of candidate choices
   * @return {Set<string> | this}
   *  List of candidate choices or `this` candidate
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
   *  Default value
   *
   * @return {DefaultInfo<T> | undefined}
   *  Default value info
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
   *  Default value info
   * @return {DefaultInfo | this | undefined}
   *  Default value info or `this` candidate
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
   * @param {ParseArg<any, any> | null | undefined} parser
   *  The candidate-argument parser
   * @return {this}
   *  `this` candidate
   */
  public parser(parser: ParseArg<any, any> | null | undefined): this

  /**
   * Get the handler used to parse candidate-arguments.
   *
   * @see {@linkcode ParseArg}
   * @see {@linkcode RawParseValue}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  Parse result
   * @template {RawParseValue} [Value=RawParseValue]
   *  The argument or arguments to parse
   *
   * @return {ParseArg<T, Value>}
   *  The candidate-argument parser
   */
  public parser<
    T,
    Value extends RawParseValue = RawParseValue
  >(): ParseArg<T, Value>

  /**
   * Get or set the handler used to parse candidate-arguments.
   *
   * @see {@linkcode ParseArg}
   *
   * @public
   * @instance
   *
   * @param {ParseArg | null | undefined} [parser]
   *  The candidate-argument parser
   * @return {ParseArg | this}
   *  The candidate-argument parser or `this` candidate
   */
  public parser(parser?: ParseArg | null | undefined): ParseArg | this {
    if (arguments.length) return this.info.parser = parser, this
    return fallback(this.info.parser as ParseArg, identity, isNIL)
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
