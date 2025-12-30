/**
 * @file Utilities - isSubcommandInfo
 * @module kronk/utils/isSubcommandInfo
 */

import kCommand from '#internal/k-command'
import isArgument from '#utils/is-argument'
import isKronkError from '#utils/is-kronk-error'
import isKronkEvent from '#utils/is-kronk-event'
import isOption from '#utils/is-option'
import type { SubcommandInfo } from '@flex-development/kronk'

/**
 * Check if `value` is a subcommand info object.
 *
 * @see {@linkcode SubcommandInfo}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is SubcommandInfo}
 *  `true` if `value` looks like subcommand info object, `false` otherwise
 */
function isSubcommandInfo(this: void, value: unknown): value is SubcommandInfo {
  return (
    !Array.isArray(value) &&
    !isArgument(value) &&
    !isKronkError(value) &&
    !isKronkEvent(value) &&
    !isOption(value) &&
    typeof value === 'object' &&
    value !== null &&
    !(kCommand in value) &&
    'name' in value &&
    typeof value.name === 'string'
  )
}

export default isSubcommandInfo
