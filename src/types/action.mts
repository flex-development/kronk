/**
 * @file Type Aliases - Action
 * @module kronk/types/Action
 */

import type { Awaitable, Command, OptionValues } from '@flex-development/kronk'

/**
 * The callback to fire when a command is ran.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Command}
 *
 * @template {OptionValues} [Opts=OptionValues]
 *  Command options
 * @template {any[]} [Args=any[]]
 *  Command arguments
 *
 * @this {Command}
 *  The command to be ran
 *
 * @param {Opts} opts
 *  The parsed command options
 * @param {Args} args
 *  The parsed command arguments
 * @return {Awaitable<null | undefined | void>}
 */
type Action<
  Opts extends OptionValues = OptionValues,
  Args extends any[] = any[]
> = (
  this: Command,
  opts: Opts,
  ...args: Args
) => Awaitable<null | undefined | void>

export type { Action as default }
