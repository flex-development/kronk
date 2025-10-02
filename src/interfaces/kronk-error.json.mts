/**
 * @file Interfaces - KronkErrorJson
 * @module kronk/interfaces/KronkErrorJson
 */

import type { KronkErrorCause, KronkErrorId } from '@flex-development/kronk'

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
   * The suggested exit code to use with {@linkcode process.exit}.
   */
  code: number

  /**
   * The unique id representing the error.
   *
   * @see {@linkcode KronkErrorId}
   */
  id: KronkErrorId

  /**
   * The human-readable description of the error.
   */
  message: string

  /**
   * Stack trace.
   */
  stack?: string | null
}

export type { KronkErrorJson as default }
