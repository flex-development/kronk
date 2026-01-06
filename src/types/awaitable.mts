/**
 * @file Type Aliases - Awaitable
 * @module kronk/types/Awaitable
 */

/**
 * Create a union of `T` and `T` as a promise-like object.
 *
 * @template {any} [T=unknown]
 *  The value
 */
type Awaitable<T = unknown> = PromiseLike<T> | T

export type { Awaitable as default }
