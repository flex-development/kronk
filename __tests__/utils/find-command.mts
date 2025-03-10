/**
 * @file Test Utilities - findCommand
 * @module tests/utils/findCommand
 */

import type { Command, CommandName, List } from '@flex-development/kronk'

/**
 * Find a command with a name or alias matching `x`.
 *
 * @see {@linkcode CommandName}
 * @see {@linkcode Command}
 * @see {@linkcode List}
 *
 * @this {void}
 *
 * @param {Command} command
 *  Parent command
 * @param {CommandName | List<CommandName>} x
 *  Command name, command alias, or list of names and/or aliases
 * @return {Command | undefined}
 *  Command with name or alias matching `x`
 */
function findCommand(
  this: void,
  command: Command,
  x: CommandName | List<CommandName>
): Command | undefined { // @ts-expect-error [2445] testing.
  return command.findCommand(x)
}

export default findCommand
