/**
 * @file Interfaces - KronkErrorMap
 * @module kronk/interfaces/KronkErrorMap
 */

import type { CommandError, KronkError } from '@flex-development/kronk'

/**
 * Registry of errors.
 *
 * Each key is the **suffix** of an error id
 * and each value is a {@linkcode KronkError}.
 *
 * This interface can be augmented to register custom errors.
 *
 * @example
 *  declare module '@flex-development/kronk' {
 *    interface KronkErrorMap {
 *      custom: CustomKronkError
 *    }
 *  }
 */
interface KronkErrorMap {
  'argument-after-variadic': CommandError
  'duplicate-option': CommandError
  'duplicate-subcommand': CommandError
  'excess-arguments': CommandError
  'invalid-argument': CommandError
  'invalid-argument-syntax': KronkError
  'invalid-flags': KronkError
  'invalid-subcommand-name': CommandError
  'missing-argument': CommandError
  'missing-mandatory-option': CommandError
  'no-flags': KronkError
  'unknown-option': CommandError
  error: KronkError
}

export type { KronkErrorMap as default }
