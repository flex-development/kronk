/**
 * @file Test Utilities - errorSnapshot
 * @module tests/utils/errorSnapshot
 */

import KronkError from '#errors/kronk.error'
import type {
  CommandError,
  CommandErrorSnapshot,
  KronkErrorJson
} from '@flex-development/kronk'
import { omit } from '@flex-development/tutils'

/**
 * Get a snapshot of an `error`.
 *
 * > 👉 **Note**: Vitest snapshot serializers do not work with error objects.
 *
 * @this {void}
 *
 * @param {CommandError | KronkError} err
 *  The error to snapshot
 * @return {Omit<CommandErrorSnapshot | KronkErrorJson, 'stack'>}
 *  Error snapshot object
 */
function errorSnapshot(
  this: void,
  err: CommandError | KronkError
): Omit<CommandErrorSnapshot | KronkErrorJson, 'stack'> {
  return omit('snapshot' in err ? err.snapshot() : err.toJSON(), ['stack'])
}

export default errorSnapshot
