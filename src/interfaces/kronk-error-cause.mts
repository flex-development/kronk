/**
 * @file Interfaces - KronkErrorCause
 * @module kronk/interfaces/KronkErrorCause
 */

/**
 * Info about the cause of an error.
 *
 * > 👉 **Note**: {@linkcode Symbol.hasInstance} and
 * > {@linkcode Symbol.unscopables} are used to identify arrays and functions.
 */
interface KronkErrorCause {
  [Symbol.hasInstance]?: never
  [Symbol.unscopables]?: never
  [key: string]: any
}

export type { KronkErrorCause as default }
