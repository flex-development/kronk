/**
 * @file Errors - KronkError
 * @module kronk/errors/KronkError
 */

import kKronkError from '#internal/k-kronk-error'
import toList from '#internal/to-list'
import type {
  ExitCode,
  KronkErrorCause,
  KronkErrorInfo,
  KronkErrorJson
} from '@flex-development/kronk'
import { isNIL, shake } from '@flex-development/tutils'

/**
 * Kronk error model.
 *
 * @category
 *  errors
 *
 * @class
 * @extends {Error}
 */
class KronkError extends Error {
  /**
   * Additional lines to be logged with the error.
   *
   * @public
   * @instance
   * @member {string[]} additional
   */
  public additional: string[]

  /**
   * Info about the cause of the error.
   *
   * @see {@linkcode KronkErrorCause}
   *
   * @public
   * @instance
   * @override
   * @member {KronkErrorCause | null | undefined} cause
   */
  public override cause?: KronkErrorCause | null | undefined

  /**
   * Suggested exit code to use with {@linkcode process.exit}.
   *
   * @public
   * @instance
   * @member {number} code
   */
  public code: number

  /**
   * Unique id representing the error.
   *
   * @public
   * @instance
   * @member {string} id
   */
  public id: string

  /**
   * Create a new kronk error.
   *
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkErrorCause}
   * @see {@linkcode KronkErrorInfo}
   *
   * @param {KronkErrorInfo} info
   *  Info about the error
   * @param {string | string[] | null | undefined} [info.additional]
   *  Additional lines to be logged with the error
   * @param {KronkErrorCause | null | undefined} [info.cause]
   *  Info about the cause of the error
   * @param {ExitCode | null | undefined} [info.code]
   *  Suggested exit code to use with {@linkcode process.exit}
   * @param {string | null | undefined} [info.id]
   *  Unique id representing the error
   * @param {string} info.reason
   *  Human-readable description of the error
   */
  constructor(info: KronkErrorInfo)

  /**
   * Create a new kronk error.
   *
   * @see {@linkcode ExitCode}
   *
   * @param {string} reason
   *  Human-readable description of the error
   * @param {string | null | undefined} [id]
   *  Unique id representing the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode process.exit}
   */
  constructor(
    reason: string,
    id?: string | null | undefined,
    code?: ExitCode | null | undefined
  )

  /**
   * Create a new kronk error.
   *
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkErrorInfo}
   *
   * @param {KronkErrorInfo | string} info
   *  Error info or human-readable description of the error
   * @param {string | null | undefined} [id]
   *  Unique id representing the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode process.exit}
   */
  constructor(
    info: KronkErrorInfo | string,
    id?: string | null | undefined,
    code?: ExitCode | null | undefined
  ) {
    if (typeof info === 'string') info = { code, id, reason: info }

    super(info.reason)
    Error.captureStackTrace(this, this.constructor)

    this.additional = info.additional ? toList(info.additional) : []
    this.cause = info.cause
    this.code = isNIL(info.code) ? 1 : +info.code
    this.id = info.id || 'kronk/error'
    this.name = 'KronkError'

    Object.defineProperty(this, kKronkError, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })
  }

  /**
   * Get the error as a JSON object.
   *
   * @see {@linkcode KronkErrorJson}
   *
   * @public
   * @instance
   *
   * @return {KronkErrorJson}
   *  JSON representation of `this` object
   */
  public toJSON(): KronkErrorJson {
    return shake({
      additional: this.additional,
      cause: this.cause,
      code: this.code,
      id: this.id,
      message: this.message,
      stack: this.stack
    })
  }

  /**
   * Get the error as a human-readable string.
   *
   * @public
   * @instance
   * @override
   *
   * @return {string}
   *  String representation of `this` error
   */
  public override toString(): string {
    return `[${this.id}] ${this.message}`
  }
}

export default KronkError
