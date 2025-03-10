/**
 * @file Errors - CommandError
 * @module kronk/errors/CommandError
 */

import KronkError from '#errors/kronk.error'
import kCommandError from '#internal/k-command-error'
import type {
  CommandErrorInfo,
  ExitCode,
  KronkErrorCause
} from '@flex-development/kronk'

/**
 * Command error model.
 *
 * @see {@linkcode KronkError}
 *
 * @category
 *  errors
 *
 * @class
 * @extends {KronkError}
 */
class CommandError extends KronkError {
  /**
   * Create a new command error.
   *
   * @see {@linkcode CommandErrorInfo}
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkErrorCause}
   *
   * @param {CommandErrorInfo} info
   *  Info about the error
   * @param {string | string[] | null | undefined} [info.additional]
   *  Additional lines to be logged with the error
   * @param {KronkErrorCause | null | undefined} [info.cause]
   *  Info about the cause of the error
   * @param {ExitCode | null | undefined} [info.code]
   *  Suggested exit code to use with {@linkcode process.exit}
   * @param {string} info.id
   *  Unique id representing the error
   * @param {string} info.reason
   *  Human-readable description of the error
   */
  constructor(info: CommandErrorInfo)

  /**
   * Create a new command error.
   *
   * @see {@linkcode ExitCode}
   *
   * @param {string} id
   *  Unique id representing the error
   * @param {string} reason
   *  Human-readable description of the error
   * @param {ExitCode | null | undefined} [code]
   *  Info about the cause of the error or
   *  the suggested exit code to use with {@linkcode process.exit}
   */
  constructor(
    id: string,
    reason: string,
    code?: ExitCode | null | undefined
  )

  /**
   * Create a new command error.
   *
   * @see {@linkcode CommandErrorInfo}
   * @see {@linkcode ExitCode}
   *
   * @param {CommandErrorInfo | string} info
   *  Error info or unique error id
   * @param {string} [reason]
   *  Human-readable description of the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode process.exit}
   */
  constructor(
    info: CommandErrorInfo | string,
    reason?: string,
    code?: ExitCode | null | undefined
  ) {
    if (typeof info === 'string') info = { code, id: info, reason: reason! }
    super(info)

    Error.captureStackTrace(this, this.constructor)
    this.name = 'CommandError'

    Object.defineProperty(this, kCommandError, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })
  }
}

export default CommandError
