/**
 * @file Type Aliases - Hook
 * @module kronk/types/Hook
 */

import type { Awaitable, Command } from '@flex-development/kronk'

/**
 * The callback to fire before or after the running command's action.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Command}
 *
 * @template {Command} [This=Command]
 *  The `this` context of the hook
 * @template {Command} [Runner=Command]
 *  The running command
 *
 * @this {This}
 *
 * @param {Runner} command
 *  The running command
 * @return {Awaitable<null | undefined | void>}
 */
type Hook<
  This extends Command = Command,
  Runner extends Command = Command
> = (
  this: This,
  command: Runner
) => Awaitable<null | undefined | void>

export type { Hook as default }
