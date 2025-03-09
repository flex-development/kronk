/**
 * @file Utilities - isCommand
 * @module kronk/utils/isCommand
 */

import kCommand from '#internal/k-command'
import type { Command } from '@flex-development/kronk'

/**
 * Check if `value` is a {@linkcode Command}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is Command}
 *  `true` if `value` is `Command`, `false` otherwise
 */
function isCommand(this: void, value: unknown): value is Command {
  return (
    typeof value === 'object' &&
    value !== null &&
    kCommand in value &&
    value[kCommand] === true
  )
}

export default isCommand
