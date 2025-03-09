/**
 * @file Interfaces - KronkErrorJson
 * @module kronk/interfaces/KronkErrorJson
 */

import type { KronkErrorCause } from '@flex-development/kronk'

/**
 * JSON representation of an error.
 */
interface KronkErrorJson {
  /**
   * Additional lines to be logged with the error.
   */
  additional: string[]

  /**
   * Info about the cause of the error.
   *
   * @see {@linkcode KronkErrorCause}
   */
  cause?: KronkErrorCause | null

  /**
   * Suggested exit code to use with {@linkcode process.exit}.
   */
  code: number

  /**
   * Unique id representing the error.
   */
  id: string

  /**
   * Human-readable description of the error.
   */
  message: string

  /**
   * Stack trace.
   */
  stack?: string | null
}

export type { KronkErrorJson as default }
