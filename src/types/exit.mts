/**
 * @file Type Aliases - Exit
 * @module kronk/types/Exit
 */

import type { Command, CommandError } from '@flex-development/kronk'

/**
 * Callback to fire when the process is exited.
 *
 * @see {@linkcode Command}
 * @see {@linkcode CommandError}
 *
 * @this {Command}
 *
 * @param {CommandError | null | undefined} [e]
 *  Command error instance
 * @return {never | undefined}
 */
type Exit = (
  this: Command,
  e?: CommandError | null | undefined
) => never | undefined

export type { Exit as default }
