/**
 * @file Errors - KronkError
 * @module kronk/errors/KronkError
 */

import keid from '#enums/keid'
import kKronkError from '#internal/k-kronk-error'
import toList from '#internal/to-list'
import type {
  EmptyString,
  ExitCode,
  KronkErrorCause,
  KronkErrorId,
  KronkErrorInfo,
  KronkErrorJson
} from '@flex-development/kronk'
import { isNIL, shake } from '@flex-development/tutils'

/**
 * A command-line error.
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
   * The suggested exit code to use with {@linkcode process.exit}.
   *
   * @public
   * @instance
   * @member {number} code
   */
  public code: number

  /**
   * Unique id representing the error.
   *
   * @see {@linkcode KronkErrorId}
   *
   * @public
   * @instance
   * @member {KronkErrorId} id
   */
  public id: KronkErrorId

  /**
   * Create a new kronk error.
   *
   * @see {@linkcode KronkErrorInfo}
   *
   * @param {KronkErrorInfo | string} info
   *  Info about the error or a human-readable description of the error
   */
  constructor(info: KronkErrorInfo | string)

  /**
   * Create a new kronk error.
   *
   * @see {@linkcode EmptyString}
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkErrorId}
   *
   * @param {string} reason
   *  Human-readable description of the error
   * @param {EmptyString | KronkErrorId | null | undefined} [id]
   *  Unique id representing the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode process.exit}
   */
  constructor(
    reason: string,
    id?: EmptyString | KronkErrorId | null | undefined,
    code?: ExitCode | null | undefined
  )

  /**
   * Create a new kronk error.
   *
   * @see {@linkcode EmptyString}
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkErrorId}
   * @see {@linkcode KronkErrorInfo}
   *
   * @param {KronkErrorInfo | string} info
   *  Error info or human-readable description of the error
   * @param {EmptyString | KronkErrorId | null | undefined} [id]
   *  Unique id representing the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode process.exit}
   */
  constructor(
    info: KronkErrorInfo | string,
    id?: EmptyString | KronkErrorId | null | undefined,
    code?: ExitCode | null | undefined
  ) {
    if (typeof info === 'string') info = { code, id, reason: info }

    super(info.reason)
    Error.captureStackTrace(this, this.constructor)

    this.additional = info.additional ? toList(info.additional) : []
    this.cause = info.cause
    this.code = isNIL(info.code) ? 1 : +info.code
    this.id = info.id || keid.error
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
   *  JSON representation of `this` error
   */
  public toJSON(): KronkErrorJson {
    return shake({
      code: this.code,
      id: this.id,
      message: this.message, // eslint-disable-next-line sort-keys
      additional: this.additional,
      cause: this.cause,
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
