/**
 * @file Interfaces - CommandMetadata
 * @module kronk/interfaces/CommandMetadata
 */

import type {
  Argument,
  Command,
  CommandInfo,
  Option,
  VersionOption
} from '@flex-development/kronk'

/**
 * Overwritten properties.
 *
 * @internal
 */
type Skip = 'arguments' | 'options' | 'subcommands'

/**
 * Command metadata.
 *
 * @see {@linkcode CommandInfo}
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
   * Map, where each key is a long or short flag and each value is the command
   * option instance registered for that flag.
   *
   * @see {@linkcode Option}
   */
  options: Map<string, Option>

  /**
   * The parent command.
   *
   * @override
   */
  parent?: null | undefined

  /**
   * Map, where each key is the name of a subcommand each value is a subcommand.
   *
   * @see {@linkcode Command}
   */
  subcommands: Map<string, Command>

  /**
   * Command version option.
   *
   * @see {@linkcode VersionOption}
   *
   * @override
   */
  version: VersionOption | null | undefined
}

export type { CommandMetadata as default, Skip }
