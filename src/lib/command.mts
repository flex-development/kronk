/**
 * @file Command
 * @module kronk/lib/Command
 */

import initialCommand from '#constructs/initial-command'
import chars from '#enums/chars'
import tt from '#enums/tt'
import CommandError from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import formatList from '#internal/format-list'
import isList from '#internal/is-list'
import kCommand from '#internal/k-command'
import noop from '#internal/noop'
import toChunks from '#internal/to-chunks'
import toList from '#internal/to-list'
import Argument from '#lib/argument'
import Option from '#lib/option'
import isArgument from '#utils/is-argument'
import isCommand from '#utils/is-command'
import isKronkError from '#utils/is-kronk-error'
import isOption from '#utils/is-option'
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
  CommandInfo,
  CommandMetadata,
  CommandName,
  DefaultInfo,
  Exit,
  ExitCode,
  Flags,
  KronkErrorCause,
  KronkErrorInfo,
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
  UnknownStrategy
} from '@flex-development/kronk'
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
import EventEmitter from 'eventemitter2'
import plur from 'plur'

/**
 * Data model representing a command.
 *
 * @see {@linkcode EventEmitter}
 *
 * @class
 * @extends {EventEmitter}
 */
class Command extends EventEmitter {
  /**
   * Parsed arguments.
   *
   * @public
   * @instance
   * @member {any[]} args
   */
  public args: any[]

  /**
   * Raw arguments.
   *
   * @public
   * @instance
   * @member {string[]} argv
   */
  public argv: string[]

  /**
   * The default command.
   *
   * @protected
   * @instance
   * @member {Command | null | undefined} defaultCommand
   */
  protected defaultCommand: Command | null | undefined

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
   * Command logger.
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
   * Parent command.
   *
   * @public
   * @instance
   * @member {Command | null | undefined} parent
   */
  public parent: Command | null | undefined

  /**
   * Object containing information about the current process.
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
   *  Command info, command name,
   *  or string containing command name and arguments
   */
  constructor(info?: CommandInfo | string | null | undefined)

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandData}
   *
   * @param {string | null | undefined} [syntax]
   *  Command name or string containing command name and arguments
   * @param {CommandData | null | undefined} [info]
   *  Command info
   */
  constructor(
    syntax: string | null | undefined,
    info?: CommandData | null | undefined
  )

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode CommandInfo}
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name or string containing command name and arguments
   * @param {CommandData | null | undefined} [data]
   *  Command data
   */
  constructor(
    info?: CommandInfo | string | null | undefined,
    data?: CommandData | null | undefined
  ) {
    super({ delimiter: chars.colon })

    if (typeof info === 'object' && info !== null) {
      data = { ...info }
    } else {
      info = { ...data = { ...data }, name: info }
    }

    this.info = {
      ...info,
      arguments: [],
      options: new Map(),
      subcommands: []
    }

    this.args = []
    this.argv = []
    this.defaultCommand = null
    this.optionValueSources = {}
    this.optionValues = {}
    this.parent = null
    this.process = this.info.process ?? process

    this.logger = createLogger({
      format: { badge: false, columns: 0 },
      level: 'verbose',
      reporters: new FancyReporter(),
      stderr: this.process.stderr,
      stdout: this.process.stdout
    })

    Object.defineProperty(this, kCommand, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    if (typeof this.info.name === 'string') {
      const [, name, args] = /([^ ]+) *(.*)/.exec(this.info.name) ?? []

      this.info.name = name
      if (isNIL(data.arguments) && args) data.arguments = args
    }

    this.action(this.info.action)
    this.aliases(this.info.aliases)
    this.description(this.info.description)
    this.done(this.info.done)
    this.exiter(this.info.exit)
    this.hide(!!this.info.hidden)
    this.id(this.info.name)
    this.unknowns(this.info.unknown)

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

    if (!isNIL(data.subcommands)) {
      if (isList(data.subcommands)) this.commands(data.subcommands)
      else this.command(data.subcommands)
    }
  }

  /**
   * Get a boolean indicating if the command is the default command.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if command is default command, `false` otherwise
   */
  public get default(): boolean {
    return !!this.info.default
  }

  /**
   * Get a boolean indicating if the command should **not** be displayed in
   * help text.
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
   * Get the strategy for handling unknown command-line arguments.
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
   *  Callback to fire when command is executed
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
   *  Callback to fire when command is executed
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
   *  Callback to fire when command is executed
   * @return {Action | this}
   *  Command action or `this` command
   */
  public action(
    action?: Action | null | undefined
  ): Action | this {
    if (!arguments.length) {
      ok(this.info.action, 'expected `info.action`')
      return this.info.action
    }

    return this.info.action = fallback(action, noop, isNIL), this
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
        id: 'kronk/argument-after-variadic',
        reason: `Cannot have argument after variadic argument (${last.syntax})`
      })
    }

    return this.info.arguments.push(argument), this
  }

  /**
   * Add a prepared `subcommand`.
   *
   * See {@linkcode command} for creating an attached subcommand that inherits
   * settings from its {@linkcode parent}.
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
   *  If `subcommand` is the not the default subcommand and does not have a name
   *  or a subcommand with the same name or alias as `subcommand` already exists
   */
  public addCommand(subcommand: Command): never | this {
    /**
     * Subcommand name.
     *
     * @const {CommandName} id
     */
    const id: CommandName = subcommand.id()

    // ensure subcommands that are not the default subcommand have a name.
    if (!subcommand.default && !id) {
      throw new KronkError(
        'Subcommand must have name if not the default subcommand',
        'kronk/no-subcommand-id'
      )
    }

    // check subcommand id for conflicts.
    if (id && this.findCommand(id)) {
      throw new KronkError(
        `Subcommand with name or alias '${id}' already exists`,
        'kronk/duplicate-subcommand'
      )
    }

    // check subcommand aliases for conflicts.
    for (const alias of subcommand.aliases()) {
      if (this.findCommand(alias)) {
        throw new KronkError(
          `Subcommand with name or alias '${alias}' already exists`,
          'kronk/duplicate-subcommand'
        )
      }
    }

    // add new subcommand.
    this.info.subcommands.push(subcommand)

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
        throw new KronkError(
          `Option with flag '${flag}' already exists`,
          'kronk/duplicate-option'
        )
      }
    }

    // add new command option.
    if (option.long) this.info.options.set(option.long, option)
    if (option.short) this.info.options.set(option.short, option)

    // configure default option-argument value.
    this.optionValue(option.key, option.default().value, 'default')

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
    if (arguments.length) {
      ok(alias !== undefined, 'expected `alias`')
      ok(this.info.aliases instanceof Set, 'expected `info.aliases`')

      if (!isList(alias)) alias = [alias]
      for (const x of alias) this.info.aliases.add(x)

      return this
    }

    return fallback([...this.aliases()][0], null)
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
   *  List of aliases or `this` command
   */
  public aliases(
    aliases?: List<string> | string | null | undefined
  ): Set<string> | this {
    if (!arguments.length) {
      ok(typeof this.info.aliases !== 'string', 'expected `info.aliases`')
      return new Set(this.info.aliases)
    }

    if (typeof aliases === 'string') aliases = [aliases]
    return this.info.aliases = new Set(aliases), this
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
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentInfo}
   *
   * @public
   * @instance
   *
   * @param {Argument | ArgumentInfo | string} info
   *  Argument instance, info, or syntax
   * @return {this}
   *  `this` command
   */
  public argument(info: Argument | ArgumentInfo | string): this

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
   *  Argument info
   * @return {this}
   *  `this` command
   */
  public argument(syntax: string, info?: ArgumentData | null | undefined): this

  /**
   * Define an argument for the command.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentInfo}
   *
   * @public
   * @instance
   *
   * @param {Argument | ArgumentInfo | string} info
   *  Argument instance, info, or syntax
   * @param {ArgumentData | null | undefined} [data]
   *  Argument data
   * @return {this}
   *  `this` command
   */
  public argument(
    info: Argument | ArgumentInfo | string,
    data?: ArgumentData | null | undefined
  ): this {
    /**
     * The argument to add.
     *
     * @var {Argument} argument
     */
    let argument: Argument = info as Argument

    // create argument
    if (!isArgument(info)) argument = this.createArgument(info as never, data)

    // add new argument.
    return this.addArgument(argument)
  }

  /**
   * Define arguments for the command.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<Argument | ArgumentInfo | string> | string} infos
   *  List of argument instances, info, and/or syntaxes,
   *  or a string containing argument syntaxes
   * @return {this}
   *  `this` command
   */
  public arguments(infos: List<Argument | ArgumentInfo | string> | string): this

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
   * Get a list of command arguments or define arguments for the command.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<Argument | ArgumentInfo | string> | string} [infos]
   *  List of argument instances, info, and/or syntaxes,
   *  or a string containing argument syntaxes
   * @return {Argument[] | this}
   *  List of command arguments or `this` command
   */
  public arguments(
    infos?: List<Argument | ArgumentInfo | string> | string
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
      if (typeof choice === 'string') choice = [choice]

      for (const value of choice) {
        if (!choices.includes(value)) {
          this.errorInvalidArgument({
            additional: [`Choices: ${formatList(choices.map(c => `'${c}'`))}`],
            cause: { choice: value, choices },
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
        this.error(
          'kronk/missing-required-argument',
          `Missing required argument '${String(argument.syntax)}'`
        )
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

      this.error('kronk/excess-arguments', reason)
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
          this.error(
            'kronk/missing-mandatory-option',
            `${String(option)} is required`
          )
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
          id: 'kronk/unknown-option',
          reason: `Unknown option '${flag}'`
        })
      }
    }

    return this
  }

  /**
   * Define a subcommand.
   *
   * @see {@linkcode CommandInfo}
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @param {Command | CommandInfo | CommandName} info
   *  Subcommand info or name, string containing subcommand name and arguments,
   *  or subcommand instance
   * @return {Command}
   *  Subcommand instance
   */
  public command(info: Command | CommandInfo | CommandName): Command

  /**
   * Define a subcommand.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @param {CommandName} syntax
   *  Subcommand name or subcommand name and arguments
   * @param {CommandData | null | undefined} [info]
   *  Subcommand info
   * @return {Command}
   *  Subcommand instance
   */
  public command(
    syntax: CommandName,
    info?: CommandData | null | undefined
  ): Command

  /**
   * Define a subcommand.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode CommandInfo}
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @param {Command | CommandInfo | CommandName} info
   *  Subcommand info or name, string containing subcommand name and arguments,
   *  or subcommand instance
   * @param {CommandData | null | undefined} [data]
   *  Subcommand data
   * @return {Command}
   *  Subcommand instance
   */
  public command(
    info: Command | CommandInfo | CommandName,
    data?: CommandData | null | undefined
  ): Command {
    /**
     * The subcommand to add.
     *
     * @var {Command} subcommand
     */
    let subcommand: Command = info as Command

    // create subcommand
    if (!isCommand(info)) subcommand = this.createCommand(info as never, data)

    // add new subcommand.
    this.addCommand(subcommand)

    // copy inheritied settings.
    subcommand.copyInheritedSettings(this)

    return subcommand
  }

  /**
   * Batch define subcommands for the command.
   *
   * @see {@linkcode CommandInfo}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<Command | CommandInfo | string>} infos
   *  List of subcommand instances, info, names,
   *  or strings defining subcommand name and arguments
   * @return {this}
   *  `this` command
   */
  public commands(infos: List<Command | CommandInfo | string>): this

  /**
   * Get a list of subcommands.
   *
   * @public
   * @instance
   *
   * @return {Command[]}
   *  List of subcommands
   */
  public commands(): Command[]

  /**
   * Get a list of subcommands or define subcommands for the command.
   *
   * @see {@linkcode CommandInfo}
   * @see {@linkcode List}
   *
   * @public
   * @instance
   *
   * @param {List<Command | CommandInfo | string>} [infos]
   *  List of subcommand instances, info, names,
   *  or strings defining subcommand name and arguments
   * @return {Command[] | this}
   *  List of subcommands or `this` command
   */
  public commands(
    infos?: List<Command | CommandInfo | string>
  ): Command[] | this {
    if (!infos) return this.info.subcommands
    for (const info of infos) void this.command(info)
    return this
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
    ok(this.info.done, 'expected `info.done`')
    ok(this.info.exit, 'expected `info.exit`')

    this.process = parent.process
    this.logger = parent.logger

    this.unknowns(parent.info.unknown)
    if (this.info.done === noop) this.done(parent.info.done)
    if (this.info.exit === noop) this.exiter(parent.info.exit)

    return this
  }

  /**
   * Create a new unattached argument.
   *
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode ArgumentSyntax}
   * @see {@linkcode Argument}
   *
   * @public
   * @instance
   *
   * @param {ArgumentInfo | ArgumentSyntax} info
   *  Argument info or name
   * @return {Argument}
   *  New argument instance
   * @return {Argument}
   *  New argument instance
   */
  public createArgument(info: ArgumentInfo | ArgumentSyntax): Argument

  /**
   * Create a new unattached argument.
   *
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentSyntax}
   * @see {@linkcode Argument}
   *
   * @public
   * @instance
   *
   * @param {ArgumentSyntax} name
   *  Name of the argument
   * @param {ArgumentData | null | undefined} [info]
   *  Argument info
   * @return {Argument}
   *  New argument instance
   */
  public createArgument(
    name: ArgumentSyntax,
    info?: ArgumentData | null | undefined
  ): Argument

  /**
   * Create a new unattached argument.
   *
   * @see {@linkcode ArgumentData}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode ArgumentSyntax}
   * @see {@linkcode Argument}
   *
   * @public
   * @instance
   *
   * @param {ArgumentInfo | ArgumentSyntax} info
   *  Argument info or name
   * @param {ArgumentData | null | undefined} [data]
   *  Argument data
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
   * @see {@linkcode Command}
   *
   * @public
   * @instance
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name or string containing command name and arguments
   * @return {Command}
   *  New command instance
   */
  public createCommand(info?: CommandInfo | string | null | undefined): Command

  /**
   * Create a new unattached command.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode Command}
   *
   * @public
   * @instance
   *
   * @param {string | null | undefined} [syntax]
   *  Command name or command name and arguments
   * @param {CommandData | null | undefined} [info]
   *  Command info
   * @return {Command}
   *  New command instance
   */
  public createCommand(
    syntax: string | null | undefined,
    info?: CommandData | null | undefined
  ): Command

  /**
   * Create a new unattached command.
   *
   * @see {@linkcode CommandData}
   * @see {@linkcode CommandInfo}
   * @see {@linkcode Command}
   *
   * @public
   * @instance
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  Command info or name or string containing command name and arguments
   * @param {CommandData | null | undefined} [data]
   *  Command data
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
   * @see {@linkcode OptionInfo}
   * @see {@linkcode Option}
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
   * Create a new unattached option.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode OptionData}
   * @see {@linkcode Option}
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
   * @see {@linkcode OptionInfo}
   * @see {@linkcode OptionData}
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @param {Flags | OptionInfo} info
   *  Option info or flags
   * @param {OptionData | null | undefined} [data]
   *  Option data
   * @return {Option}
   *  New option instance
   */
  public createOption(
    info: Flags | OptionInfo,
    data?: OptionData | null | undefined
  ): Option {
    return new Option(info as never, data)
  }

  /**
   * Set the command description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} description
   *  Description of command
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
   *  Description of `this` command
   */
  public description(): string

  /**
   * Get or set the command description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} [description]
   *  Description of command
   * @return {string | this}
   *  Description of `this` command or `this` command
   */
  public description(
    description?: URL | string | null | undefined
  ): string | this {
    if (!arguments.length) return String(this.info.description ?? chars.empty)
    return this.info.description = description, this
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
   *  Callback to fire after command is executed
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
   *  Command options with globals
   * @template {any[]} [Args=any[]]
   *  Command arguments
   *
   * @return {Action<Opts, Args>}
   *  Callback to fire after command is executed
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
   *  Callback to fire after command is executed
   * @return {Action | this}
   *  Command done callback or `this` command
   */
  public done(done?: Action | null | undefined): Action | this {
    if (!arguments.length) return fallback(this.info.done, noop, isNIL)
    return this.info.done = fallback(done, noop, isNIL), this
  }

  /**
   * Display an error message and exit.
   *
   * @see {@linkcode KronkError}
   * @see {@linkcode KronkErrorInfo}
   *
   * @public
   * @instance
   *
   * @param {KronkError | KronkErrorInfo} e
   *  The error to display or info about the error
   * @return {never}
   */
  public error(e: KronkError | KronkErrorInfo): never

  /**
   * Display an error message and exit.
   *
   * @see {@linkcode ExitCode}
   *
   * @public
   * @instance
   *
   * @param {string} id
   *  Unique id representing the error
   * @param {string} reason
   *  Human-readable description of the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode process.exit}
   * @return {never}
   */
  public error(
    id: string,
    reason: string,
    code?: ExitCode | null | undefined
  ): never

  /**
   * Display an error message and exit.
   *
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkError}
   * @see {@linkcode KronkErrorInfo}
   *
   * @public
   * @instance
   *
   * @param {KronkError | KronkErrorInfo | string} info
   *  The error to display, info about the error, or unique error id
   * @param {string} [reason]
   *  Human-readable description of the error
   * @param {ExitCode | null | undefined} [code]
   *  Suggested exit code to use with {@linkcode info.process.exit}
   * @return {never}
   *  Never
   */
  public error(
    info: KronkError | KronkErrorInfo | string,
    reason?: string,
    code?: ExitCode | number | null | undefined
  ): never {
    /**
     * The error to display.
     *
     * @var {KronkError} e
     */
    let e: KronkError = info as KronkError

    if (!isKronkError(info)) { // @ts-expect-error [2345] overload usage.
      e = new CommandError(info, reason, code)
    }

    this.logger.fatal({ icon: '😵', message: e, tag: this.id() })
    this.exit(e)
  }

  /**
   * Display an invalid argument error and exit.
   *
   * @see {@linkcode ExitCode}
   * @see {@linkcode KronkErrorCause}
   * @see {@linkcode KronkErrorInfo}
   *
   * @public
   * @instance
   *
   * @param {KronkErrorInfo} info
   *  Info about the error
   * @param {string | string[] | null | undefined} [info.additional]
   *  Additional lines to be logged with the error
   * @param {KronkErrorCause | null | undefined} [info.cause]
   *  Info about the cause of the error
   * @param {ExitCode | null | undefined} [info.code]
   *  Suggested exit code to use with {@linkcode process.exit}
   * @param {string} info.reason
   *  Why the argument is invalid
   * @return {never}
   *  Never
   */
  public errorInvalidArgument(info: KronkErrorInfo): never

  /**
   * Display an invalid argument error and exit.
   *
   * @see {@linkcode KronkErrorCause}
   *
   * @public
   * @instance
   *
   * @param {string} reason
   *  Human-readable description of the error
   * @param {KronkErrorCause | null | undefined} [cause]
   *  Info about the cause of the error
   * @return {never}
   *  Never
   */
  public errorInvalidArgument(
    reason: string,
    cause?: KronkErrorCause | null | undefined
  ): never

  /**
   * Display an invalid argument error and exit.
   *
   * @see {@linkcode KronkErrorCause}
   *
   * @public
   * @instance
   *
   * @param {KronkErrorInfo | string} info
   *  Info about the error or why the argument is invalid
   * @param {KronkErrorCause | null | undefined} [cause]
   *  Info about the cause of the error
   * @return {never}
   *  Never
   */
  public errorInvalidArgument(
    info: KronkErrorInfo | string,
    cause?: KronkErrorCause | null | undefined
  ): never {
    if (typeof info === 'string') info = { cause, reason: info }
    this.error(new CommandError({ ...info, id: 'kronk/invalid-argument' }))
  }

  /**
   * Exit the process.
   *
   * @see {@linkcode CommandError}
   *
   * @public
   * @instance
   *
   * @param {CommandError | null | undefined} [e]
   *  The error to handle
   * @return {never}
   *  Never
   */
  public exit(e?: CommandError | null | undefined): never {
    this.exiter().call(this, e)
    this.process.exit(e?.code, e)
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
   *  Callback to fire when process is exited
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
   *  Callback to fire when process is exited
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
   *  Callback to fire when process is exited
   * @return {Exit | this}
   *  Command exit callback or `this` command
   */
  public exiter(exit?: Exit | null | undefined): Exit | this {
    if (!arguments.length) return fallback(this.info.exit, noop, isNIL)
    return this.info.exit = fallback(exit, noop, isNIL), this
  }

  /**
   * Find a command with a name or alias matching `x`.
   *
   * @see {@linkcode Command}
   * @see {@linkcode CommandName}
   * @see {@linkcode List}
   *
   * @protected
   * @instance
   *
   * @param {CommandName | List<CommandName> | undefined} x
   *  Command name, command alias, or list of names and/or aliases
   * @return {Command | this | undefined}
   *  Command with name or alias matching `x`
   */
  protected findCommand(
    x: CommandName | List<CommandName> | undefined
  ): Command | this | undefined {
    if (typeof x === 'string' && (this.id() === x || this.aliases().has(x))) {
      return this
    }

    if (x !== undefined && this.info.subcommands.length) {
      for (const cmd of this.commands()) {
        for (const id of toList(x)) {
          switch (true) {
            case id === cmd.id():
            case typeof id === 'string' && cmd.aliases().has(id):
              return cmd
            default:
              continue
          }
        }
      }
    }

    return undefined
  }

  /**
   * Find an option with a flag matching `flag`.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {string | null | undefined} flag
   *  The option flag to match
   * @return {Option | undefined}
   *  Option with the long or short flag `flag`
   */
  protected findOption(flag: string | null | undefined): Option | undefined {
    return flag ? this.info.options.get(flag) : undefined
  }

  /**
   * Find a subcommand option with a flag matching `flag`.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {string | null | undefined} flag
   *  The option flag to match
   * @return {Option | undefined}
   *  Subcommand option with the long or short flag `flag`
   */
  protected findSubOption(flag: string | null | undefined): Option | undefined {
    /**
     * Subcommand option with the long or short flag `flag`.
     *
     * @var {Option | undefined} option
     */
    let option: Option | undefined = undefined

    if (flag) {
      for (const subcommand of this.commands()) {
        if (subcommand.info.options.has(flag)) {
          option = subcommand.info.options.get(flag)
          break
        }
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
   * Set the command name.
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
   * Get the command name.
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
   * Get or set the command name.
   *
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @param {CommandName | undefined} [name]
   *  Command name
   * @return {CommandName | this}
   *  Name of `this` command or `this` command
   */
  public id(name?: CommandName | undefined): CommandName | this {
    if (!arguments.length) return this.info.name?.trim() || null
    return this.info.name = name?.trim(), this
  }

  /**
   * Define an option for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {Flags | Option | OptionInfo} info
   *  Option flags, instance, or info
   * @return {this}
   *  `this` command
   */
  public option(info: Flags | Option | OptionInfo): this

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
   *  Option info
   * @return {this}
   *  `this` command
   */
  public option(flags: Flags, info?: OptionData | null | undefined): this

  /**
   * Define an option for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionData}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {Flags | Option | OptionInfo} info
   *  Option flags, instance, or info
   * @param {OptionData | null | undefined} [data]
   *  Option data
   * @return {this}
   *  `this` command
   */
  public option(
    info: Flags | Option | OptionInfo,
    data?: OptionData | null | undefined
  ): this {
    /**
     * The option to add.
     *
     * @var {Option} option
     */
    let option: Option = info as Option

    // create option.
    if (!isOption(info)) option = this.createOption(info as never, data)

    // add new option.
    return this.addOption(option)
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
   *  Option value source
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
   *  Option value source or `this` command
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
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {List<Flags | Option | OptionInfo>} infos
   *  List of option flags, instances, or info
   * @return {this}
   *  `this` command
   */
  public options(infos: List<Flags | Option | OptionInfo>): this

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
   * Get a list of command options or define options for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode List}
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   *
   * @public
   * @instance
   *
   * @param {List<Flags | Option | OptionInfo>} [infos]
   *  List of option flags, instances, or info
   * @return {Option[] | this}
   *  List of command options or `this` command
   */
  public options(infos?: List<Flags | Option | OptionInfo>): Option[] | this {
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
   * @template {c} T
   *  Option values type
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
   * > 👉 **Note**: By default, global options overwrite local options. To
   * > change this behavior, `info.optionPriority`
   * > ({@linkcode CommandInfo.optionPriority}) should be set to `'local'`.
   *
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} T
   *  Option values type
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

    void cmd.action().call(cmd, cmd.opts(), ...cmd.args as unknown[])
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

    await cmd.action().call(cmd, cmd.opts(), ...cmd.args as unknown[])
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
        context.findCommand = this.findCommand.bind(this)
        context.findOption = this.findOption.bind(this)
        context.findSubOption = this.findSubOption.bind(this)
        return context[kCommand] = true, void context
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
         * Index of command-line argument chunk the token was created from.
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

        // `token.value` is either a subcommand id, command-argument, or a raw
        // option-argument for an option unknown to `this` command.
        if (Array.isArray(token.value)) {
          dest.push(...token.value)
        } else {
          dest.push(token.value)
        }

        index++
        continue
      }

      // any option flags passed by the user are represented as flag tokens.
      // if an option-argument was passed, the event after the flag exit event
      // will be an option-argument event. the option-argument token value is
      // the raw option-argument value, or a list of raw option-argument values
      // for variadic options.
      if (token.type === tt.flag) {
        ok(event === ev.enter, 'expected flag enter event')
        ok(events[index + 1], 'expected event after flag enter event')
        ok(events[index + 1]![0] === ev.exit, 'expected exit event')
        ok(events[index + 1]![1].type === tt.flag, 'expected flag exit event')
        ok(typeof token.value === 'string', 'expected string token value')

        if (
          token.option && // make sure option is not a subcommand option.
          this.findOption(token.option.long || token.option.short)
        ) {
          /**
           * Option-argument parser.
           *
           * The default parser is an identity function that returns the raw
           * option-argument value.
           *
           * @const {ParseArg}
           */
          const parser: ParseArg = token.option.parser()

          /**
           * Default value configuration.
           *
           * @const {DefaultInfo} def
           */
          const def: DefaultInfo = token.option.default()

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
              // operand and option-argument and error accordingly.
              if (operand.attached || !this.info.arguments.length) {
                /**
                 * Reason for error.
                 *
                 * @var {string} reason
                 */
                let reason: string = String(token.option)

                reason += chars.space + 'does not allow an argument'

                this.errorInvalidArgument(reason, { argument: operand.value })
              }
            } else { // use option-argument passed by user.
              ok(operand.value !== undefined, 'expected operand token value')
              value = operand.value
              events.splice(afterIndex, 2)
            }
          } else if (token.option.required) { // option-argument not passed.
            const { option } = token
            this.errorInvalidArgument(`${String(option)} requires an argument`)
          } else { // use option-argument preset.
            value = token.option.preset()
          }

          // set fallback option-argument for user if boolean flag was passed.
          if (token.option.boolean) value = value ??= true

          // parse option-arguments + set option value and source
          if (value !== null) {
            if (typeof value === 'boolean') {
              this.optionValue(token.option.key, value, 'cli')
            } else {
              this.checkChoices(value, token.option)
              this.optionValue(token.option.key, parser(value, def.value))
              this.optionValueSource(token.option.key, 'cli')
            }
          }

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
    }

    // apply any option-related environment variables if option does not have a
    // value sourced from the cli, config, or unknown source.
    for (const cmd of [...this.ancestors(), this]) {
      for (const option of cmd.options()) {
        /**
         * Name of environment variable to check for {@linkcode option} value.
         *
         * @const {string | null} env
         */
        const env: string | null = option.env()

        if (env && env in cmd.process.env) {
          if (
            cmd.optionValue(option.key) === undefined ||
            includes(['default', 'env'], cmd.optionValueSource(option.key))
          ) {
            /**
             * Default value configuration.
             *
             * @const {DefaultInfo} def
             */
            const def: DefaultInfo = option.default()

            /**
             * Environment variable value.
             *
             * @const {string} value
             */
            const value: string = cmd.process.env[env]!

            cmd.optionValue(option.key, option.parser()(value, def.value))
            cmd.optionValueSource(option.key, 'env')
          }
        }
      }
    }

    operands = [...operands, ...result.operands]
    unknown = result.unknown
    this.argv = [...operands, ...unknown]

    /**
     * Subcommand instance.
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

    this.checkForMissingMandatoryOptions()
    this.checkForUnknownOptions(result.unknown)
    this.checkCommandArguments()

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
   * Get `this` command as a human-readable string.
   *
   * @public
   * @instance
   * @override
   *
   * @return {string}
   *  String representation of `this` command
   */
  public override toString(): string {
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
}

export default Command
