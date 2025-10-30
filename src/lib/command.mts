/**
 * @file Command
 * @module kronk/lib/Command
 */

import initialCommand from '#constructs/initial-command'
import chars from '#enums/chars'
import keid from '#enums/keid'
import optionValueSource from '#enums/option-value-source'
import tt from '#enums/tt'
import formatList from '#internal/format-list'
import isList from '#internal/is-list'
import kCommand from '#internal/k-command'
import noop from '#internal/noop'
import orNIL from '#internal/or-nil'
import toChunks from '#internal/to-chunks'
import toList from '#internal/to-list'
import Argument from '#lib/argument'
import Option from '#lib/option'
import VersionOption from '#lib/version.option'
import {
  ev,
  tokenize,
  type Event,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type {
  Action,
  ArgumentData,
  ArgumentInfo,
  ArgumentSyntax,
  CommandData,
  CommandErrorInfo,
  CommandInfo,
  CommandMetadata,
  CommandName,
  CommandSnapshot,
  DefaultInfo,
  Exit,
  Flags,
  KronkEventListener,
  List,
  OptionData,
  OptionInfo,
  OptionValues,
  OptionValueSource,
  OptionValueSources,
  ParseArg,
  ParseOptions,
  Process,
  RawOptionValue,
  SubcommandInfo,
  SubcommandsInfo,
  UnknownStrategy,
  UsageData,
  UsageInfo,
  VersionData,
  VersionOptionInfo
} from '@flex-development/kronk'
import { CommandError, KronkError } from '@flex-development/kronk/errors'
import { KronkEvent, OptionEvent } from '@flex-development/kronk/events'
import {
  isKronkError,
  isOption,
  isSubcommandInfo
} from '@flex-development/kronk/utils'
import { createLogger, type Logger } from '@flex-development/log'
import { FancyReporter } from '@flex-development/log/reporters'
import {
  fallback,
  includes,
  isNIL,
  reduce,
  reduceRight
} from '@flex-development/tutils'
import { ok } from 'devlop'
import EventEmitter, { type OnOptions } from 'eventemitter2'
import plur from 'plur'

/**
 * A command.
 *
 * Commands use the {@linkcode initialCommand} construct to tokenize arguments,
 * delimiters, operands, option flags, and subcommand names.
 *
 * @class
 */
class Command {
  /**
   * The event whose listener overrides the command action handler and any
   * parsing checks (i.e. mandatory options, required arguments).
   *
   * @see {@linkcode KronkEvent}
   *
   * @protected
   * @instance
   * @member {KronkEvent | null} actionEvent
   */
  protected actionEvent: KronkEvent | null

  /**
   * Parsed command-line arguments.
   *
   * @public
   * @instance
   * @member {any[]} args
   */
  public args: any[]

  /**
   * Raw command-line arguments.
   *
   * @public
   * @instance
   * @member {string[]} argv
   */
  public argv: string[]

  /**
   * The default command.
   *
   * @public
   * @instance
   * @member {Command | null | undefined} defaultCommand
   */
  public defaultCommand: Command | null | undefined

  /**
   * Command event emitter.
   *
   * @see {@linkcode EventEmitter}
   *
   * @protected
   * @readonly
   * @instance
   * @member {EventEmitter}
   */
  protected readonly events: EventEmitter

  /**
   * Command metadata.
   *
   * @see {@linkcode CommandMetadata}
   *
   * @protected
   * @instance
   * @member {CommandMetadata} info
   */
  protected info: CommandMetadata

  /**
   * Logger instance.
   *
   * @see {@linkcode Logger}
   *
   * @public
   * @instance
   * @member {Logger} logger
   */
  public logger: Logger

  /**
   * Record, where each key is an option key and each value is the source of an
   * option value.
   *
   * @see {@linkcode OptionValueSources}
   *
   * @protected
   * @instance
   * @member {OptionValueSources} optionValueSources
   */
  protected optionValueSources: OptionValueSources

  /**
   * Record, where each key is an option key and each value is a parsed option
   * value.
   *
   * @see {@linkcode OptionValues}
   *
   * @protected
   * @instance
   * @member {OptionValues} optionValues
   */
  protected optionValues: OptionValues

  /**
   * The parent command.
   *
   * @public
   * @instance
   * @member {Command | null | undefined} parent
   */
  public parent: Command | null | undefined

  /**
   * Information about the current process.
   *
   * @see {@linkcode Process}
   *
   * @public
   * @instance
   * @member {Process} process
   */
  public process: Process

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandInfo}
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name
   */
  constructor(info?: CommandInfo | string | null | undefined)

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandData}
   *
   * @param {string | null | undefined} [name]
   *  Command name
   * @param {CommandData | null | undefined} [info]
   *  Additional command info
   */
  constructor(
    name: string | null | undefined,
    info?: CommandData | null | undefined
  )

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode CommandInfo}
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name
   * @param {CommandData | null | undefined} [data]
   *  Additional command info
   */
  constructor(
    info?: CommandInfo | string | null | undefined,
    data?: CommandData | null | undefined
  ) {
    if (typeof info === 'object' && info !== null) {
      data = { ...data, ...info }
    } else {
      info = { ...data = { ...data }, name: info }
    }

    this.info = {
      ...info,
      arguments: [],
      options: new Map(),
      parent: undefined,
      subcommands: new Map(),
      version: null
    }

    this.actionEvent = null
    this.args = []
    this.argv = []
    this.defaultCommand = null
    this.events = new EventEmitter({ delimiter: chars.colon })
    this.optionValueSources = {}
    this.optionValues = {}
    this.parent = data.parent ?? null
    this.process = this.info.process ?? process

    delete this.info.parent
    delete this.info.process

    this.logger = createLogger({
      format: { badge: false, columns: 0 },
      level: 'verbose',
      reporters: new FancyReporter(),
      stderr: this.process.stderr,
      stdout: this.process.stdout
    })

    Object.defineProperties(this, {
      [kCommand]: {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false
      },
      logger: {
        enumerable: false
      },
      process: {
        enumerable: false
      }
    })

    this.action(this.info.action)
    this.aliases(this.info.aliases)
    this.description(this.info.description)
    this.done(this.info.done)
    this.exiter(this.info.exit)
    this.hide(!!this.info.hidden)
    this.id(this.info.name)
    this.summary(this.info.summary)
    this.unknowns(this.info.unknown)
    this.usage(this.info.usage)
    this.version(data.version)

    if (this.parent) this.copyInheritedSettings(this.parent)

    if (!isNIL(data.arguments)) {
      if (!isList(data.arguments) && typeof data.arguments !== 'string') {
        this.argument(data.arguments)
      } else {
        this.arguments(data.arguments)
      }
    }

    if (!isNIL(data.options)) {
      if (isList(data.options)) this.options(data.options)
      else this.option(data.options)
    }

    if (data.subcommands) {
      if (!isSubcommandInfo(data.subcommands)) {
        this.commands(data.subcommands)
      } else {
        this.command(data.subcommands)
      }
    }
  }

  /**
   * Check if `value` looks like a command.
   *
   * @public
   * @static
   *
   * @template {Command} T
   *  Command instance type
   *
   * @param {unknown} value
   *  The thing to check
   * @return {value is T}
   *  `true` if `value` is looks like a command, `false` otherwise
   */
  public static isCommand<T extends Command>(value: unknown): value is T {
    return (
      !Array.isArray(value) &&
      typeof value === 'object' &&
      value !== null &&
      (
        value instanceof Command ||
        kCommand in value && value[kCommand] === true
      )
    )
  }

  /**
   * Whether the command is the default subcommand of its {@linkcode parent}.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if command is default subcommand, `false` otherwise
   */
  public get default(): boolean {
    return !!this.info.default
  }

  /**
   * Whether the command should **not** be displayed in help text.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if command should not be displayed in help text, `false` otherwise
   */
  public get hidden(): boolean {
    ok(typeof this.info.hidden === 'boolean', 'expected `info.hidden`')
    return this.info.hidden
  }

  /**
   * The strategy for handling unknown command-line arguments.
   *
   * @see {@linkcode UnknownStrategy}
   *
   * @public
   * @instance
   *
   * @return {UnknownStrategy}
   *  Unknown command-line argument strategy
   */
  public get unknown(): UnknownStrategy {
    ok(this.info.unknown !== null, 'expected `info.unknown` to not be `null`')
    ok(this.info.unknown !== undefined, 'expected `info.unknown`')
    return this.info.unknown
  }

  /**
   * Set the command action callback.
   *
   * @see {@linkcode Action}
   *
   * @public
   * @instance
   *
   * @param {Action<any> | null | undefined} action
   *  The callback to fire when the command is ran
   * @return {this}
   *  `this` command
   */
  public action(action: Action<any> | null | undefined): this

  /**
   * Get the command action callback.
   *
   * @see {@linkcode Action}
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} [Opts=OptionValues]
   *  Parsed command options
   * @template {any[]} [Args=any[]]
   *  Parsed command arguments
   *
   * @return {Action<Opts, Args>}
   *  The callback to fire when the command is ran
   */
  public action<
    Opts extends OptionValues = OptionValues,
    Args extends any[] = any[]
  >(): Action<Opts, Args>

  /**
   * Get or set the command action callback.
   *
   * @see {@linkcode Action}
   *
   * @public
   * @instance
   *
   * @param {Action | null | undefined} [action]
   *  The callback to fire when the command is ran
   * @return {Action | this}
   *  The command action callback or `this` command
   */
  public action(
    action?: Action | null | undefined
  ): Action | this {
    if (!arguments.length) return fallback(this.info.action, noop, isNIL)
    return this.info.action = action, this
  }

  /**
   * Add a prepared `argument`.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode KronkError}
   *
   * @public
   * @instance
   *
   * @param {Argument} argument
   *  The argument instance to add
   * @return {never | this}
   *  `this` command
   * @throws {KronkError}
   *  If the last registered argument is variadic
   */
  public addArgument(argument: Argument): never | this {
    /**
     * Last registered argument.
     *
     * @const {Argument | undefined} last
     */
    const last: Argument | undefined = this.info.arguments.at(-1)

    if (last?.variadic) {
      throw new KronkError({
        cause: { argument: argument.syntax, last: last.syntax },
        id: keid.argument_after_variadic,
        reason: `Cannot have argument after variadic argument (${last.syntax})`
      })
    }

    return this.info.arguments.push(argument), this
  }

  /**
   * Add a prepared `subcommand`.
   *
   * > 👉 **Note**: See {@linkcode command} for creating an attached subcommand
   * > that inherits settings from its {@linkcode parent}.
   *
   * @see {@linkcode Command}
   * @see {@linkcode KronkError}
   *
   * @public
   * @instance
   *
   * @param {Command} subcommand
   *  The command instance to add
   * @return {never | this}
   *  `this` command
   * @throws {KronkError}
   *  If `subcommand` does not have a valid name
   *  or a subcommand with the same name or alias as `subcommand` already exists
   */
  public addCommand(subcommand: Command): never | this {
    /**
     * The name of the subcommand.
     *
     * @const {CommandName} sub
     */
    const sub: CommandName = subcommand.id()

    // ensure `subcommand` have a valid name.
    if (!sub) {
      throw new KronkError({
        id: keid.invalid_subcommand_name,
        reason: 'Invalid subcommand name'
      })
    }

    // check subcommand id for conflicts.
    if (sub && this.findCommand(sub)) {
      throw new KronkError({
        id: keid.duplicate_subcommand,
        reason: `Subcommand with name or alias '${sub}' already exists`
      })
    }

    // check subcommand aliases for conflicts.
    for (const alias of subcommand.aliases()) {
      if (this.findCommand(alias)) {
        throw new KronkError({
          id: keid.duplicate_subcommand,
          reason: `Subcommand with name or alias '${alias}' already exists`
        })
      }
    }

    // add new subcommand.
    this.info.subcommands.set(sub, subcommand)

    // set parent command.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    subcommand.parent = this

    // set default command.
    if (subcommand.default) this.defaultCommand = subcommand

    return this
  }

  /**
   * Add a prepared `option`.
   *
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @param {Option} option
   *  The option instance to add
   * @return {never | this}
   *  `this` command
   * @throws {KronkError}
   *  If an option with the same long or short flag as `option` already exists
   */
  public addOption(option: Option): never | this {
    // check for conflicting flags.
    for (const flag of [option.long, option.short]) {
      if (this.findOption(flag)) {
        throw new KronkError({
          id: keid.duplicate_option,
          reason: `Option with flag '${flag}' already exists`
        })
      }
    }

    // add new command option.
    if (option.long) this.info.options.set(option.long, option)
    if (option.short) this.info.options.set(option.short, option)

    // configure default option-argument value.
    this.optionValue(
      option.key,
      option.default().value,
      optionValueSource.default
    )

    // add option event handler.
    this.on<OptionEvent>(option.event, this.onOption.bind(this))

    return this
  }

  /**
   * Add command aliases.
   *
   * > 👉 **Note**: This method can be called more than once to add multiple
   * > aliases.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string} alias
   *  An alias, or list of aliases, for the command
   * @return {this}
   *  `this` command
   */
  public alias(alias: List<string> | string): this

  /**
   * Get an alias for the command.
   *
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @return {CommandName}
   *  Alias for `this` command
   */
  public alias(): CommandName

  /**
   * Get an alias for the command or add command aliases.
   *
   * @see {@linkcode CommandName}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string} [alias]
   *  An alias, or list of aliases, for the command
   * @return {CommandName | this}
   *  Command alias or `this` command
   */
  public alias(alias?: List<string> | string): CommandName | this {
    if (!arguments.length) return fallback([...this.aliases()][0], null)
    ok(this.info.aliases instanceof Set, 'expected `info.aliases`')
    for (const x of toList(alias)) this.info.aliases.add(x)
    return this
  }

  /**
   * Set aliases for the command.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} aliases
   *  An alias, or list of aliases, for the command
   * @return {this}
   *  `this` command
   */
  public aliases(aliases: List<string> | string | null | undefined): this

  /**
   * Get a list of command aliases.
   *
   * @public
   * @instance
   *
   * @return {Set<string>}
   *  List of aliases for `this` command
   */
  public aliases(): Set<string>

  /**
   * Get or set aliases for the command.
   *
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<string> | string | null | undefined} [aliases]
   *  An alias, or list of aliases, for the command
   * @return {Set<string> | this}
   *  List of command aliases or `this` command
   */
  public aliases(
    aliases?: List<string> | string | null | undefined
  ): Set<string> | this {
    if (!arguments.length) return new Set(toList(this.info.aliases))
    return this.info.aliases = new Set(toList(aliases)), this
  }

  /**
   * Get a list of ancestor commands.
   *
   * The first command is the parent of `this` command, and the last is the
   * greatest grandparent of `this` command.
   *
   * @public
   * @instance
   *
   * @return {Command[]}
   *  List of ancestor commands
   */
  public ancestors(): Command[] {
    /**
     * List of ancestor commands.
     *
     * @const {Command[]} ancestors
     */
    const ancestors: Command[] = []

    for (let command = this.parent; command; command = command.parent) {
      ancestors.push(command)
    }

    return ancestors
  }

  /**
   * Define an argument for the command.
   *
   * @see {@linkcode ArgumentInfo}
   *
   * @public
   * @instance
   *
   * @param {ArgumentInfo | string} info
   *  Argument info or syntax
   * @return {this}
   *  `this` command
   */
  public argument(info: ArgumentInfo | string): this

  /**
   * Define an argument for the command.
   *
   * @see {@linkcode ArgumentData}
   *
   * @public
   * @instance
   *
   * @param {string} syntax
   *  Argument syntax
   * @param {ArgumentData | null | undefined} [info]
   *  Additional argument info
   * @return {this}
   *  `this` command
   */
  public argument(syntax: string, info?: ArgumentData | null | undefined): this

  /**
   * Define an argument for the command.
   *
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentInfo}
   *
   * @public
   * @instance
   *
   * @param {ArgumentInfo | string} info
   *  Argument info or syntax
   * @param {ArgumentData | null | undefined} [data]
   *  Additional argument info
   * @return {this}
   *  `this` command
   */
  public argument(
    info: ArgumentInfo | string,
    data?: ArgumentData | null | undefined
  ): this {
    return this.addArgument(this.createArgument(info as never, data))
  }

  /**
   * Batch define arguments for the command.
   *
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<ArgumentInfo | string> | string} infos
   *  List of argument info and/or syntaxes,
   *  or a string containing argument syntaxes
   * @return {this}
   *  `this` command
   */
  public arguments(infos: List<ArgumentInfo | string> | string): this

  /**
   * Get a list of command arguments.
   *
   * @see {@linkcode Argument}
   *
   * @public
   * @instance
   *
   * @return {Argument[]}
   *  List of command arguments
   */
  public arguments(): Argument[]

  /**
   * Get a list of command arguments or batch define arguments for the command.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<ArgumentInfo | string> | string} [infos]
   *  List of argument info and/or syntaxes,
   *  or a string containing argument syntaxes
   * @return {Argument[] | this}
   *  List of command arguments or `this` command
   */
  public arguments(
    infos?: List<ArgumentInfo | string> | string
  ): Argument[] | this {
    if (!infos) return [...this.info.arguments]
    if (typeof infos === 'string') infos = toChunks(infos.trim(), kCommand)
    for (const info of infos) void this.argument(info)
    return this
  }

  /**
   * Ensure `choice` is valid choice for `candidate`.
   *
   * Fails if `choice` is invalid.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode List}
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {List<string> | string} choice
   *  The raw argument or arguments to check
   * @param {Argument | Option} candidate
   *  The current command argument or option instance
   * @return {never | this}
   *  `this` command
   */
  protected checkChoices(
    choice: List<string> | string,
    candidate: Argument | Option
  ): never | this {
    /**
     * List of choices.
     *
     * @const {string[]} choices
     */
    const choices: string[] = [...candidate.choices()]

    if (choices.length) {
      for (const value of toList(choice)) {
        if (!choices.includes(value)) {
          this.error({
            additional: [`Choices: ${formatList(choices.map(c => `'${c}'`))}`],
            cause: { choice: value, choices },
            id: keid.invalid_argument,
            reason: `${String(candidate)} does not allow '${value}'`
          })
        }
      }
    }

    return this
  }

  /**
   * Check for excess and missing command-arguments and error if any are found.
   *
   * @protected
   * @instance
   *
   * @return {never | this}
   *  `this` command
   */
  protected checkCommandArguments(): never | this {
    // check for too few arguments.
    for (const [i, argument] of this.info.arguments.entries()) {
      if (argument.required && this.argv[i] === undefined) {
        this.error({
          id: keid.missing_argument,
          reason: `Missing required argument '${String(argument.syntax)}'`
        })
      }
    }

    // check for too many arguments.
    if (
      !this.info.arguments.at(-1)?.variadic &&
      this.unknown !== 'arguments' &&
      this.unknown !== true &&
      this.argv.length > this.info.arguments.length
    ) {
      /**
       * Reason for error.
       *
       * @var {string} reason
       */
      let reason: string = ''

      reason += `Expected \`${this.info.arguments.length}\``
      reason += chars.space
      reason += plur('argument', this.info.arguments.length) + chars.comma
      reason += chars.space
      reason += `but got \`${this.argv.length}\``

      this.error({ id: keid.excess_arguments, reason })
    }

    return this
  }

  /**
   * Check for missing mandatory options and error if any are found.
   *
   * @protected
   * @instance
   *
   * @return {never | this}
   *  `this` command
   */
  protected checkForMissingMandatoryOptions(): never | this {
    for (const cmd of [this, ...this.ancestors()]) {
      for (const option of cmd.options()) {
        if (option.mandatory && cmd.optionValue(option.key) === undefined) {
          this.error({
            id: keid.missing_mandatory_option,
            reason: `${String(option)} is required`
          })
        }
      }
    }

    return this
  }

  /**
   * Check for unknown options and error if any are found.
   *
   * @see {@linkcode List}
   *
   * @protected
   * @instance
   *
   * @param {List<string>} unknown
   *  List of unknown command options
   * @return {this}
   *  `this` command
   */
  protected checkForUnknownOptions(unknown: List<string>): this {
    if (this.unknown !== 'options' && this.unknown !== true) {
      for (const flag of unknown) {
        this.error({
          cause: { flag },
          id: keid.unknown_option,
          reason: `Unknown option '${flag}'`
        })
      }
    }

    return this
  }

  /**
   * Define a subcommand.
   *
   * @see {@linkcode SubcommandInfo}
   *
   * @public
   * @instance
   *
   * @param {SubcommandInfo | string} info
   *  Subcommand info or name
   * @return {Command}
   *  New subcommand instance
   */
  public command(info: SubcommandInfo | string): Command

  /**
   * Define a subcommand.
   *
   * @see {@linkcode CommandData}
   *
   * @public
   * @instance
   *
   * @param {string} syntax
   *  Subcommand name
   * @param {CommandData | null | undefined} [info]
   *  Additional subcommand info
   * @return {Command}
   *  New subcommand instance
   */
  public command(
    syntax: string,
    info?: CommandData | null | undefined
  ): Command

  /**
   * Define a subcommand.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode SubcommandInfo}
   *
   * @public
   * @instance
   *
   * @param {SubcommandInfo | string} info
   *  Subcommand info or name
   * @param {CommandData | null | undefined} [data]
   *  Additional subcommand data
   * @return {Command}
   *  Subcommand instance
   */
  public command(
    info: SubcommandInfo | string,
    data?: CommandData | null | undefined
  ): Command {
    /**
     * The subcommand to add.
     *
     * @const {Command} subcommand
     */
    const subcommand: Command = this.createCommand(info as never, {
      ...data,
      parent: this
    })

    // add new subcommand.
    this.addCommand(subcommand)

    // copy inherited settings.
    subcommand.copyInheritedSettings(this)

    return subcommand
  }

  /**
   * Batch define subcommands for the command.
   *
   * @see {@linkcode SubcommandsInfo}
   *
   * @public
   * @instance
   *
   * @param {SubcommandsInfo} infos
   *  Subcommands info
   * @return {this}
   *  `this` command
   */
  public commands(infos: SubcommandsInfo): this

  /**
   * Get a subcommand map.
   *
   * @public
   * @instance
   *
   * @return {Map<string, Command>}
   *  Subcommands map
   */
  public commands(): Map<string, Command>

  /**
   * Get a subcommand map or batch define subcommands for the command.
   *
   * @see {@linkcode SubcommandsInfo}
   *
   * @public
   * @instance
   *
   * @param {SubcommandsInfo} [infos]
   *  Subcommands info
   * @return {Map<string, Command> | this}
   *  Subcommand map or `this` command
   */
  public commands(infos?: SubcommandsInfo): Map<string, Command> | this {
    if (infos) {
      for (const [name, info] of Object.entries(infos)) {
        info.name = name
        this.command(info as SubcommandInfo)
      }

      return this
    }

    return this.info.subcommands
  }

  /**
   * Copy settings that are useful to have in common across `parent` and its
   * subcommands.
   *
   * > 👉 **Note**: This method is used internally via {@linkcode command} so
   * > subcommands can inherit parent settings.
   *
   * @public
   * @instance
   *
   * @param {Command} parent
   *  The parent command to copy settings from
   * @return {this}
   *  `this` command
   */
  public copyInheritedSettings(parent: Command): this {
    this.logger = parent.logger
    this.process = parent.process

    this.exiter(this.info.exit ?? parent.info.exit)
    this.unknowns(parent.info.unknown)

    return this
  }

  /**
   * Create a new unattached argument.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode ArgumentSyntax}
   *
   * @public
   * @instance
   *
   * @param {ArgumentInfo | ArgumentSyntax} info
   *  Argument info or syntax
   * @return {Argument}
   *  New argument instance
   */
  public createArgument(info: ArgumentInfo | ArgumentSyntax): Argument

  /**
   * Create a new unattached argument.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentSyntax}
   *
   * @public
   * @instance
   *
   * @param {ArgumentSyntax} syntax
   *  The argument syntax
   * @param {ArgumentData | null | undefined} [info]
   *  Additional argument info
   * @return {Argument}
   *  New argument instance
   */
  public createArgument(
    syntax: ArgumentSyntax,
    info?: ArgumentData | null | undefined
  ): Argument

  /**
   * Create a new unattached argument.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode ArgumentSyntax}
   *
   * @public
   * @instance
   *
   * @param {ArgumentInfo | ArgumentSyntax} info
   *  Argument info or syntax
   * @param {ArgumentData | null | undefined} [data]
   *  Additional argument info
   * @return {Argument}
   *  New argument instance
   */
  public createArgument(
    info: ArgumentInfo | ArgumentSyntax,
    data?: ArgumentData | null | undefined
  ): Argument {
    return new Argument(info as never, data)
  }

  /**
   * Create a new unattached command.
   *
   * @see {@linkcode CommandInfo}
   *
   * @public
   * @instance
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name
   * @return {Command}
   *  New command instance
   */
  public createCommand(info?: CommandInfo | string | null | undefined): Command

  /**
   * Create a new unattached command.
   *
   * @see {@linkcode CommandData}
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} [name]
   *  Command name
   * @param {CommandData | null | undefined} [info]
   *  Additional command info
   * @return {Command}
   *  New command instance
   */
  public createCommand(
    name: string | null | undefined,
    info?: CommandData | null | undefined
  ): Command

  /**
   * Create a new unattached command.
   *
   * @see {@linkcode Command}
   * @see {@linkcode CommandData}
   * @see {@linkcode CommandInfo}
   *
   * @public
   * @instance
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name
   * @param {CommandData | null | undefined} [data]
   *  Additional command info
   * @return {Command}
   *  New command instance
   */
  public createCommand(
    info?: CommandInfo | string | null | undefined,
    data?: CommandData | null | undefined
  ): Command {
    return new Command(info as never, data)
  }

  /**
   * Create a new unattached option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {Flags | OptionInfo} info
   *  Option info or flags
   * @return {Option}
   *  New option instance
   */
  public createOption(info: Flags | OptionInfo): Option

  /**
   * Create a new unattached version option.
   *
   * @see {@linkcode VersionOption}
   * @see {@linkcode VersionOptionInfo}
   *
   * @public
   * @instance
   *
   * @param {VersionOptionInfo} info
   *  Option info
   * @return {VersionOption}
   *  New version option instance
   */
  public createOption(info: VersionOptionInfo): VersionOption

  /**
   * Create a new unattached option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionData}
   *
   * @public
   * @instance
   *
   * @param {Flags} flags
   *  Option flags
   * @param {OptionData | null | undefined} [info]
   *  Option info
   * @return {Option}
   *  New option instance
   */
  public createOption(
    flags: Flags,
    info?: OptionData | null | undefined
  ): Option

  /**
   * Create a new unattached option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   * @see {@linkcode OptionData}
   * @see {@linkcode VersionOption}
   * @see {@linkcode VersionOptionInfo}
   *
   * @public
   * @instance
   *
   * @param {Flags | OptionInfo | VersionOptionInfo} info
   *  Option info or flags
   * @param {OptionData | null | undefined} [data]
   *  Additional option info
   * @return {Option | VersionOption}
   *  New option instance
   */
  public createOption(
    info: Flags | OptionInfo | VersionOptionInfo,
    data?: OptionData | null | undefined
  ): Option | VersionOption {
    return typeof info === 'object' && 'version' in info
      ? new VersionOption(info)
      : new Option(info as never, data)
  }

  /**
   * Set the command description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} description
   *  The command description
   * @return {this}
   *  `this` command
   */
  public description(description: URL | string | null | undefined): this

  /**
   * Get the command description.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  The command description
   */
  public description(): string

  /**
   * Get or set the command description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} [description]
   *  The command description
   * @return {string | this}
   *  Description of `this` command or `this` command
   */
  public description(
    description?: URL | string | null | undefined
  ): string | this {
    if (!arguments.length) return String(this.info.description ?? chars.empty)
    return this.info.description = orNIL(description), this
  }

  /**
   * Set the command done callback.
   *
   * @see {@linkcode Action}
   *
   * @public
   * @instance
   *
   * @param {Action<any> | null | undefined} done
   *  The callback to fire after the command is ran
   * @return {this}
   *  `this` command
   */
  public done(done: Action<any> | null | undefined): this

  /**
   * Get the command done callback.
   *
   * @see {@linkcode Action}
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} [Opts=OptionValues]
   *  Parsed command options with globals
   * @template {any[]} [Args=any[]]
   *  Parsed command arguments
   *
   * @return {Action<Opts, Args>}
   *  The callback to fire after the command is ran
   */
  public done<
    Opts extends OptionValues = OptionValues,
    Args extends any[] = any[]
  >(): Action<Opts, Args>

  /**
   * Get or set the command done callback.
   *
   * @see {@linkcode Action}
   *
   * @public
   * @instance
   *
   * @param {Action | null | undefined} [done]
   *  The callback to fire after the command is ran
   * @return {Action | this}
   *  Command done callback or `this` command
   */
  public done(done?: Action | null | undefined): Action | this {
    if (!arguments.length) return fallback(this.info.done, noop, isNIL)
    return this.info.done = done, this
  }

  /**
   * Emit an `event`.
   *
   * @see {@linkcode KronkEvent}
   *
   * @public
   * @instance
   *
   * @param {KronkEvent} event
   *  The event to emit
   * @return {boolean}
   *  `true` if event has listeners, `false` otherwise
   */
  public emit(event: KronkEvent): boolean {
    return this.events.emit(event.id, event)
  }

  /**
   * Emit a parsed `option` event.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionValueSource}
   * @see {@linkcode RawOptionValue}
   *
   * @public
   * @instance
   *
   * @param {Option} option
   *  The command option instance
   * @param {RawOptionValue} value
   *  The raw `option` value
   * @param {OptionValueSource} source
   *  The source of the raw option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   * @return {boolean}
   *  `true` if event has listeners, `false` otherwise
   */
  public emitOption(
    option: Option,
    value: RawOptionValue,
    source: OptionValueSource,
    flag?: Flags | null | undefined
  ): boolean {
    return this.emit(new OptionEvent(option, value, source, flag))
  }

  /**
   * Display an error message and exit.
   *
   * @see {@linkcode CommandErrorInfo}
   * @see {@linkcode KronkError}
   *
   * @public
   * @instance
   *
   * @param {CommandErrorInfo | KronkError} info
   *  Info about the error or the error to display
   * @return {never}
   *  Never, exits erroneously
   */
  public error(info: CommandErrorInfo | KronkError): never {
    /**
     * The error to display.
     *
     * @var {KronkError} error
     */
    let error: KronkError = info as KronkError

    if (!isKronkError(info)) {
      error = new CommandError({ ...info, command: this })
    }

    this.exit(error)
  }

  /**
   * Exit the process.
   *
   * > 👉 **Note**: The exit code ({@linkcode process.exitCode}) is set, but
   * > {@linkcode process.exit} is **not** called. To change this behavior,
   * > override the exit callback using {@linkcode exiter}.
   *
   * @see {@linkcode CommandError}
   * @see {@linkcode KronkError}
   *
   * @public
   * @instance
   *
   * @param {CommandError | KronkError} e
   *  The error to handle
   * @return {never}
   *  Never
   * @throws {KronkError}
   *  If `e` is an unhandled error after calling the command exit callback
   */
  public exit(e: CommandError | KronkError): never

  /**
   * Exit the process.
   *
   * > 👉 **Note**: The exit code ({@linkcode process.exitCode}) is set, but
   * > {@linkcode process.exit} is **not** called. To change this behavior,
   * > override the exit callback using {@linkcode exiter}.
   *
   * @see {@linkcode CommandError}
   * @see {@linkcode KronkError}
   *
   * @public
   * @instance
   *
   * @param {null | undefined} [e]
   *  The error to handle
   * @return {undefined}
   */
  public exit(e?: null | undefined): undefined

  /**
   * Exit the process.
   *
   * @see {@linkcode KronkError}
   *
   * @public
   * @instance
   *
   * @param {KronkError | null | undefined} [e]
   *  The error to handle
   * @return {never | undefined}
   *  Nothing
   * @throws {KronkError}
   *  If `e` is an unhandled error after calling the command exit callback
   */
  public exit(e?: KronkError | null | undefined): never | undefined {
    this.process.exitCode = e?.code
    this.exiter().call(this, e)
    if (e) throw e
    return void e
  }

  /**
   * Set the exit callback.
   *
   * @see {@linkcode Exit}
   *
   * @public
   * @instance
   *
   * @param {Exit | null | undefined} exit
   *  The callback to fire on process exit
   * @return {this}
   *  `this` command
   */
  public exiter(exit: Exit | null | undefined): this

  /**
   * Get the exit callback.
   *
   * @see {@linkcode Exit}
   *
   * @public
   * @instance
   *
   * @return {Exit}
   *  The callback to fire on process exit
   */
  public exiter(): Exit

  /**
   * Get or set the exit callback.
   *
   * @see {@linkcode Exit}
   *
   * @public
   * @instance
   *
   * @param {Exit | null | undefined} [exit]
   *  The callback to fire on process exit
   * @return {Exit | this}
   *  Command exit callback or `this` command
   */
  public exiter(exit?: Exit | null | undefined): Exit | this {
    if (!arguments.length) return fallback(this.info.exit, noop, isNIL)
    return this.info.exit = exit, this
  }

  /**
   * Find a command with a name or alias matching `ref`.
   *
   * @see {@linkcode CommandName}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {CommandName | List<CommandName> | undefined} ref
   *  A command name, command alias, or list of such references
   * @return {Command | this | undefined}
   *  Command with a name or alias matching `ref`
   */
  public findCommand(
    ref: CommandName | List<CommandName> | undefined
  ): Command | this | undefined {
    if (
      typeof ref === 'string' &&
      (this.id() === ref || this.aliases().has(ref))
    ) {
      return this
    }

    if (ref && this.info.subcommands.size) {
      /**
       * List of command names and/or aliases.
       *
       * @const {List<CommandName>} references
       */
      const references: List<CommandName> = toList(ref)

      // search for a matching subcommand.
      for (const [, cmd] of this.commands()) {
        for (const ref of references) {
          if (cmd.findCommand(ref)) return cmd
        }
      }
    }

    return undefined
  }

  /**
   * Find an option with a flag matching `flag`.
   *
   * Options known to `this` command and its ({@linkcode defaultCommand}) are
   * searched by default. Set `direction` to `0` to only search for options
   * known to the current command.
   *
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} flag
   *  The option flag to match
   * @param {0 | null | undefined} [direction]
   *  The direction to search for options
   * @return {Option | undefined}
   *  Option with the long or short flag `flag`
   */
  public findOption(
    flag: string | null | undefined,
    direction?: 0 | null | undefined
  ): Option | undefined {
    /**
     * Option with the long or short flag `flag`.
     *
     * @var {Option | undefined} option
     */
    let option: Option | undefined

    if (flag) {
      option = this.info.options.get(flag)

      if (!option && this.defaultCommand && direction !== +chars.digit0) {
        option = this.defaultCommand.info.options.get(flag)
      }
    }

    return option
  }

  /**
   * Remove the command from help text.
   *
   * @public
   * @instance
   *
   * @param {boolean | null | undefined} [hidden=true]
   *  Whether the command should be hidden
   * @return {this}
   *  `this` command
   */
  public hide(hidden?: boolean | null | undefined): this {
    return this.info.hidden = fallback(hidden, true, isNIL), this
  }

  /**
   * Set the name of the command.
   *
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @param {CommandName | undefined} name
   *  Command name
   * @return {this}
   *  `this` command
   */
  public id(name: CommandName | undefined): this

  /**
   * Get the name of the command.
   *
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @return {CommandName}
   *  Command name
   */
  public id(): CommandName

  /**
   * Get or set the name of the command.
   *
   * @public
   * @instance
   *
   * @param {CommandName | undefined} [name]
   *  The name of the command
   * @return {CommandName | this}
   *  The name of `this` command or `this` command
   */
  public id(name?: CommandName | undefined): CommandName | this {
    if (!arguments.length) return this.info.name?.trim() || null
    return this.info.name = name?.trim(), this
  }

  /**
   * Register an `event` listener.
   *
   * @see {@linkcode KronkEvent}
   * @see {@linkcode KronkEventListener}
   * @see {@linkcode OnOptions}
   *
   * @public
   * @instance
   *
   * @template {KronkEvent} T
   *  The event being listened for
   *
   * @param {T['id']} event
   *  The name of the event being listened for
   * @param {KronkEventListener<T>} listener
   *  The event listener
   * @param {OnOptions | boolean | undefined} [options]
   *  Event listening options
   * @return {undefined}
   */
  public on<T extends KronkEvent>(
    event: T['id'],
    listener: KronkEventListener<T>,
    options?: OnOptions | boolean | undefined
  ): undefined {
    return void this.events.on(event, listener, options)
  }

  /**
   * Handle a parsed option `event`.
   *
   * The method will parse the raw option-argument value using the specified
   * parser, as well as store the raw value source and parsed option value.
   *
   * > 👉 **Note**: This event handler is registered each time a prepared option
   * > is added (i.e. `command.addOption(option)`).
   * > For convenience, when the command version option is parsed, the command
   * > version (`event.option.version`) is set as the option value even though
   * > the option is a boolean option.
   *
   * @see {@linkcode Option}
   * @see {@linkcode OptionEvent}
   *
   * @protected
   * @instance
   *
   * @template {Option} T
   *  Parsed command option
   *
   * @param {OptionEvent<T>} event
   *  The emitted parsed option event
   * @return {undefined}
   */
  protected onOption<T extends Option>(event: OptionEvent<T>): undefined {
    /* v8 ignore else -- @preserve */
    if (this.info.version === event.option as Option) {
      ok('version' in event.option, 'expected `event.option.version`')
      this.optionValue(event.option.key, event.option.version, event.source)
    } else if (typeof event.value === 'boolean') {
      this.optionValue(event.option.key, event.value, event.source)
    } else if (event.value !== null) {
      /**
       * Option-argument parser.
       *
       * The default parser is an identity function that returns the raw
       * option-argument value.
       *
       * @const {ParseArg}
       */
      const parser: ParseArg = event.option.parser()

      /**
       * Default value configuration.
       *
       * @const {DefaultInfo} def
       */
      const def: DefaultInfo = event.option.default()

      this.checkChoices(event.value, event.option)
      this.optionValue(event.option.key, parser(event.value, def.value))
      this.optionValueSource(event.option.key, event.source)
    }

    return void this
  }

  /**
   * Handle a parsed version option `event`.
   *
   * > 👉 **Note**: This event listener is registered each time the command
   * > version is set (i.e. `command.version(version, info)`) and will override
   * > the {@linkcode action} callback to print the command version on request.
   *
   * @see {@linkcode OptionEvent}
   * @see {@linkcode VersionOption}
   *
   * @protected
   * @instance
   *
   * @param {OptionEvent<VersionOption>} event
   *  The emitted parsed option event
   * @return {undefined}
   */
  protected onOptionVersion(event: OptionEvent<VersionOption>): undefined {
    return void this.action(version)

    /**
     * @this {Command}
     *
     * @return {undefined}
     */
    function version(this: Command): undefined {
      return void this.logger.log(event.option.version)
    }
  }

  /**
   * Handle a parsed option `event`.
   *
   * The {@linkcode actionEvent} will be set and propagated to ancestors.
   *
   * @see {@linkcode OptionEvent}
   *
   * @protected
   * @instance
   *
   * @param {OptionEvent} event
   *  The emitted parsed option event
   * @return {undefined}
   */
  protected onOptionWithAction(event: OptionEvent): undefined {
    for (const cmd of [this, ...this.ancestors()]) cmd.actionEvent = event
    return void event
  }

  /**
   * Define an option for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {Flags | OptionInfo} info
   *  Option flags or info
   * @return {this}
   *  `this` command
   */
  public option(info: Flags | OptionInfo): this

  /**
   * Define an option for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionData}
   *
   * @public
   * @instance
   *
   * @param {Flags} flags
   *  Option flags
   * @param {OptionData | null | undefined} [info]
   *  Additional option info
   * @return {this}
   *  `this` command
   */
  public option(flags: Flags, info?: OptionData | null | undefined): this

  /**
   * Define an option for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionData}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {Flags | OptionInfo} info
   *  Option flags or info
   * @param {OptionData | null | undefined} [data]
   *  Additional option data
   * @return {this}
   *  `this` command
   */
  public option(
    info: Flags | OptionInfo,
    data?: OptionData | null | undefined
  ): this {
    return this.addOption(this.createOption(info as never, data))
  }

  /**
   * Set an option value.
   *
   * @see {@linkcode Option.key}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option['key']} key
   *  Option key
   * @param {unknown} value
   *  The parsed option value to store
   * @param {OptionValueSource | null | undefined} [source]
   *  The source of the original option value
   * @return {this}
   *  `this` command
   */
  public optionValue(
    key: Option['key'],
    value: unknown,
    source?: OptionValueSource | null | undefined
  ): this

  /**
   * Get an option value.
   *
   * @see {@linkcode Option.key}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  Parsed option value type
   *
   * @param {Option['key']} key
   *  Option key
   * @return {T}
   *  Parsed option value
   */
  public optionValue<T>(key: Option['key']): T

  /**
   * Get or set an option value.
   *
   * @see {@linkcode Option.key}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option['key']} key
   *  Option key
   * @param {unknown} [value]
   *  The parsed option value to store
   * @param {OptionValueSource | null | undefined} [source]
   *  The source of the original option value
   * @return {this | any}
   *  Stored option value or `this` command
   */
  public optionValue(
    key: Option['key'],
    value?: unknown,
    source?: OptionValueSource | null | undefined
  ): any {
    if (arguments.length === 1) return this.optionValues[key] as unknown
    return this.optionValueSource(key, source).optionValues[key] = value, this
  }

  /**
   * Store an option value source.
   *
   * @see {@linkcode Option.key}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option['key']} key
   *  Option key
   * @param {OptionValueSource | null | undefined} source
   *  The source of the option value
   * @return {this}
   *  `this` command
   */
  public optionValueSource(
    key: Option['key'],
    source: OptionValueSource | null | undefined
  ): this

  /**
   * Get an option value source.
   *
   * @see {@linkcode Option.key}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option['key']} key
   *  Option key
   * @return {OptionValueSource | null | undefined}
   *  The source of the option value for `key`
   */
  public optionValueSource(
    key: Option['key']
  ): OptionValueSource | null | undefined

  /**
   * Get or set an option value source.
   *
   * @see {@linkcode Option.key}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option['key']} key
   *  Option key
   * @param {OptionValueSource | null | undefined} [source]
   *  The source of the option value
   * @return {OptionValueSource | this | null | undefined}
   *  Option value source for `key` or `this` command
   */
  public optionValueSource(
    key: Option['key'],
    source?: OptionValueSource | null | undefined
  ): OptionValueSource | this | null | undefined {
    if (arguments.length === 1) return this.optionValueSources[key]
    this.optionValueSources[key] = source
    return this
  }

  /**
   * Batch define options for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode List}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {List<Flags | OptionInfo>} infos
   *  List of option flags and/or info
   * @return {this}
   *  `this` command
   */
  public options(infos: List<Flags | OptionInfo>): this

  /**
   * Get a list of command options.
   *
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @return {Option[]}
   *  List of command options
   */
  public options(): Option[]

  /**
   * Get a list of command options or batch define options for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode List}
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {List<Flags | OptionInfo>} [infos]
   *  List of option flags and/or info
   * @return {Option[] | this}
   *  List of command options or `this` command
   */
  public options(infos?: List<Flags | OptionInfo>): Option[] | this {
    if (!infos) return [...new Set(this.info.options.values())]
    for (const info of infos) void this.option(info)
    return this
  }

  /**
   * Get a record of local option values.
   *
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} T
   *  Local option values type
   *
   * @return {T}
   *  Local option values
   */
  public opts<T extends OptionValues>(): T {
    return this.optionValues as T
  }

  /**
   * Get a record of global and local option values.
   *
   * > 👉 **Note**: Local options overwrite global options by default.
   * > Prioritize global options (i.e. `cmd.optionPriority('global')`) to change
   * > this behavior.
   *
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} T
   *  Merged option values type
   *
   * @return {T}
   *  Merged option values
   */
  public optsWithGlobals<T extends OptionValues>(): T {
    /**
     * Function used to merge options.
     *
     * @var {typeof reduce} merger
     */
    let merger: typeof reduce = reduce

    /* v8 ignore file -- @preserve */
    if (this.info.optionPriority !== 'global') merger = reduceRight

    return merger([this, ...this.ancestors()], reducer, {} as T)

    /**
     * @this {void}
     *
     * @param {T} acc
     *  Accumulated option values
     * @param {Command} cmd
     *  Current command
     * @return {T}
     *  Option values
     */
    function reducer(this: void, acc: T, cmd: Command): T {
      return Object.assign(acc, cmd.opts())
    }
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * The default expectation is that the arguments are from node and have the
   * application as `argv[0]` and the script being run in `argv[1]`, with user
   * parameters after that.
   *
   * > 👉 **Note**: If any action handlers are async, {@linkcode parseAsync}
   * > should be used instead.
   *
   * @see {@linkcode List}
   * @see {@linkcode ParseOptions}
   *
   * @public
   * @instance
   *
   * @param {List<string> | null | undefined} [argv]
   *  List of command-line arguments
   * @param {ParseOptions | null | undefined} [options]
   *  Options for parsing `argv`
   * @return {Command | this}
   *  The command that was run
   */
  public parse(
    argv?: List<string> | null | undefined,
    options?: ParseOptions | null | undefined
  ): Command | this {
    /**
     * User arguments.
     *
     * @const {string[]} unknown
     */
    const unknown: string[] = this.prepareUserArgs(argv, options)

    /**
     * The command to run.
     *
     * @const {Command | this} cmd
     */
    const cmd: Command | this = this.prepareCommand([], unknown)

    // run action callback.
    void cmd.action().call(cmd, cmd.opts(), ...cmd.args as unknown[])

    // run done callback.
    void cmd.done().call(cmd, cmd.optsWithGlobals(), ...cmd.args as unknown[])

    return cmd
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * The default expectation is that the arguments are from node and have the
   * application as `argv[0]` and the script being run in `argv[1]`, with user
   * parameters after that.
   *
   * > 👉 **Note**: If any action handlers are async, this method should be used
   * > instead of {@linkcode parse}.
   *
   * @see {@linkcode List}
   * @see {@linkcode ParseOptions}
   *
   * @public
   * @instance
   *
   * @async
   *
   * @param {List<string> | null | undefined} [argv]
   *  List of command-line arguments
   * @param {ParseOptions | null | undefined} [options]
   *  Options for parsing `argv`
   * @return {Promise<Command | this>}
   *  The command that was run
   */
  public async parseAsync(
    argv?: List<string> | null | undefined,
    options?: ParseOptions | null | undefined
  ): Promise<Command | this> {
    /**
     * User arguments.
     *
     * @const {string[]} unknown
     */
    const unknown: string[] = this.prepareUserArgs(argv, options)

    /**
     * The command to run.
     *
     * @const {Command | this} cmd
     */
    const cmd: Command | this = this.prepareCommand([], unknown)

    // run action callback.
    await cmd.action().call(cmd, cmd.opts(), ...cmd.args as unknown[])

    // run done callback.
    await cmd.done().call(cmd, cmd.optsWithGlobals(), ...cmd.args as unknown[])

    return cmd
  }

  /**
   * Process command-line arguments in the context of `this` command.
   *
   * > 👉 **Note**: Modifies `this` command by storing options. Does not reset
   * > state if called again.
   *
   * @protected
   * @instance
   *
   * @param {string[]} operands
   *  List of operands (not options or values)
   * @param {string[]} unknown
   *  List of unknown arguments
   * @return {Command | this}
   *  The command to run
   */
  protected prepareCommand(
    operands: string[],
    unknown: string[]
  ): Command | this {
    /**
     * List of events representing operands and option flags.
     *
     * @const {Event[]} events
     */
    const events: Event[] = tokenize(unknown, {
      breaks: true,
      debug: 'kronk/command',
      /**
       * @this {void}
       *
       * @param {TokenizeContext} context
       *  Base tokenize context
       * @return {undefined}
       */
      finalizeContext: (context: TokenizeContext): undefined => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        return context[kCommand] = true, context.command = this, void context
      },
      initial: initialCommand,
      moveOnBreak: true
    })

    /**
     * Parse result.
     *
     * @const {Record<'operands' | 'unknown', string[]>} result
     */
    const result: Record<'operands' | 'unknown', string[]> = {
      operands: [], // operands, not options or values
      unknown: [] // first unknown option and remaining unknown args
    }

    /**
     * Destination list.
     *
     * @var {string[]} dest
     */
    let dest: string[] = result.operands

    /**
     * Index of current event.
     *
     * @var {number} index
     */
    let index: number = -1

    // tokenize user arguments and remove events related to known options,
    // thus leaving any events representing operands and unknown options.
    while (++index < events.length) {
      ok(events[index], 'expected `events[index]`')
      const [event, token] = events[index]!

      // if a non-option looks like an option because it starts with a hyphen,
      // delimiters (`--`) can be used to demarcate options from non-options.
      if (token.type === tt.delimiter) {
        ok(event === ev.enter, 'expected delimiter enter event')

        /**
         * Index of the command-line argument chunk `token` was created from.
         *
         * @var {number} chunkIndex
         */
        let chunkIndex: number = token.start._index

        // offset by `2` to account for stream break chunks.
        if (chunkIndex) chunkIndex -= 2

        // add command-line arguments after delimiter only.
        if (dest !== result.unknown) chunkIndex++

        // delimiters only appear the beginning of chunks,
        // so `unknown` can be sliced safely using `chunkIndex`.
        dest.push(...unknown.slice(chunkIndex))

        break
      }

      // handle operand.
      if (token.type === tt.operand) {
        ok(event === ev.enter, 'expected operand enter event')
        ok(token.value !== undefined, 'expected operand token value')

        // `token.value` is either a variadic option-argument, subcommand id,
        // command-argument, or a raw option-argument for an option unknown to
        // `this` command.
        if (Array.isArray(token.value)) {
          dest.push(...token.value)
        } else if (token.command) {
          // `token.value` is the name of a subcommand.
          // remaining arguments are classified as unknown.

          dest.push(token.value)
          dest = result.unknown

          // note: this branch means global options must be specified before
          // subcommands, but also that subcommand options can have the same
          // flag as a parent command option.
        } else {
          dest.push(token.value)
        }

        index++
        continue
      }

      // there should be only `flag` events at this point.
      // only `delimiter`, `flag`, and `operand` events are produced.
      ok(token.type === tt.flag, 'expected `flag` token')

      // should be entering a flag event by indexing accordingly.
      ok(event === ev.enter, 'expected flag enter event')

      // token value should be an option flag.
      ok(typeof token.value === 'string', 'expected string token value')

      // any option flags passed by the user are represented as flag tokens.
      // if an option-argument was passed, the event after the flag exit event
      // will be an option-argument event. the option-argument token value is
      // the raw option-argument value, or a list of raw option-argument values
      // for variadic options.
      if (token.option && token.command === this) {
        /**
         * Index of event after flag exit event.
         *
         * @const {number} afterIndex
         */
        const afterIndex: number = index + 2

        /**
         * Event after flag exit event.
         *
         * @const {Event | undefined} after
         */
        const after: Event | undefined = events[afterIndex]

        /**
         * Raw option-argument value.
         *
         * @var {RawOptionValue} value
         */
        let value!: RawOptionValue

        if (after && after[1].type === tt.operand && !after[1].command) {
          ok(after[0] === ev.enter, 'expected option-argument enter event')
          const [, operand] = after

          // operand was passed by user, but may not be allowed.
          if (token.option.boolean) {
            // check if the operand was attached to the flag or if the command
            // doesn't accept any arguments to allow boolean flags to be
            // specified before command-arguments. otherwise, consider the
            // operand an option-argument and error accordingly.
            if (operand.attached || !this.info.arguments.length) {
              this.error({
                cause: { argument: operand.value },
                id: keid.excess_arguments,
                reason: `${String(token.option)} does not allow an argument`
              })
            }
          } else { // use option-argument passed by user.
            ok(operand.value !== undefined, 'expected operand token value')
            value = operand.value
          }

          // remove operand tokens.
          // tokens are removed outside of the if statement so the `splice`
          // call functions as cleanup when `error` does not exit the process.
          events.splice(afterIndex, 2)
        } else if (token.option.required) { // option-argument not passed.
          this.error({
            id: keid.missing_argument,
            reason: `${String(token.option)} requires an argument`
          })
        } else { // use option-argument preset.
          value = token.option.preset()
        }

        // set fallback option-argument for user if boolean flag was passed.
        if (token.option.boolean) value = value ??= true

        // emit option event.
        // the option event handler will parse the option-argument, as well as
        // store the option value and source.
        this.emitOption(
          token.option,
          value,
          optionValueSource.cli,
          token.value
        )

        // remove flag events.
        events.splice(index, 2)

        index--
        continue
      }

      // not an option recognized by `this` command. this means the option
      // might be a subcommand option or an option unknown to all commands.

      // an unknown option means further arguments are classified as unknown
      // so those arguments can be reprocessed by subcommands.
      dest = result.unknown
      dest.push(token.value)

      index++
      continue
    }

    // apply any option-related environment variables if option does not have a
    // value sourced from the cli, config, or unknown source.
    for (const cmd of [...this.ancestors(), this]) {
      for (const option of cmd.options()) {
        for (const env of option.env()) {
          /**
           * The source of the raw option value.
           *
           * @var {OptionValueSource | null | undefined} src
           */
          let src: OptionValueSource | null | undefined

          if (env && env in cmd.process.env) {
            src = cmd.optionValueSource(option.key)

            if (
              cmd.optionValue(option.key) === undefined ||
              includes([optionValueSource.default, optionValueSource.env], src)
            ) {
              /**
               * Environment variable value.
               *
               * @const {string} value
               */
              const value: string = cmd.process.env[env]!

              // emit option event.
              // the option event handler will parse the environment variable
              // value, as well as store the option value and source.
              this.emitOption(option, value, optionValueSource.env)
            }

            break
          }
        }
      }
    }

    operands = [...operands, ...result.operands]
    unknown = result.unknown
    this.argv = [...operands, ...unknown]

    /**
     * The command to dispatch.
     *
     * @const {Command | undefined} subcommand
     */
    const subcommand: Command | undefined = this.findCommand(operands[0])

    // dispatch subcommand.
    if (subcommand) {
      return subcommand.prepareCommand(operands.slice(1), unknown)
    }

    // dispatch default command.
    if (this.defaultCommand) {
      return this.defaultCommand.prepareCommand(operands, unknown)
    }

    // check for errors.
    if (!this.actionEvent) {
      this.checkForMissingMandatoryOptions()
      this.checkForUnknownOptions(result.unknown)
      this.checkCommandArguments()
    }

    // process arguments.
    this.args = []
    for (const [index, argument] of this.arguments().entries()) {
      /**
       * Default value configuration.
       *
       * @const {DefaultInfo} def
       */
      const def: DefaultInfo = argument.default()

      /**
       * Command-argument parser.
       *
       * @const {ParseArg} parser
       */
      const parser: ParseArg = argument.parser()

      /**
       * Processed argument value.
       *
       * @var {unknown} value
       */
      let value: unknown = def.value

      if (argument.variadic) {
        if (index < this.argv.length) {
          this.checkChoices(value = this.argv.slice(index), argument)
          ok(Array.isArray<string>(value), 'expected command-argument `value`')
          value = parser([...value], def.value)
        } else {
          ok(!argument.required, 'expected optional command-argument')
          if (value === undefined) value = []
        }

        if (!Array.isArray(value)) value = [value]

        ok(Array.isArray(value), 'expected command-argument `value`')
        this.args.push(...value)

        break
      } else if (index < this.argv.length) {
        this.checkChoices(value = this.argv[index]!, argument)
        ok(typeof value === 'string', 'expected command-argument `value`')
        this.args[index] = parser(value, def.value)
      }
    }

    return this
  }

  /**
   * Get user arguments.
   *
   * @see {@linkcode List}
   * @see {@linkcode ParseOptions}
   *
   * @protected
   * @instance
   *
   * @param {List<string> | null | undefined} [argv]
   *  List of command-line arguments
   * @param {ParseOptions | null | undefined} [options]
   *  Options for parsing `argv`
   * @return {string[]}
   *  List of user arguments
   */
  protected prepareUserArgs(
    argv?: List<string> | null | undefined,
    options?: ParseOptions | null | undefined
  ): string[] {
    options ??= {}
    options.from ??= 'node'

    /**
     * List of user arguments.
     *
     * @const {string[]} args
     */
    const args: string[] = [...fallback(argv, this.process.argv, isNIL)]

    if (options.from === 'node') {
      args.shift() // remove application
      args.shift() // remove script path
    }

    return args
  }

  /**
   * Get a snapshot of `this` command.
   *
   * @see {@linkcode CommandSnapshot}
   *
   * @public
   * @instance
   *
   * @return {CommandSnapshot}
   *  Command snapshot object
   */
  public snapshot(): CommandSnapshot {
    return {
      command: this.id(), // eslint-disable-next-line sort-keys
      ancestors: this.ancestors().map(ancestor => ancestor.id()),
      args: [...this.args],
      argv: [...this.argv],
      optionValueSources: { ...this.optionValueSources },
      opts: this.opts(),
      optsWithGlobals: this.optsWithGlobals()
    }
  }

  /**
   * Set the command summary.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} summary
   *  The command summary
   * @return {this}
   *  `this` command
   */
  public summary(summary: string | null | undefined): this

  /**
   * Get the command summary.
   *
   * @public
   * @instance
   *
   * @return {string | null}
   *  Summary of `this` command
   */
  public summary(): string | null

  /**
   * Get or set the command summary.
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} [summary]
   *  The command summary
   * @return {string | this | null}
   *  Summary of `this` command or `this` command
   */
  public summary(summary?: string | null | undefined): string | this | null {
    if (!arguments.length) return this.info.summary || null
    return this.info.summary = summary, this
  }

  /**
   * Get the command as a human-readable string.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  String representation of `this` command
   */
  public toString(): string {
    return `Command(${this.id() ?? ''})`
  }

  /**
   * Set the strategy for handling unknown command-line arguments.
   *
   * @see {@linkcode UnknownStrategy}
   *
   * @public
   * @instance
   *
   * @param {UnknownStrategy | null | undefined} [strategy=false]
   *  Unknown command-line argument strategy
   * @return {this}
   *  `this` command
   */
  public unknowns(strategy: UnknownStrategy | null | undefined): this {
    return this.info.unknown = strategy ?? false, this
  }

  /**
   * Set the command `usage` description.
   *
   * @see {@linkcode UsageData}
   *
   * @public
   * @instance
   *
   * @param {UsageData | null | undefined} usage
   *  Command usage data
   * @return {this}
   *  `this` command
   */
  public usage(usage: UsageData | null | undefined): this

  /**
   * Get the command usage description.
   *
   * @see {@linkcode UsageInfo}
   *
   * @public
   * @instance
   *
   * @return {UsageInfo}
   *  Command usage info
   */
  public usage(): UsageInfo

  /**
   * Get or set the command usage description.
   *
   * @see {@linkcode UsageInfo}
   * @see {@linkcode UsageData}
   *
   * @public
   * @instance
   *
   * @param {UsageData | null | undefined} [usage]
   *  Command usage data
   * @return {UsageInfo | this}
   *  Command usage info or `this` command
   */
  public usage(usage?: UsageData | null | undefined): UsageInfo | this {
    if (!arguments.length) {
      return {
        arguments: orNIL(this.info.usage?.arguments),
        options: orNIL(this.info.usage?.options) ?? '[options]',
        subcommand: orNIL(this.info.usage?.subcommand) ?? '[command]'
      }
    }

    return this.info.usage = usage, this
  }

  /**
   * Set the command version.
   *
   * > 👉 **Note**: This method auto-registers the version command option with
   * > the flags `-v | --version`. No cleanup is performed when this method is
   * > called with different flags (i.e. `info` as a string or `info.flags`).
   *
   * @see {@linkcode VersionData}
   *
   * @public
   * @instance
   *
   * @param {VersionData | null | undefined} version
   *  Version, version option instance, or version option info
   * @return {this}
   *  `this` command
   */
  public version(version: VersionData | null | undefined): this

  /**
   * Get the command version.
   *
   * @public
   * @instance
   *
   * @template {string} [T=string]
   *  Command version type
   *
   * @return {T | null}
   *  Command version
   */
  public version<T extends string = string>(): T | null

  /**
   * Get or set the command version.
   *
   * @see {@linkcode VersionData}
   *
   * @public
   * @instance
   *
   * @param {VersionData | null | undefined} [version]
   *  Version, version option instance, or version option info
   * @return {string | this | null}
   *  Command version or `this` command
   */
  public version(
    version?: VersionData | null | undefined
  ): string | this | null {
    if (arguments.length) {
      this.info.version = version as VersionOption | null | undefined

      if (version !== null && version !== undefined) {
        if (typeof version === 'string' || 'compare' in version) {
          version = { version }
        }

        // create version option.
        this.info.version = version as VersionOption
        if (!isOption(version)) this.info.version = this.createOption(version)

        // add version option and register parsed option listeners.
        this.addOption(this.info.version)
        this.on(this.info.version.event, this.onOptionWithAction.bind(this))
        this.on(this.info.version.event, this.onOptionVersion.bind(this))
      }

      return this
    }

    return this.info.version ? this.info.version.version : null
  }
}

export default Command
