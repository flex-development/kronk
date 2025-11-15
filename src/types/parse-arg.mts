/**
 * @file Type Aliases - ParseArg
 * @module kronk/types/ParseArg
 */

import type { RawParseValue } from '@flex-development/kronk'

/**
 * Parse a command or option argument `value`.
 *
 * @see {@linkcode RawParseValue}
 *
 * @template {any} [T=any]
 *  Parse result
 * @template {RawParseValue} [Value=RawParseValue]
 *  The argument or arguments to parse
 *
 * @this {void}
 *
 * @param {Value} value
 *  The raw argument or arguments to parse
 * @param {T | undefined} previous
 *  The default argument value
 * @return {T}
 *  Parse result
 */
type ParseArg<T = any, Value extends RawParseValue = RawParseValue> = (
  this: void,
  value: Value,
  previous: T | undefined
) => T

export type { ParseArg as default }
