/**
 * @file Interfaces - CommandMetadata
 * @module kronk/interfaces/CommandMetadata
 */

import type {
  Argument,
  Command,
  CommandInfo,
  Option
} from '@flex-development/kronk'

/**
 * Overwritten {@linkcode CommandInfo} properties.
 *
 * @internal
 */
type Skip = 'arguments' | 'options'

/**
 * Command metadata.
 *
 * @see {@linkcode CommandInfo}
 * @see {@linkcode Skip}
 *
 * @extends {Omit<CommandInfo,Skip>}
 */
interface CommandMetadata extends Omit<CommandInfo, Skip> {
  /**
   * List of command arguments.
   *
   * @see {@linkcode Argument}
   */
  arguments: Argument[]

  /**
   * Map, where key is a long or short flag and each value is the command option
   * instance registered for that flag.
   *
   * @see {@linkcode Option}
   */
  options: Map<string, Option>

  /**
   * List of subcommands.
   *
   * @see {@linkcode Command}
   */
  subcommands: Command[]
}

export type { CommandMetadata as default, Skip }
