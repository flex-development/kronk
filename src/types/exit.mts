/**
 * @file Type Aliases - Exit
 * @module kronk/types/Exit
 */

import type { Command, CommandError, KronkError } from '@flex-development/kronk'

/**
 * Callback to fire when the process is exited.
 *
 * @see {@linkcode Command}
 * @see {@linkcode CommandError}
 * @see {@linkcode KronkError}
 *
 * @this {Command}
 *
 * @param {CommandError | KronkError | null | undefined} [e]
 *  The error to handle
 * @return {undefined}
 */
type Exit = (
  this: Command,
  e?: CommandError | KronkError | null | undefined
) => undefined

export type { Exit as default }
