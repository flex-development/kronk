/**
 * @file Type Aliases - Awaitable
 * @module kronk/types/Awaitable
 */

/**
 * Create a union of `T` and `T` as a promise.
 *
 * @template {any} [T=unknown]
 *  Value
 */
type Awaitable<T = unknown> = Promise<T> | T

export type { Awaitable as default }
