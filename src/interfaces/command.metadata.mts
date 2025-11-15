/**
 * @file Interfaces - CommandMetadata
 * @module kronk/interfaces/CommandMetadata
 */

import type {
  Argument,
  Command,
  CommandInfo,
  ExampleInfo,
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
   * List of command aliases.
   */
  aliases: Set<string>

  /**
   * List of command arguments.
   *
   * @see {@linkcode Argument}
   */
  arguments: Argument[]

  /**
   * A list of command examples.
   *
   * @see {@linkcode ExampleInfo}
   *
   * @override
   */
  examples: ExampleInfo[]

  /**
   * The help subcommand.
   *
   * @see {@linkcode Command}
   *
   * @override
   */
  helpCommand: Command | null | undefined

  /**
   * The help option.
   *
   * @see {@linkcode Option}
   *
   * @override
   */
  helpOption: Option | null | undefined

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
   * The version option.
   *
   * @see {@linkcode VersionOption}
   *
   * @override
   */
  version: VersionOption | null | undefined
}

export type { CommandMetadata as default, Skip }
