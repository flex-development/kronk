/**
 * @file Interfaces - KronkErrorInfo
 * @module kronk/interfaces/KronkErrorInfo
 */

import type { ExitCode, KronkErrorCause } from '@flex-development/kronk'

/**
 * Data used to create errors.
 */
interface KronkErrorInfo {
  /**
   * Additional lines to be logged with the error.
   */
  additional?: string | string[] | null | undefined

  /**
   * Info about the cause of the error.
   *
   * @see {@linkcode KronkErrorCause}
   */
  cause?: KronkErrorCause | null | undefined

  /**
   * Suggested exit code to use with {@linkcode process.exit}.
   *
   * @see {@linkcode ExitCode}
   *
   * @default 1
   */
  code?: ExitCode | null | undefined

  /**
   * Unique id representing the error.
   *
   * @default 'kronk/error'
   */
  id?: string | null | undefined

  /**
   * Human-readable description of the error.
   */
  reason: string
}

export type { KronkErrorInfo as default }
