/**
 * @file Type Aliases - Action
 * @module kronk/types/Action
 */

import type { Awaitable, Command, OptionValues } from '@flex-development/kronk'

/**
 * Callback to fire when a command is executed.
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
 *  The command or subcommand being executed
 *
 * @param {Opts} options
 *  Parsed command options
 * @param {Args} args
 *  Parsed command arguments
 * @return {Awaitable<null | undefined | void>}
 *  Nothing
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
