/**
 * @file Type Aliases - List
 * @module kronk/types/List
 */

/**
 * A list.
 *
 * @template {any} [T=unknown]
 *  List item type
 */
type List<T = unknown> = ReadonlySet<T> | readonly T[]

export type { List as default }
