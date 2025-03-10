/**
 * @file Type Aliases - ParseArg
 * @module kronk/types/ParseArg
 */

/**
 * Parse a command or option argument `value`.
 *
 * @template {any} [T=any]
 *  Parse result
 * @template {string | string[]} [Value=string|string[]]
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
type ParseArg<T = any, Value extends string | string[] = string | string[]> = (
  this: void,
  value: Value,
  previous: T | undefined
) => T

export type { ParseArg as default }
