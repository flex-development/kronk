/**
 * @file Interfaces - CommandInfo
 * @module kronk/interfaces/CommandInfo
 */

import type { CommandData, CommandName } from '@flex-development/kronk'

/**
 * Data used to create commands.
 *
 * @see {@linkcode CommandData}
 *
 * @extends {CommandData}
 */
interface CommandInfo extends CommandData {
  /**
   * The name of the command.
   *
   * > 👉 **Note**: The {@linkcode default} command does not need to have a
   * > name.
   *
   * @see {@linkcode CommandName}
   */
  name?: CommandName | undefined
}

export type { CommandInfo as default }
