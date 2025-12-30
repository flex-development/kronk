/**
 * @file Type Aliases - ParseArg
 * @module kronk/types/ParseArg
 */

/**
 * Parse a raw argument `value`.
 *
 * @template {any} [T=any]
 *  The result of the parse
 *
 * @param {string} value
 *  The raw argument to parse
 * @param {T} [previous]
 *  The default argument value,
 *  or the previous parse result for variadic arguments
 * @return {T}
 *  The parse result
 */
type ParseArg<T = any> = (value: string, previous?: T) => T

export type { ParseArg as default }
