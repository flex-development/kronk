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
 *  `true` if `value` looks like a `Command`, `false` otherwise
 */
function isCommand(this: void, value: unknown): value is Command {
  return (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    value !== null &&
    kCommand in value
  )
}

export default isCommand
