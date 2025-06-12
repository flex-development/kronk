/**
 * @file Utilities - isCommandError
 * @module kronk/utils/isCommandError
 */

import kCommandError from '#internal/k-command-error'
import isKronkError from '#utils/is-kronk-error'
import { CommandError } from '@flex-development/kronk/errors'

/**
 * Check if `value` looks like a {@linkcode CommandError}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is CommandError}
 *  `true` if `value` looks like a `CommandError` instance, `false` otherwise
 */
function isCommandError(this: void, value: unknown): value is CommandError {
  return (
    isKronkError(value) &&
    (
      value instanceof CommandError ||
      kCommandError in value && value[kCommandError] === true
    )
  )
}

export default isCommandError
