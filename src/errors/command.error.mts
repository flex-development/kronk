/**
 * @file Errors - CommandError
 * @module kronk/errors/CommandError
 */

import KronkError from '#errors/kronk.error'
import kCommandError from '#internal/k-command-error'
import type {
  Command,
  CommandErrorInfo,
  CommandErrorSnapshot,
  CommandSnapshot,
  ExitCode,
  KronkErrorCause
} from '@flex-development/kronk'
import { shake } from '@flex-development/tutils'

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
   * The command where the error originated.
   *
   * @see {@linkcode Command}
   *
   * @public
   * @instance
   * @member {Command | null}
   */
  public command: Command | null

  /**
   * Create a new command error.
   *
   * @see {@linkcode Command}
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
   * @param {Command | null | undefined} [info.command]
   *  The command where the error originated
   * @param {ExitCode | null | undefined} [info.code]
   *  Suggested exit code to use with {@linkcode process.exit}
   * @param {string} info.id
   *  Unique id representing the error
   * @param {string} info.reason
   *  Human-readable description of the error
   */
  constructor(info: CommandErrorInfo) {
    super(info)

    Error.captureStackTrace(this, this.constructor)

    this.command = info.command ?? null
    this.name = 'CommandError'

    Object.defineProperties(this, {
      [kCommandError]: {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false
      }, // eslint-disable-next-line sort-keys
      command: {
        enumerable: false
      }
    })
  }

  /**
   * Get a snapshot of the error.
   *
   * @see {@linkcode CommandErrorSnapshot}
   *
   * @public
   * @instance
   *
   * @return {CommandErrorSnapshot}
   *  Error snapshot object
   */
  public snapshot(): CommandErrorSnapshot {
    /**
     * Command snapshot.
     *
     * @var {CommandSnapshot | null} command
     */
    let command: CommandSnapshot | null = null

    // add command snapshot to error snapshot.
    if (this.command) {
      command = this.command.snapshot()
    }

    return shake({
      code: this.code,
      id: this.id,
      message: this.message, // eslint-disable-next-line sort-keys
      additional: this.additional,
      cause: this.cause,
      command,
      stack: this.stack
    })
  }
}

export default CommandError
