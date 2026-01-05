/**
 * @file Type Aliases - ParseArg
 * @module kronk/types/ParseArg
 */

/**
 * Parse a raw argument `value`.
 *
 * @template {any} [T=any]
 *  The result of the parse
 * @template {any} [Previous=T]
 *  The previous parse result
 *
 * @param {string} value
 *  The raw argument to parse
 * @param {Previous} [previous]
 *  The default argument value,
 *  or the previous parse result for variadic arguments
 * @return {T}
 *  The parse result
 */
type ParseArg<T = any, Previous = T> = (value: string, previous?: Previous) => T

export type { ParseArg as default }
