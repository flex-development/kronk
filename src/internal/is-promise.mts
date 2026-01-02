/**
 * @file Internal - isPromise
 * @module kronk/internal/isPromise
 */

/**
 * Check if `value` is a {@linkcode Promise}.
 *
 * @internal
 *
 * @template {any} T
 *  The resolved value of the promise
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is Promise<T>}
 *  `true` if `value` is {@linkcode Promise}, `false` otherwise
 */
function isPromise<T>(this: void, value: unknown): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  )
}

export default isPromise
