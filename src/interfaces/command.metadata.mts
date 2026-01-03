/**
 * @file Interfaces - CommandMetadata
 * @module kronk/interfaces/CommandMetadata
 */

import type {
  Action,
  Argument,
  Command,
  CommandInfo,
  ExampleInfo,
  Help,
  HooksInfo,
  Option
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
   * The callback to fire when the command is ran.
   *
   * @see {@linkcode Action}
   *
   * @override
   */
  action: Action<any>

  /**
   * The list of command aliases.
   */
  aliases: Set<string>

  /**
   * The list of command arguments.
   *
   * @see {@linkcode Argument}
   */
  arguments: Argument[]

  /**
   * The list of command examples.
   *
   * @see {@linkcode ExampleInfo}
   *
   * @override
   */
  examples: ExampleInfo[]

  /**
   * The help text utility to use when generating help text.
   *
   * @see {@linkcode Help}
   *
   * @override
   */
  help: Help | null | undefined

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
   * The hooks configuration.
   *
   * @see {@linkcode HooksInfo}
   *
   * @override
   */
  hooks: HooksInfo

  /**
   * Map, where each key is a long or short flag and each value is the option
   * instance registered for that flag.
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
   * @see {@linkcode Option}
   *
   * @override
   */
  versionOption: Option | null | undefined
}

export type { CommandMetadata as default, Skip }
