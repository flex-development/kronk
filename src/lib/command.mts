/**
 * @file Command
 * @module kronk/lib/Command
 */

import initialCommand from '#constructs/initial-command'
import argumentValueSource from '#enums/argument-value-source'
import chars from '#enums/chars'
import hooks from '#enums/hooks'
import keid from '#enums/keid'
import optionValueSource from '#enums/option-value-source'
import tt from '#enums/tt'
import CommandEvent from '#events/command.event'
import formatList from '#internal/format-list'
import isList from '#internal/is-list'
import isPromise from '#internal/is-promise'
import kCommand from '#internal/k-command'
import noop from '#internal/noop'
import toChunks from '#internal/to-chunks'
import toList from '#internal/to-list'
import trim from '#internal/trim'
import Argument from '#lib/argument'
import Help from '#lib/help'
import Helpable from '#lib/helpable.abstract'
import Option from '#lib/option'
import isCommandEvent from '#utils/is-command-event'
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
  ArgumentValueSource,
  ArgumentValueSources,
  Awaitable,
  CommandData,
  CommandErrorInfo,
  CommandEventName,
  CommandInfo,
  CommandMetadata,
  CommandName,
  CommandSnapshot,
  DefaultInfo,
  ExampleInfo,
  ExamplesData,
  Exit,
  Flags,
  HelpCommandData,
  HelpOptionData,
  HelpTextOptions,
  HooksData,
  HooksInfo,
  KronkEventListener,
  KronkHook,
  KronkHookMap,
  KronkHookName,
  List,
  Numeric,
  OptionData,
  OptionInfo,
  OptionPriority,
  OptionValues,
  OptionValueSource,
  OptionValueSources,
  ParseArg,
  ParseOptions,
  ParseUnknownResult,
  Process,
  RawOptionValue,
  SubcommandInfo,
  SubcommandsInfo,
  UnknownStrategy,
  UsageData,
  UsageInfo,
  Version,
  VersionOptionData
} from '@flex-development/kronk'
import { CommandError, KronkError } from '@flex-development/kronk/errors'
import { KronkEvent, OptionEvent } from '@flex-development/kronk/events'
import {
  isCommand,
  isKronkError,
  isOption,
  isSubcommandInfo
} from '@flex-development/kronk/utils'
import {
  constant,
  entries,
  fallback,
  isNIL,
  keys,
  reduce,
  reduceRight
} from '@flex-development/tutils'
import { ok } from 'devlop'
import EventEmitter, { type ListenerFn, type OnOptions } from 'eventemitter2'
import plur from 'plur'

/**
 * A command.
 *
 * Commands use the {@linkcode initialCommand} construct to tokenize arguments,
 * delimiters, operands, option flags, and subcommand names.
 *
 * @see {@linkcode Helpable}
 *
 * @class
 * @extends {Helpable}
 */
class Command extends Helpable {
  /**
   * The parsed command arguments.
   *
   * @public
   * @instance
   * @member {any[]} args
   */
  public args: any[]

  /**
   * List, where each index is a the position of parsed command-argument
   * and each value is the source of the argument.
   *
   * @see {@linkcode ArgumentValueSources}
   *
   * @protected
   * @instance
   * @member {ArgumentValueSources} argumentValueSources
   */
  protected argumentValueSources: ArgumentValueSources

  /**
   * The raw command-line arguments.
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
   * @member {EventEmitter} events
   */
  protected readonly events: EventEmitter

  /**
   * Whether command help was requested.
   *
   * @protected
   * @instance
   * @member {boolean} helpRequested
   */
  protected helpRequested: boolean

  /**
   * Command metadata.
   *
   * @see {@linkcode CommandMetadata}
   *
   * @protected
   * @instance
   * @override
   * @member {CommandMetadata} info
   */
  declare protected info: CommandMetadata

  /**
   * The event whose listener takes precedence over any parsing checks
   * and the command {@linkcode action}.
   *
   * @see {@linkcode KronkEvent}
   *
   * @protected
   * @instance
   * @member {KronkEvent | null | undefined} interrupter
   */
  protected interrupter: KronkEvent | null | undefined

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
   * Record, where each key is an option key
   * and each value is a parsed option value.
   *
   * @see {@linkcode OptionValues}
   *
   * @protected
   * @instance
   * @member {OptionValues} optionValues
   */
  protected optionValues: OptionValues

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
   * Whether the command version was requested.
   *
   * @protected
   * @instance
   * @member {boolean} versionRequested
   */
  protected versionRequested: boolean

  /**
   * Create a new parent command or subcommand.
   *
   * @see {@linkcode CommandInfo}
   * @see {@linkcode SubcommandInfo}
   *
   * @param {CommandInfo | SubcommandInfo} info
   *  The command info or name
   */
  constructor(info: CommandInfo | SubcommandInfo | string)

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandInfo}
   *
   * @param {CommandInfo | string | null | undefined} [info]
   *  The command info or name
   */
  constructor(info?: CommandInfo | string | null | undefined)

  /**
   * Create a new command.
   *
   * @see {@linkcode CommandData}
   *
   * @param {string | null | undefined} [name]
   *  The command name
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
   * @see {@linkcode SubcommandInfo}
   *
   * @param {CommandInfo | SubcommandInfo | string | null | undefined} [info]
   *  The command info or name
   * @param {CommandData | null | undefined} [data]
   *  Additional command info
   */
  constructor(
    info?: CommandInfo | SubcommandInfo | string | null | undefined,
    data?: CommandData | null | undefined
  ) {
    if (typeof info === 'object' && info !== null) {
      data = { ...data, ...info }
    } else {
      info = { ...data = { ...data }, name: info }
    }

    super(info)

    this.info = {
      ...this.info,
      aliases: new Set(),
      arguments: [],
      examples: [],
      hooks: {} as HooksInfo,
      options: new Map(),
      parent: undefined,
      subcommands: new Map(),
      versionOption: null
    }

    this.args = []
    this.argumentValueSources = []
    this.argv = []
    this.defaultCommand = null
    this.events = new EventEmitter({ delimiter: chars.colon })
    this.helpRequested = false
    this.interrupter = null
    this.optionValueSources = {}
    this.optionValues = {}
    this.parent = data.parent ?? null
    this.process = this.info.process ?? process
    this.versionRequested = false

    delete this.info.parent
    delete this.info.process

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
    this.aliases(data.aliases)
    this.exiter(this.info.exit)
    this.examples(data.examples)
    this.help(this.info.help)
    this.helpOption(this.info.helpOption)
    this.hooks(data.hooks)
    this.id(this.info.name)
    this.optionPriority(this.info.optionPriority)
    this.summary(this.info.summary)
    this.unknowns(this.info.unknown)
    this.usage(this.info.usage)
    this.version(this.info.version)
    !isNIL(this.info.version) && this.versionOption(data.versionOption)

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

    // configure help subcommand with user configuration,
    // or add default help subcommand if command has subcommands.
    if (!isNIL(this.info.helpCommand) || this.info.subcommands.size) {
      this.helpCommand(this.info.helpCommand)
    }
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
   * The event name for the command.
   *
   * @see {@linkcode CommandEventName}
   *
   * @public
   * @instance
   *
   * @return {CommandEventName}
   *  Command event name
   */
  public get event(): CommandEventName {
    return ['command', ...this.ancestors().reverse(), this].map(value => {
      return typeof value === 'string' ? value : value.id() ?? chars.dollar
    }).join(chars.colon) as CommandEventName
  }

  /**
   * Get a function that returns `this` command.
   *
   * @protected
   * @instance
   *
   * @return {() => this}
   *  This context function
   */
  protected get self(): () => this {
    return constant(this)
  }

  /**
   * Whether the command has subcommands, but no {@linkcode action}.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if command is structural, `false` otherwise
   */
  public get structural(): boolean {
    return (
      // no default command
      !this.defaultCommand &&
      // meaningless action
      this.info.action === noop &&
      // has subcommands
      !!this.info.subcommands.size &&
      // zero visible arguments
      !this.info.arguments.filter(arg => String(arg.description())).length
    )
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
   * Set the action callback.
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
   * Get the action callback.
   *
   * For structural commands, and commands where help was requested (via option
   * or subcommand), the action callback prints the help text.
   *
   * @see {@linkcode Action}
   * @see {@linkcode OptionValues}
   *
   * @public
   * @instance
   *
   * @template {OptionValues} [Opts=OptionValues]
   *  The parsed command options
   * @template {any[]} [Args=any[]]
   *  The parsed command arguments
   *
   * @return {Action<Opts, Args>}
   *  The callback to fire when the command is ran
   */
  public action<
    Opts extends OptionValues = OptionValues,
    Args extends any[] = any[]
  >(): Action<Opts, Args>

  /**
   * Get or set the action callback.
   *
   * @see {@linkcode Action}
   *
   * @public
   * @instance
   *
   * @param {Action | null | undefined} [action]
   *  The callback to fire when the command is ran
   * @return {Action | this}
   *  The action callback or `this` command
   */
  public action(action?: Action | null | undefined): Action | this {
    if (arguments.length) return this.info.action = action ?? noop, this

    // print command version on request.
    if (this.versionRequested) return this.printVersion.bind(this)

    // print help text on explicit or implicit request.
    // explicit requests are made help subcommand or option;
    // implicit requests are made when structural commands are invoked.
    if (this.structural || this.helpRequested) return this.printHelp.bind(this)

    return ok(this.info.action, 'expected `info.action`'), this.info.action
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
     * The last registered argument.
     *
     * @const {Argument | undefined} last
     */
    const last: Argument | undefined = this.info.arguments.at(-1)

    if (last) {
      if (last.variadic) {
        throw new KronkError({
          cause: { argument: argument.syntax, last: last.syntax },
          id: keid.argument_after_variadic,
          reason: 'Cannot have argument after variadic argument'
        })
      }

      if (!last.required && argument.required) {
        throw new KronkError({
          cause: { argument: argument.syntax, last: last.syntax },
          id: keid.required_argument_after_optional,
          reason: 'Cannot have required argument after optional argument'
        })
      }
    }

    /**
     * The default value configuration.
     *
     * @var {DefaultInfo | undefined} def
     */
    let def: DefaultInfo | undefined

    // configure default value for optional arguments.
    if (!argument.required && (def = argument.default()) && 'value' in def) {
      const { value } = def

      this.argumentValue(
        this.info.arguments.length,
        typeof value === 'string' ? argument.parser()(value) : value,
        argumentValueSource.default
      )
    }

    // add new argument.
    return argument.parent = this, this.info.arguments.push(argument), this
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

    /**
     * List of parent command aliases.
     *
     * @const {Set<string>} aliases
     */
    const aliases: Set<string> = this.aliases()

    /**
     * The name of the parent command.
     *
     * @const {CommandName} name
     */
    const name: CommandName = this.id()

    // check subcommand references for conflicts.
    for (const ref of [sub, ...subcommand.aliases()]) {
      if (ref === name) {
        throw new KronkError({
          cause: { command: name, subcommand: sub },
          id: keid.invalid_subcommand_name,
          reason: 'Subcommand cannot have same name as parent command'
        })
      }

      if (aliases.has(ref)) {
        throw new KronkError({
          cause: {
            alias: ref,
            aliases: [...aliases],
            command: name,
            subcommand: sub
          },
          id: keid.invalid_subcommand_name,
          reason: 'Subcommand cannot have same alias as parent command'
        })
      }

      if (this.info.subcommands.has(ref)) {
        throw new KronkError({
          cause: {
            alias: sub !== ref,
            command: name,
            ref,
            subcommand: sub
          },
          id: keid.duplicate_subcommand,
          reason: `Subcommand with name or alias '${ref}' already exists`
        })
      }

      // add new subcommand and map to name or alias.
      this.info.subcommands.set(ref, subcommand)
    }

    // set parent command.
    subcommand.parent = this

    // set default command.
    if (subcommand.default) this.defaultCommand = subcommand

    // add event handler.
    this.on<CommandEvent>(subcommand.event, this.onCommand.bind(this))

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

    // set parent command.
    option.parent = this

    // add new command option.
    if (option.long) this.info.options.set(option.long, option)
    if (option.short) this.info.options.set(option.short, option)

    /**
     * The default value configuration.
     *
     * @const {DefaultInfo | undefined} def
     */
    const def: DefaultInfo | undefined = option.default()

    // configure default option-argument value.
    if (def && 'value' in def) {
      /**
       * The default option value.
       *
       * @var {unknown} value
       */
      let value: unknown = def.value

      // parse default argument value.
      if (typeof value === 'string') {
        value = option.parser()(value, def.value)
      }

      // set default argument value.
      this.optionValue(option.key, value, optionValueSource.default)
    }

    // add event handler.
    this.on<OptionEvent>(option.event, this.onOption.bind(this))

    return this
  }

  /**
   * Add a command alias.
   *
   * > 👉 **Note**: This method can be called more than once
   * > to add multiple aliases.
   *
   * @public
   * @instance
   *
   * @param {string} alias
   *  An alias for the command
   * @return {this}
   *  `this` command
   */
  public alias(alias: string): this

  /**
   * Get an alias for the command.
   *
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @return {CommandName}
   *  Command alias
   */
  public alias(): CommandName

  /**
   * Get or add a command alias.
   *
   * @see {@linkcode CommandName}
   *
   * @public
   * @instance
   *
   * @param {string} [alias]
   *  An alias for the command
   * @return {CommandName | this}
   *  Command alias or `this` command
   */
  public alias(alias?: string): CommandName | this {
    if (!arguments.length) return fallback([...this.aliases()][0], null)
    ok(this.info.aliases instanceof Set, 'expected `info.aliases`')
    return this.info.aliases.add(alias!), this
  }

  /**
   * Add aliases for the command.
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
   *  List of command aliases
   */
  public aliases(): Set<string>

  /**
   * Get or add aliases for the command.
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
    if (!arguments.length) return this.info.aliases
    for (const alias of toList(aliases)) this.alias(alias)
    return this
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
   * Set an argument value.
   *
   * @see {@linkcode ArgumentValueSource}
   * @see {@linkcode Numeric}
   *
   * @public
   * @instance
   *
   * @param {Numeric | number} index
   *  The position of the argument
   * @param {unknown} value
   *  The parsed argument value
   * @param {ArgumentValueSource | null | undefined} [source]
   *  The source of the argument value
   * @return {this}
   *  `this` command
   */
  public argumentValue(
    index: Numeric | number,
    value: unknown,
    source?: ArgumentValueSource | null | undefined
  ): this

  /**
   * Get an argument value.
   *
   * @see {@linkcode Numeric}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  The parsed argument value
   *
   * @param {Numeric | number} index
   *  The position of the argument.
   *  A negative index will count back from the last argument
   * @return {T}
   *  The parsed argument value
   */
  public argumentValue<T>(index: Numeric | number): T

  /**
   * Get or set an argument value.
   *
   * @see {@linkcode Numeric}
   *
   * @public
   * @instance
   *
   * @template {any} T
   *  The parsed argument value
   *
   * @param {Numeric | number} index
   *  The position of the argument.
   *  A negative index will count back from the last argument
   *  when retrieving a value
   * @param {T} [value]
   *  The parsed argument value
   * @param {ArgumentValueSource | null | undefined} [source]
   *  The source of the argument value
   * @return {T | this}
   *  The stored argument value or `this` command
   */
  public argumentValue<T>(
    index: Numeric | number,
    value?: unknown,
    source?: ArgumentValueSource | null | undefined
  ): T | this {
    if (arguments.length === 1) return this.args.at(+index) as T
    return this.argumentValueSource(index, source).args[index] = value, this
  }

  /**
   * Set an argument value source.
   *
   * @see {@linkcode ArgumentValueSource}
   * @see {@linkcode Numeric}
   *
   * @public
   * @instance
   *
   * @param {Numeric | number} index
   *  The position of the argument
   * @param {ArgumentValueSource | null | undefined} source
   *  The source of the argument value
   * @return {this}
   *  `this` command
   */
  public argumentValueSource(
    index: Numeric | number,
    source: ArgumentValueSource | null | undefined
  ): this

  /**
   * Get an argument value source.
   *
   * @see {@linkcode ArgumentValueSource}
   * @see {@linkcode Numeric}
   *
   * @public
   * @instance
   *
   * @param {Numeric | number} index
   *  The position of the argument.
   *  A negative index will count back from the last argument
   * @return {ArgumentValueSource | undefined}
   *  The argument value source
   */
  public argumentValueSource(
    index: Numeric | number
  ): ArgumentValueSource | undefined

  /**
   * Get or set an argument value source.
   *
   * @see {@linkcode ArgumentValueSource}
   * @see {@linkcode Numeric}
   *
   * @public
   * @instance
   *
   * @param {Numeric | number} index
   *  The position of the argument.
   *  A negative index will count back from the last argument
   *  when retrieving a source
   * @param {ArgumentValueSource | null | undefined} [source]
   *  The source of the argument value
   * @return {ArgumentValueSource | this | undefined}
   *  The argument value source or `this` command
   */
  public argumentValueSource(
    index: Numeric | number,
    source?: ArgumentValueSource | null | undefined
  ): ArgumentValueSource | this | undefined {
    if (arguments.length === 1) return this.argumentValueSources[index]
    return this.argumentValueSources[index] = source ?? undefined, this
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
   * Chain a callback, calling the function after `promise` is resolved,
   * otherwise synchronously call `fn`.
   *
   * @see {@linkcode Awaitable}
   *
   * @protected
   * @instance
   *
   * @template {any} T
   *  The resolved value of `fn`
   * @template {Awaitable<T>} [Return=Awaitable<T>]
   *  The return value of `fn`
   * @template {(...args: any[]) => Return} [Fn=(...args: any[]) => Return]
   *  The function
   *
   * @param {Awaitable} promise
   *  The promise to chain
   * @param {Fn} fn
   *  The function to call
   * @param {ThisParameterType<Fn> | null | undefined} [self]
   *  The `this` context of `fn`
   * @param {Parameters<Fn>} params
   *  The arguments to pass to `fn`
   * @return {Awaitable<T>}
   *  A new promise to resolve or the result of the `fn`
   */
  protected chainOrCall<
    T,
    Return extends Awaitable<T> = Awaitable<T>,
    Fn extends (...args: any[]) => Return = (...args: any[]) => Return
  >(
    promise: Awaitable,
    fn: Fn,
    self?: ThisParameterType<Fn> | null | undefined,
    ...params: Parameters<Fn>
  ): Awaitable<T> {
    return isPromise(promise) // already have a promise, chain callback.
      ? promise.then((): Awaitable<T> => fn.call(self, ...params))
      : fn.call(self, ...params)
  }

  /**
   * Chain or call a hook for a command and its ancestors.
   *
   * @see {@linkcode KronkHookMap}
   * @see {@linkcode KronkHookName}
   *
   * @protected
   * @instance
   *
   * @template {KronkHookName} H
   *  The hook name
   * @template {Command} T
   *  The running command
   *
   * @param {H} hook
   *  The hook name
   * @param {Command} command
   *  The running command
   * @param {ReturnType<KronkHookMap[H]>} [promise]
   *  The promise to chain
   * @return {ReturnType<KronkHookMap[H]>}
   *  Nothing
   */
  protected chainOrCallHook<H extends KronkHookName, T extends Command>(
    hook: H,
    command: T,
    promise?: ReturnType<KronkHookMap[H]>
  ): ReturnType<KronkHookMap[H]>

  /**
   * Chain or call a hook for a command and its ancestors.
   *
   * > 👉 **Note**: `hook` is expected to be a `Command` method.
   *
   * @see {@linkcode KronkHook}
   * @see {@linkcode KronkHookName}
   *
   * @protected
   * @instance
   *
   * @param {KronkHookName} hook
   *  The hook name
   * @param {Command} command
   *  The running command
   * @param {ReturnType<KronkHook>} [promise]
   *  The promise to chain
   * @return {ReturnType<KronkHook>}
   *  Nothing
   */
  protected chainOrCallHook(
    hook: KronkHookName,
    command: Command,
    promise?: ReturnType<KronkHook>
  ): ReturnType<KronkHook> {
    /**
     * The list of commands.
     *
     * @const {Command[]} commands
     */
    const commands: Command[] = hook === hooks.preCommand
      ? [this]
      : [command, ...command.ancestors()]

    /**
     * The result of the hook chain.
     *
     * @var {ReturnType<KronkHook>} result
     */
    let result: ReturnType<KronkHook> = promise

    // call hooks in initial order for `post` hooks, but in reverse otherwise.
    if (!hook.startsWith('post')) commands.reverse()

    // call hooks for each command.
    for (const self of commands) {
      for (const callback of self.hook(hook)) {
        result = this.chainOrCall(result, callback, self, command)
      }
    }

    return result
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

      this.error({
        cause: { argv: this.argv, expected: this.info.arguments.length },
        id: keid.excess_arguments,
        reason
      })
    }

    return this
  }

  /**
   * Check dependent options and error if any required options are missing.
   *
   * > 👉 **Note**: Local options can depend on global options and other
   * > local options, but global options cannot depend on local options.
   *
   * @protected
   * @instance
   *
   * @return {never | this}
   *  `this` command
   */
  protected checkDependentOptions(): never | this {
    /**
     * The list of commands.
     *
     * @const {Command[]} commands
     */
    const commands: Command[] = [this, ...this.ancestors()]

    /**
     * The list of user options.
     *
     * @const {Option[]} options
     */
    const options: Option[] = commands.flatMap(cmd => cmd.userOptions())

    // for each user option with dependencies,
    // check if the dependee options were also passed by the user.
    for (const dependent of options) {
      for (const depend of dependent.depends()) {
        /**
         * The option the current option depends on.
         *
         * @var {Option | undefined} dependee
         */
        let dependee: Option | undefined = options.find(opt => {
          return this.matchOption(opt, depend)
        })

        // error if dependee option was not found.
        if (!dependee) {
          dependee = commands
            .flatMap(cmd => [...cmd.uniqueOptions()])
            .find(opt => this.matchOption(opt, depend))

          // dependee option does not exist.
          if (!dependee) continue

          // dependee option not passed by user.
          this.error({
            cause: { dependee: dependee.flags, dependent: dependent.flags },
            id: keid.missing_dependee_option,
            reason: `${String(dependent)} requires ${String(dependee)}`
          })
        }
      }
    }

    return this
  }

  /**
   * Check for conflicting options and error if any are found.
   *
   * > 👉 **Note**: Local options can conflict with global options and other
   * > local options, but global options cannot conflict with local options.
   *
   * @protected
   * @instance
   *
   * @return {never | this}
   *  `this` command
   */
  protected checkForConflictingOptions(): never | this {
    for (const command of [this, ...this.ancestors()]) {
      /**
       * The list of commands.
       *
       * @const {Command[]} commands
       */
      const commands: Command[] = [command, ...command.ancestors()]

      /**
       * The list of user options.
       *
       * @const {Option[]} options
       */
      const options: Option[] = commands.flatMap(cmd => cmd.userOptions())

      // for each user option,
      // check if the user also passed a conflicting option.
      for (const option of command.userOptions()) {
        for (const conflict of option.conflicts()) {
          /**
           * The conflicting option.
           *
           * @const {Option | undefined} conflicting
           */
          const conflicting: Option | undefined = options.find(opt => {
            return this.matchOption(opt, conflict)
          })

          // error if a conflicting option was found.
          if (conflicting) {
            /**
             * The reason for the error.
             *
             * @var {string} reason
             */
            let reason: string = chars.empty

            reason += String(conflicting)
            reason += chars.space + 'cannot be used with'
            reason += chars.space + String(option)

            this.error({
              cause: { conflict: conflicting.flags, option: option.flags },
              id: keid.conflicting_option,
              reason
            })
          }
        }
      }
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
      for (const option of cmd.uniqueOptions()) {
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
    /* v8 ignore else -- @preserve */
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
   * Get a subcommands map.
   *
   * Each key is a subcommand name or alias and each value is a command.
   *
   * @public
   * @instance
   *
   * @return {Map<string, Command>}
   *  The subcommands map
   */
  public commands(): Map<string, Command>

  /**
   * Batch define subcommands for the command or get a subcommands map.
   *
   * Each key is a subcommand name or alias and each value is a command.
   *
   * @see {@linkcode SubcommandsInfo}
   *
   * @public
   * @instance
   *
   * @param {SubcommandsInfo} [infos]
   *  Subcommands info
   * @return {Map<string, Command> | this}
   *  The subcommands map or `this` command
   */
  public commands(infos?: SubcommandsInfo): Map<string, Command> | this {
    if (!infos) return this.info.subcommands

    for (const [name, info] of Object.entries(infos)) {
      info.name ||= name
      this.command(info as SubcommandInfo)
    }

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
    this.process = parent.process

    this.help(this.info.help ?? parent.info.help)
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
   *
   * @public
   * @instance
   *
   * @param {Flags | OptionInfo} info
   *  Option info or flags
   * @param {OptionData | null | undefined} [data]
   *  Additional option info
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
   * Emit a parsed `command` event.
   *
   * @public
   * @instance
   *
   * @template {Command} T
   *  The command instance
   *
   * @param {T} command
   *  The command instance representing the parsed command
   * @return {boolean}
   *  `true` if event has listeners, `false` otherwise
   */
  public emitCommand<T extends Command>(command: T): boolean {
    return this.emit(new CommandEvent(command))
  }

  /**
   * Emit environment-based options.
   *
   * > 👉 **Note**: Environment variables are applied if an option value is
   * > `undefined` or originally comes from an environment variable or default
   * > value configuration.
   *
   * @protected
   * @instance
   *
   * @return {this}
   *  `this` command
   */
  protected emitEnvironmentOptions(): this {
    for (const cmd of [...this.ancestors().reverse(), this]) {
      for (const option of cmd.uniqueOptions()) {
        for (const env of option.env()) {
          if (env && env in cmd.process.env) {
            /**
             * The source of the option value.
             *
             * @var {OptionValueSource | undefined} source
             */
            let source: OptionValueSource | undefined

            // get option value source.
            source = cmd.optionValueSource(option.key)

            /* v8 ignore else -- @preserve */
            if (
              cmd.optionValue(option.key) === undefined ||
              source === optionValueSource.default ||
              source === optionValueSource.env
            ) {
              /**
               * The environment variable value.
               *
               * @const {string} value
               */
              const value: string = cmd.process.env[env]!

              // emit option event.
              // the option event handler will call the option-argument parser,
              // as well as store the option value and source.
              cmd.emitOption(option, value, optionValueSource.env)
            }

            break
          }
        }
      }
    }

    return this
  }

  /**
   * Emit implied options.
   *
   * > 👉 **Note**: Local options can imply global options and other
   * > local options, but global options cannot imply local options.
   *
   * @protected
   * @instance
   *
   * @return {this}
   *  `this` command
   */
  protected emitImpliedOptions(): this {
    for (const command of [this, ...this.ancestors()]) {
      /**
       * The list of commands.
       *
       * @const {Command[]} commands
       */
      const commands: Command[] = [command, ...command.ancestors()]

      /**
       * The list of options.
       *
       * @const {Option[]} options
       */
      const options: Option[] = commands.flatMap(cmd => {
        return [...cmd.uniqueOptions()]
      })

      /**
       * The list of custom user options.
       *
       * > 👉 **Note**: User options are defined, non-default options.
       * > Custom user options are user options that are not implied.
       *
       * @const {Set<Option>} user
       */
      const user: Set<Option> = new Set(commands.flatMap(cmd => {
        return cmd.userOptions(optionValueSource.implied)
      }))

      // for each custom user option, check if it has implied values.
      // for each option with implied values, match the implied option key
      // to the option instance and emit the implied options.
      for (const option of command.userOptions(optionValueSource.implied)) {
        /**
         * The implied values.
         *
         * @const {OptionValues} implies
         */
        const implies: OptionValues = option.implies()

        // for each implied option key-value pair,
        // find the implied option and then emit the option
        // if it was not specified by the user.
        for (const [key, value] of Object.entries(implies)) {
          /**
           * The implied option.
           *
           * @const {Option | undefined} implied
           */
          const implied: Option | undefined = options.find(opt => {
            return this.matchOption(opt, key)
          })

          // implied option was not found.
          if (!implied) continue

          // emit implied option if it is not a custom user option.
          if (!user.has(implied)) {
            ok(implied.parent, 'expected parent command for implied option')

            implied.parent.emitOption(
              implied,
              value,
              optionValueSource.implied,
              null
            )
          }
        }
      }
    }

    return this
  }

  /**
   * Emit a parsed `option` event.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @template {Option} T
   *  The option instance
   *
   * @param {T} option
   *  The option instance representing the parsed option
   * @param {unknown} value
   *  The raw `option` value
   * @param {OptionValueSource} source
   *  The source of the raw option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   * @return {boolean}
   *  `true` if event has listeners, `false` otherwise
   */
  public emitOption<T extends Option>(
    option: T,
    value: RawOptionValue,
    source: OptionValueSource,
    flag?: Flags | null | undefined
  ): boolean

  /**
   * Emit a parsed `option` event.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode optionValueSource}
   *
   * @public
   * @instance
   *
   * @template {Option} T
   *  The option instance
   *
   * @param {T} option
   *  The option instance representing the parsed option
   * @param {unknown} value
   *  The `option` value
   * @param {optionValueSource.implied} source
   *  The source of the option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   * @return {boolean}
   *  `true` if event has listeners, `false` otherwise
   */
  public emitOption<T extends Option>(
    option: T,
    value: unknown,
    source: optionValueSource.implied,
    flag?: Flags | null | undefined
  ): boolean

  /**
   * Emit a parsed `option` event.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode Option}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option} option
   *  The option instance representing the parsed option
   * @param {unknown} value
   *  The raw or implied `option` value
   * @param {OptionValueSource} source
   *  The source of the option `value`
   * @param {Flags | null | undefined} [flag]
   *  The parsed `option` flag
   * @return {boolean}
   *  `true` if event has listeners, `false` otherwise
   */
  public emitOption(
    option: Option,
    value: unknown,
    source: OptionValueSource,
    flag?: Flags | null | undefined
  ): boolean {
    return this.emit(new OptionEvent(option, value as never, source, flag))
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

    /* v8 ignore else -- @preserve */ if (!isKronkError(info)) {
      error = new CommandError({ ...info, command: this })
    }

    this.exit(error)
  }

  /**
   * Add an example for the command.
   *
   * > 👉 **Note**: This method can be called more than once
   * > to add multiple examples.
   *
   * @see {@linkcode ExampleInfo}
   *
   * @public
   * @instance
   *
   * @param {ExampleInfo | ReadonlyArray<string> | string} info
   *  The example info or text
   * @return {this}
   *  `this` command
   */
  public example(info: ExampleInfo | readonly string[] | string): this {
    if (Array.isArray(info)) info = { text: info.join(chars.space) }
    if (typeof info === 'string') info = { text: info }
    ok(Array.isArray(this.info.examples), 'expected `info.examples`')
    return this.info.examples.push(info), this
  }

  /**
   * Add examples for the command.
   *
   * @see {@linkcode ExamplesData}
   *
   * @public
   * @instance
   *
   * @param {ExamplesData | null | undefined} examples
   *  The example info, example text, or a list of such
   * @return {this}
   *  `this` command
   */
  public examples(examples: ExamplesData | null | undefined): this

  /**
   * Get a list of command examples.
   *
   * @see {@linkcode ExampleInfo}
   *
   * @public
   * @instance
   *
   * @return {ExampleInfo[]}
   *  List of examples
   */
  public examples(): ExampleInfo[]

  /**
   * Get or add examples for the command.
   *
   * @see {@linkcode ExamplesData}
   *
   * @public
   * @instance
   *
   * @param {ExamplesData | null | undefined} [examples]
   *  The example info, example text, or a list of such
   * @return {ExampleInfo[] | this}
   *  List of examples or `this` command
   */
  public examples(
    examples?: ExamplesData | null | undefined
  ): ExampleInfo[] | this {
    if (!arguments.length) return this.info.examples
    for (const example of toList(examples)) this.example(example)
    return this
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
   * @param {CommandName | undefined} ref
   *  A command name or alias
   * @return {Command | this | undefined}
   *  Command with a name or alias matching `ref`
   */
  public findCommand(ref: CommandName | undefined): Command | this | undefined {
    /**
     * The referenced command.
     *
     * @var {Command | undefined} command
     */
    let command: Command | undefined = undefined

    if (typeof ref === 'string') {
      if (this.id() === ref || this.aliases().has(ref)) {
        command = this // current command was referenced.
      } else if (this.info.subcommands.has(ref)) {
        // subcommand was referenced by name or alias.
        command = this.info.subcommands.get(ref)
      } else {
        for (const subcommand of new Set(this.commands().values())) {
          command = subcommand.findCommand(ref)

          // subcommand of subcommand was referenced.
          /* v8 ignore next -- @preserve */ if (command) break
        }
      }
    }

    return command
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
   * Configure the help text.
   *
   * @see {@linkcode Help}
   * @see {@linkcode HelpTextOptions}
   *
   * @public
   * @instance
   *
   * @param {Help | HelpTextOptions | null | undefined} help
   *  The help text utility or options for formatting help text
   * @return {this}
   *  `this` command
   */
  public help(help: Help | HelpTextOptions | null | undefined): this

  /**
   * Print the help text.
   *
   * @public
   * @instance
   *
   * @param {'1' | 1 | true} help
   *  Whether to print help text
   * @return {undefined}
   */
  public help(help: '1' | 1 | true): undefined

  /**
   * Get the help text utility.
   *
   * @see {@linkcode Help}
   *
   * @template {Help} T
   *  Help text utility instance
   *
   * @public
   * @instance
   *
   * @return {Help}
   *  The help text utility
   */
  public help<T extends Help>(): T

  /**
   * Get the help text utility, configure the help text, or print the help text.
   *
   * @see {@linkcode Help}
   * @see {@linkcode HelpTextOptions}
   *
   * @public
   * @instance
   *
   * @param {Help | HelpTextOptions | '1' | 1 | true | null | undefined} [help]
   *  The help text utility, options for formatting help text,
   *  or a truthy value to print the help text
   * @return {Help | this | undefined}
   *  Help text utility, `this` command, or nothing
   */
  public help(
    help?: Help | HelpTextOptions | '1' | 1 | true | true | null | undefined
  ): Help | this | undefined {
    if (!arguments.length) return this.info.help ?? new Help()

    if (help) {
      if (typeof help !== 'object') {
        help = this.info.help ?? new Help()
        return void this.process.stdout.write(help.text(this))
      } else if ('prepare' in help && 'text' in help) {
        this.info.help = help
      } else if (
        this.info.help &&
        'prepare' in this.info.help &&
        'text' in this.info.help
      ) {
        this.info.help.prepare(help)
      } else {
        this.info.help = new Help(help)
      }
    }

    return this
  }

  /**
   * Configure the help subcommand.
   *
   * > 👉 **Note**: No cleanup is performed when this method is called
   * > with a different name (i.e. `help` as a string or `help.name`).
   *
   * @see {@linkcode HelpCommandData}
   *
   * @public
   * @instance
   *
   * @param {HelpCommandData | null | undefined} help
   *  Subcommand instance, subcommand info, `false` to disable the help
   *  subcommand, or any other allowed value to use the default configuration
   * @return {this}
   *  `this` command
   */
  public helpCommand(help: HelpCommandData | null | undefined): this

  /**
   * Get the help subcommand.
   *
   * @see {@linkcode Command}
   *
   * @template {Command} T
   *  The help subcommand instance
   *
   * @public
   * @instance
   *
   * @return {Command | null}
   *  Help subcommand
   */
  public helpCommand<T extends Command>(): T | null

  /**
   * Get or configure the help subcommand.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpCommandData}
   *
   * @public
   * @instance
   *
   * @param {HelpCommandData | null | undefined} [help]
   *  Subcommand instance, subcommand info, `false` to disable the help
   *  subcommand, or any other allowed value to use the default configuration
   * @return {Command | null | this}
   *  Help subcommand or `this` command
   */
  public helpCommand(
    help?: HelpCommandData | null | undefined
  ): Command | null | this {
    if (arguments.length) {
      if (help === false) {
        this.info.helpCommand = null
      } else {
        if (typeof help === 'string') help = { name: help }
        if (!help || typeof help !== 'object') help = {}

        // define help subcommand.
        if (isCommand(help)) {
          this.info.helpCommand = help
        } else {
          // prevent `RangeError: Maximum call stack size exceeded`
          // by disabling help subcommand for current help subcommand.
          help.helpCommand = false
          help.helpOption = false

          this.info.helpCommand = this.createCommand({
            ...help,
            description: help.description || 'show help',
            name: help.name || 'help'
          })
        }

        // add help subcommand.
        this.addCommand(this.info.helpCommand)

        // register event listeners.
        this.on(this.info.helpCommand.event, this.onHelp.bind(this))
      }

      return this
    }

    return fallback(this.info.helpCommand, null, isNIL)
  }

  /**
   * Configure the help option.
   *
   * > 👉 **Note**: No cleanup is performed when this method is called
   * > with different flags (i.e. `help` as a string or `help.flags`).
   *
   * @see {@linkcode HelpOptionData}
   *
   * @public
   * @instance
   *
   * @param {HelpOptionData | null | undefined} help
   *  Option flags, option info, option instance, `false` to disable the help
   *  option, or any other allowed value to use the default configuration
   * @return {this}
   *  `this` command
   */
  public helpOption(help: HelpOptionData | null | undefined): this

  /**
   * Get the help option.
   *
   * @see {@linkcode Option}
   *
   * @template {Option} T
   *  The help option instance
   *
   * @public
   * @instance
   *
   * @return {Option | null}
   *  Help option
   */
  public helpOption<T extends Option>(): T | null

  /**
   * Get or configure the help option.
   *
   * @see {@linkcode HelpOptionData}
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @param {HelpOptionData | null | undefined} [help]
   *  Option flags, option info, option instance, `false` to disable the help
   *  option, or any other allowed value to use the default configuration
   * @return {Option | null | this}
   *  Help option or `this` command
   */
  public helpOption(
    help?: HelpOptionData | null | undefined
  ): Option | null | this {
    if (arguments.length) {
      if (help === false) {
        this.info.helpOption = null
      } else {
        if (typeof help === 'string') help = { flags: help }
        if (!help || typeof help !== 'object') help = {}

        // set help option.
        if (isOption(help)) {
          this.info.helpOption = help
        } else {
          help.description ||= 'show help'

          if ('flags' in help) {
            this.info.helpOption = this.createOption(help)
          } else {
            help = { ...help, flags: '-h, --help' }
            this.info.helpOption = this.createOption(help)
          }
        }

        // add help option and register help event listener.
        this.addOption(this.info.helpOption)
        this.on(this.info.helpOption.event, this.onHelp.bind(this))
      }

      return this
    }

    return fallback(this.info.helpOption, null, isNIL)
  }

  /**
   * Add or remove callbacks for a `hook`.
   *
   * @see {@linkcode HooksData}
   * @see {@linkcode KronkHookName}
   *
   * @public
   * @instance
   *
   * @template {KronkHookName} H
   *  The hook name
   *
   * @param {H} hook
   *  The hook name
   * @param {HooksData[H] | false} fn
   *  The callback or callbacks to add,
   *  with falsy values used to remove all callbacks
   * @return {this}
   *  `this` command
   */
  public hook<H extends KronkHookName>(hook: H, fn: HooksData[H] | false): this

  /**
   * Get a list of callbacks for `hook`.
   *
   * @see {@linkcode HooksInfo}
   * @see {@linkcode KronkHookName}
   *
   * @public
   * @instance
   *
   * @template {KronkHookName} H
   *  The hook name
   *
   * @param {H} hook
   *  The hook name
   * @return {HooksInfo[H]}
   *  The list of hook callbacks
   */
  public hook<H extends KronkHookName>(hook: H): HooksInfo[H]

  /**
   * Manage a `hook` or get a list of callbacks for the hook.
   *
   * @see {@linkcode HooksData}
   * @see {@linkcode KronkHook}
   * @see {@linkcode KronkHookName}
   *
   * @public
   * @instance
   *
   * @param {KronkHookName} hook
   *  The hook name
   * @param {HooksData[KronkHookName] | false | null | undefined} [fn]
   *  The callback or callbacks to add,
   *  with falsy values used to remove all callbacks
   * @return {KronkHook[] | this}
   *  The list of hook callbacks or `this` command
   */
  public hook(
    hook: KronkHookName,
    fn?: HooksData[KronkHookName] | false | null | undefined
  ): KronkHook[] | this {
    ;(this.info.hooks[hook] as KronkHook[] | null) ??= []

    /**
     * The list of hook callbacks.
     *
     * @const {KronkHook[]}
     */
    const hooks: KronkHook[] = this.info.hooks[hook]

    if (arguments.length === 1) return hooks
    if (fn) return hooks.push(...toList(fn)), this
    return this.info.hooks[hook] = [], this
  }

  /**
   * Add or remove hooks.
   *
   * @see {@linkcode HooksData}
   *
   * @public
   * @instance
   *
   * @param {HooksData | false | null | undefined} hooks
   *  The hooks configuration, with falsy values used to remove hooks
   * @return {this}
   *  `this` command
   */
  public hooks(hooks: HooksData | false | null | undefined): this

  /**
   * Get a record of registered hooks.
   *
   * @see {@linkcode HooksInfo}
   *
   * @public
   * @instance
   *
   * @return {HooksInfo}
   *  The hooks record
   */
  public hooks(): HooksInfo

  /**
   * Manage hooks or get the hooks record.
   *
   * @see {@linkcode HooksData}
   * @see {@linkcode HooksInfo}
   *
   * @public
   * @instance
   *
   * @param {HooksData | false | null | undefined} [hooks]
   *  The hooks configuration
   * @return {HooksInfo | this}
   *  The hooks record or `this` command
   */
  public hooks(hooks?: HooksData | false | null | undefined): HooksInfo | this {
    if (arguments.length) {
      if (hooks) {
        for (const [hook, fn] of entries(hooks)) this.hook(hook, fn)
      } else {
        for (const hook of keys(this.info.hooks)) this.hook(hook, false)
      }

      return this
    }

    return this.info.hooks
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
   * @see {@linkcode CommandName}
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
   * Check if the given option `reference` is a match for `option`.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option instance
   * @param {string} reference
   *  The option reference
   * @return {boolean}
   *  `true` if `reference` is a match for `option`, `false` otherwise
   */
  protected matchOption(option: Option, reference: string): boolean {
    return reference = reference.trim(), !!reference && [
      option.id,
      option.key,
      option.long,
      option.long?.replace(/^--/, chars.empty),
      option.short,
      option.short?.replace(/^--?/, chars.empty)
    ].includes(reference)
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
    return void this.events.on(event, listener as ListenerFn, options)
  }

  /**
   * Handle a command `event`.
   *
   * @see {@linkcode CommandEvent}
   *
   * @protected
   * @instance
   *
   * @template {Command} T
   *  The command
   *
   * @param {CommandEvent<T>} event
   *  The emitted command event
   * @return {undefined}
   */
  protected onCommand<T extends Command>(event: CommandEvent<T>): undefined {
    return void event
  }

  /**
   * Handle a help `event`.
   *
   * @see {@linkcode CommandEvent}
   * @see {@linkcode OptionEvent}
   *
   * @protected
   * @instance
   *
   * @param {CommandEvent | OptionEvent} event
   *  The emitted event
   * @return {undefined}
   */
  protected onHelp(event: CommandEvent | OptionEvent): undefined {
    for (const cmd of [this, ...this.ancestors()]) {
      cmd.interrupter = event // capture the interrupting event.
      cmd.helpRequested = true // propagate help request to all commands.
    }

    // configure help command (`event.command`) to print the help text
    // for `this` command rather than the help text for itself.
    if (isCommandEvent(event) && event.command.info.action === noop) {
      event.command.action(this.action())
    }

    return void event
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
   *  The parsed option instance
   *
   * @param {OptionEvent<T>} event
   *  The emitted parsed option event
   * @return {undefined}
   */
  protected onOption<T extends Option>(event: OptionEvent<T>): undefined {
    if (event.option === this.versionOption()) event.value = this.version()

    if (event.option === this.helpOption()) {
      this.optionValue(event.option.key, true, event.source)
    } else if (typeof event.value !== 'string') {
      this.optionValue(event.option.key, event.value, event.source)
    } else {
      // check option-argument value against option choices.
      this.checkChoices(event.value, event.option)

      /**
       * The option-argument parser.
       *
       * The default parser is an identity function that returns the raw
       * option-argument value.
       *
       * @const {ParseArg<any, string>}
       */
      const parser: ParseArg = event.option.parser()

      /**
       * The previous option value.
       *
       * @var {unknown} previous
       */
      let previous: unknown

      /**
       * The source of the option value.
       *
       * @var {OptionValueSource | undefined} src
       */
      let src: OptionValueSource | undefined

      // get the source of the option value.
      // this is used to determine if a variadic option has already been seen.
      src = this.optionValueSource(event.option.key)

      // get the previous option value.
      // for non-variadic options and unseen variadic options,
      // the default option value previous value.
      // the previous value is otherwise the previous parse result.
      if (!event.option.variadic || src && src !== optionValueSource.default) {
        previous = event.option.default()?.value
      } else {
        ok(event.option.variadic, 'expected `event.option` to be variadic')
        previous = this.optionValue(event.option.key)
      }

      // store parsed option value and source of raw option value.
      this.optionValue(event.option.key, parser(event.value, previous))
      this.optionValueSource(event.option.key, event.source)
    }

    return void this
  }

  /**
   * Handle a version `event`.
   *
   * @see {@linkcode CommandEvent}
   * @see {@linkcode OptionEvent}
   *
   * @protected
   * @instance
   *
   * @param {CommandEvent | OptionEvent} event
   *  The emitted event
   * @return {undefined}
   */
  protected onVersion(event: CommandEvent | OptionEvent): undefined {
    for (const cmd of [this, ...this.ancestors()]) {
      cmd.interrupter = event // capture the interrupting event.
      cmd.versionRequested = true // propagate version request to all commands.
    }

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
   * Set the strategy to use when merging global and local options.
   *
   * @see {@linkcode OptionPriority}
   *
   * @public
   * @instance
   *
   * @param {OptionPriority | null | undefined} [priority='local']
   *  The strategy to use when merging options
   * @return {this}
   *  `this` command
   */
  public optionPriority(priority: OptionPriority | null | undefined): this

  /**
   * Get the strategy to use when merging global and local options.
   *
   * @see {@linkcode OptionPriority}
   *
   * @public
   * @instance
   *
   * @return {OptionPriority}
   *  Option merge strategy
   */
  public optionPriority(): OptionPriority

  /**
   * Get or set the strategy to use when merging global and local options.
   *
   * @see {@linkcode OptionPriority}
   *
   * @public
   * @instance
   *
   * @param {OptionPriority | null | undefined} [priority]
   *  The strategy to use when merging options
   * @return {OptionPriority | this}
   *  Option merge strategy or `this` command
   */
  public optionPriority(
    priority?: OptionPriority | null | undefined
  ): OptionPriority | this {
    if (!arguments.length) {
      const { optionPriority } = this.info

      ok(optionPriority !== null, 'expected `info.optionPriority !== null`')
      ok(optionPriority !== undefined, 'expected `info.optionPriority`')

      return optionPriority
    }

    return this.info.optionPriority = priority ?? 'local', this
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
   *  The option key
   * @param {unknown} value
   *  The parsed option value
   * @param {OptionValueSource | null | undefined} [source]
   *  The source of the option value
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
   *  The parsed option value
   *
   * @param {Option['key']} key
   *  The option key
   * @return {T}
   *  The parsed option value
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
   * @template {any} T
   *  The parsed option value
   *
   * @param {Option['key']} key
   *  The option key
   * @param {unknown} [value]
   *  The parsed option value
   * @param {OptionValueSource | null | undefined} [source]
   *  The source of the option value
   * @return {T | this}
   *  The stored option value or `this` command
   */
  public optionValue<T>(
    key: Option['key'],
    value?: unknown,
    source?: OptionValueSource | null | undefined
  ): T | this {
    if (arguments.length === 1) return this.optionValues[key] as T
    if (source) this.optionValueSource(key, source)
    return this.optionValues[key] = value, this
  }

  /**
   * Set an option value source.
   *
   * @see {@linkcode Option.key}
   * @see {@linkcode OptionValueSource}
   *
   * @public
   * @instance
   *
   * @param {Option['key']} key
   *  The option key
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
   *  The option key
   * @return {OptionValueSource | undefined}
   *  The option value source
   */
  public optionValueSource(key: Option['key']): OptionValueSource | undefined

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
   *  The option key
   * @param {OptionValueSource | null | undefined} [source]
   *  The source of the option value
   * @return {OptionValueSource | this | undefined}
   *  The option value source or `this` command
   */
  public optionValueSource(
    key: Option['key'],
    source?: OptionValueSource | null | undefined
  ): OptionValueSource | this | undefined {
    if (arguments.length === 1) return this.optionValueSources[key]
    if (!source) delete this.optionValueSources[key]
    else this.optionValueSources[key] = source
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
   * Get an options map.
   *
   * Each key is a long or short flag and each value is an option.
   *
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @return {Map<string, Option>}
   *  The options map
   */
  public options(): Map<string, Option>

  /**
   * Batch define options for the command or get an options map.
   *
   * Each key is a long or short flag and each value is an option.
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
   * @return {Map<string, Option> | this}
   *  The options map or `this` command
   */
  public options(infos?: List<Flags | OptionInfo>): Map<string, Option> | this {
    if (!infos) return this.info.options
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

    /* v8 ignore else -- @preserve */
    if (this.optionPriority() !== 'global') merger = reduceRight

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
   * > 👉 **Note**: If any parsers or {@linkcode action} handlers are async,
   * > the parse needs to be awaited.
   *
   * @see {@linkcode Awaitable}
   * @see {@linkcode List}
   * @see {@linkcode ParseOptions}
   *
   * @public
   * @instance
   *
   * @template {Awaitable<Command | this>} T
   *  The running command
   *
   * @param {List<string> | null | undefined} [argv]
   *  The command-line arguments
   * @param {ParseOptions | null | undefined} [options]
   *  Options for parsing `argv`
   * @return {T}
   *  The running command
   */
  public parse<T extends Awaitable<Command | this>>(
    argv?: List<string> | null | undefined,
    options?: ParseOptions | null | undefined
  ): T {
    /**
     * The prepared user arguments.
     *
     * @const {string[]} unknown
     */
    const unknown: string[] = this.prepareUserArgs(argv, options)

    /**
     * The command to run.
     *
     * @var {T} command
     */
    let command: T = this.prepareCommand([], unknown)

    // capture resolved command.
    if (isPromise(command)) {
      void command.then(resolved => (command = resolved as T))
    }

    // chain prepared command result, then run hooks and command action.
    return this.chainOrCall(command, () => {
      ok(isCommand(command), 'expected `Command` instance')

      /**
       * The result of the promise chain.
       *
       * @var {Awaitable} result
       */
      let result: Awaitable

      // call preaction hooks.
      result = command.chainOrCallHook(hooks.preAction, command)

      // chain hook result, then run action callback and postaction hooks.
      return command.chainOrCall(result, () => {
        ok(isCommand(command), 'expected `Command` instance')

        // run action callback.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        result = command.action().call(command, command.opts(), ...command.args)

        // chain action callback result, then call postaction hooks.
        return command.chainOrCall(result, () => {
          ok(isCommand(command), 'expected `Command` instance')

          // call postaction hooks.
          result = command.chainOrCallHook(hooks.postAction, command)

          // chain hook result and return running command.
          return command.chainOrCall(result, constant(command))
        })
      })
    }) as T
  }

  /**
   * Process command arguments and store parsed arguments.
   *
   * @see {@linkcode Awaitable}
   *
   * @protected
   * @instance
   *
   * @return {Awaitable<this>}
   *  `this` command
   */
  protected parseCommandArguments(): Awaitable<this> {
    for (const [index, argument] of this.arguments().entries()) {
      /**
       * The default value.
       *
       * @const {unknown} dvalue
       */
      const dvalue: unknown = this.argumentValue(index)

      /**
       * The argument parser.
       *
       * @const {ParseArg} parser
       */
      const parser: ParseArg = argument.parser()

      /**
       * The parsed argument value.
       *
       * @var {unknown} value
       */
      let value: unknown

      if (argument.variadic) {
        if (index < this.argv.length) {
          // value, or values, supplied by user for variadic argument.

          /**
           * The previous argument value.
           *
           * @var {unknown} previous
           */
          let previous: unknown = dvalue

          for (const val of this.argv.slice(index)) {
            // check raw argument value against allowed argument choices.
            this.checkChoices(val, argument)

            // parse raw argument value.
            value = parser(val, previous)

            // reset previous value to new parse result.
            previous = value
          }

          // store final parse result.
          this.argumentValue(index, value, argumentValueSource.cli)
          break
        }
      } else if (index < this.argv.length) {
        // value supplied by user for optional or required argument.

        // check value against allowed argument choices.
        this.checkChoices(value = this.argv[index]!, argument)

        // parse raw argument value.
        ok(typeof value === 'string', 'expected command-argument `value`')
        value = parser(value, dvalue)

        // store parse result.
        this.argumentValue(index, value, argumentValueSource.cli)
      } else {
        // value not supplied by user for optional argument, use default value.
        ok(!argument.required, 'expected optional argument')
      }
    }

    /**
     * The result of the promise chain.
     *
     * @var {Awaitable<this>} result
     */
    let result: Awaitable<this> = this

    // resolve parsed arguments.
    for (const [i, arg] of this.args.entries()) {
      if (isPromise(arg)) {
        result = this.chainOrCall(arg.then(resolved => {
          return this.argumentValue(i, resolved, this.argumentValueSource(i))
        }), this.self)
      }
    }

    return result
  }

  /**
   * Parse `unknown` arguments.
   *
   * @see {@linkcode ParseUnknownResult}
   *
   * @protected
   * @instance
   *
   * @param {string[]} unknown
   *  List of unknown arguments
   * @return {ParseUnknownResult}
   *  Parse result
   */
  protected parseUnknownArguments(unknown: string[]): ParseUnknownResult {
    /**
     * List of parse events.
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
        return context[kCommand] = true, context.command = this, void context
      },
      initial: initialCommand,
      moveOnBreak: true
    })

    /**
     * Parse result.
     *
     * @const {ParseUnknownResult} result
     */
    const result: ParseUnknownResult = { operands: [], unknown: [] }

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

    // resolve parse events.
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
        /* v8 ignore else -- @preserve */
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

        // the token value is either a command-argument, subcommand id,
        // or a raw argument for an option unknown to `this` command.
        if (token.command) {
          // `token.value` is the name of a subcommand.
          // remaining arguments are classified as unknown.

          dest.push(token.value)
          dest = result.unknown
          this.emitCommand(token.command)
        } else {
          dest.push(token.value) // operand is a command or option-argument.
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
            /* v8 ignore else -- @preserve */
            if (operand.attached || !this.info.arguments.length) {
              this.error({
                cause: { argument: operand.value },
                id: keid.excess_arguments,
                reason: `${String(token.option)} does not allow an argument`
              })

              // @ts-expect-error [7027] the `splice` call removes the
              // erroneous tokens and acts a cleanup function when the
              // call to `error` does not exit the process.
              events.splice(afterIndex, 2)
            }
          } else { // use option-argument passed by user.
            ok(operand.value !== undefined, 'expected operand token value')
            events.splice(afterIndex, 2)
            value = operand.value
          }
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

    return result
  }

  /**
   * Process command-line arguments in the context of `this` command.
   *
   * > 👉 **Note**: Modifies `this` command by storing options. Does not reset
   * > state if called again.
   *
   * @see {@linkcode Awaitable}
   *
   * @protected
   * @instance
   *
   * @template {Awaitable<Command | this>} T
   *  The command to run
   *
   * @param {string[]} operands
   *  List of operands (not options or values)
   * @param {string[]} unknown
   *  List of unknown arguments
   * @return {T}
   *  The command to run
   */
  protected prepareCommand<T extends Awaitable<Command | this>>(
    operands: string[],
    unknown: string[]
  ): T {
    /**
     * Parse result.
     *
     * @const {ParseUnknownResult} result
     */
    const result: ParseUnknownResult = this.parseUnknownArguments(unknown)

    // apply implied options and environment options.
    void this.emitImpliedOptions()
    void this.emitEnvironmentOptions()

    // collect raw command-line arguments.
    operands = [...operands, ...result.operands]
    unknown = result.unknown
    this.argv = [...operands, ...unknown]

    /**
     * The subcommand to prepare.
     *
     * @const {Command | undefined} subcommand
     */
    const subcommand: Command | undefined = this.findCommand(operands[0])

    // prepare subcommand.
    if (subcommand) {
      return this.chainOrCall(
        this.chainOrCallHook(hooks.preCommand, subcommand),
        /**
         * @this {void}
         *
         * @return {T}
         *  The command to run
         */
        function prepareSubcommand(this: void): T {
          return subcommand.prepareCommand<T>(operands.slice(1), unknown)
        }
      ) as T
    }

    // prepare default command,
    // then check for errors and parse command arguments.
    if (!this.interrupter) {
      if (this.defaultCommand) {
        return this.chainOrCall(
          this.chainOrCallHook(hooks.preCommand, this.defaultCommand),
          prepareDefaultCommand,
          this
        ) as T

        /**
         * @this {Command}
         *
         * @return {T}
         *  The command to run
         */
        function prepareDefaultCommand(this: Command): T {
          return this.defaultCommand!.prepareCommand<T>(operands, unknown)
        }
      }

      this.checkForMissingMandatoryOptions()
      this.checkDependentOptions()
      this.checkForConflictingOptions()
      this.checkForUnknownOptions(unknown)
      this.checkCommandArguments()

      return this.chainOrCall(this.parseCommandArguments(), (): T => {
        /**
         * The result of the promise chain.
         *
         * @var {Awaitable<this>} result
         */
        let result: Awaitable<this> = this

        // resolve parsed option values.
        for (const cmd of [this, ...this.ancestors()]) {
          for (const [key, source] of Object.entries(cmd.optionValueSources)) {
            /**
             * The parsed option value.
             *
             * @const {unknown} value
             */
            const value: unknown = cmd.optionValue(key)

            if (isPromise(value)) {
              result = this.chainOrCall(value.then(resolved => {
                return cmd.optionValue(key, resolved, source)
              }), this.self)
            }
          }
        }

        return result as T
      }) as T
    }

    return this as T
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
   * Print the help text.
   *
   * @see {@linkcode Awaitable}
   *
   * @protected
   * @instance
   *
   * @template {OptionValues} [Opts=OptionValues]
   *  Parsed command options
   * @template {any[]} [Args=any[]]
   *  Parsed command arguments
   *
   * @param {Opts} opts
   *  The parsed command options
   * @param {Args} args
   *  The parsed command arguments
   * @return {Awaitable<undefined>}
   *  Nothing
   */
  protected printHelp<
    Opts extends OptionValues = OptionValues,
    Args extends any[] = any[]
  >(opts: Opts, ...args: Args): Awaitable<undefined> {
    return void opts, void args, void this.help(true)
  }

  /**
   * Print the command version.
   *
   * @see {@linkcode Awaitable}
   *
   * @protected
   * @instance
   *
   * @template {OptionValues} [Opts=OptionValues]
   *  Parsed command options
   * @template {any[]} [Args=any[]]
   *  Parsed command arguments
   *
   * @param {Opts} opts
   *  The parsed command options
   * @param {Args} args
   *  The parsed command arguments
   * @return {Awaitable<undefined>}
   *  Nothing
   */
  protected printVersion<
    Opts extends OptionValues = OptionValues,
    Args extends any[] = any[]
  >(opts: Opts, ...args: Args): Awaitable<undefined> {
    return void opts, void args, void this.version(true)
  }

  /**
   * Restore the state of the command and its ancestors.
   *
   * Resets parsed values, and calls any `restore` functions defined
   * on argument and option parsers.
   * Arguments, options, and subcommands will **not** be reset.
   *
   * A promise is returned if any `restore` functions are async.
   *
   * @see {@linkcode Awaitable}
   *
   * @public
   * @instance
   *
   * @template {Awaitable<this>} T
   *  The current command
   *
   * @return {T}
   *  `this` command
   */
  public restore<T extends Awaitable<this>>(): T {
    /**
     * The result of the promise chain.
     *
     * @var {Awaitable<this>} result
     */
    let result: Awaitable<this> = this

    // restore state.
    for (const cmd of [this, ...this.ancestors()]) {
      cmd.argv = []
      cmd.helpRequested = false
      cmd.interrupter = null
      cmd.versionRequested = false

      /**
       * The current parser.
       *
       * @var {ParseArg} parser
       */
      let parser: ParseArg

      // restore argument parser states and reset non-default values.
      for (const [index, argument] of cmd.arguments().entries()) {
        if (typeof (parser = argument.parser()).restore === 'function') {
          result = this.chainOrCall(parser.restore(), this.self) // restore.
        }

        if (cmd.argumentValueSource(index) !== argumentValueSource.default) {
          delete cmd.args[index] // reset non-default value.
          this.argumentValueSource(index, null) // reset value source.
        }
      }

      // restore option parser states and reset non-default values.
      for (const option of cmd.uniqueOptions()) {
        // restore parser state.
        if (typeof (parser = option.parser()).restore === 'function') {
          result = this.chainOrCall(parser.restore(), this.self) // restore.
        }

        // reset non-default option values.
        if (cmd.optionValueSource(option.key) !== optionValueSource.default) {
          delete cmd.optionValues[option.key] // reset non-default value.
          cmd.optionValueSource(option.key, null) // reset value source.
        }
      }
    }

    return result as T
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
      argumentValueSources: [...this.argumentValueSources],
      argv: [...this.argv],
      optionValueSources: { ...this.optionValueSources },
      opts: this.opts(),
      optsWithGlobals: this.optsWithGlobals(),
      usage: this.usage()
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
   * @override
   *
   * @return {string}
   *  String representation of `this` command
   */
  public override toString(): string {
    return `Command(${this.id() ?? chars.empty})`
  }

  /**
   * Get a list of unique subcommands.
   *
   * @public
   * @instance
   *
   * @template {Command} T
   *  The command instance
   *
   * @return {Set<T>}
   *  The list of subcommands
   */
  public uniqueCommands<T extends Command>(): Set<T> {
    return new Set(this.commands().values()) as Set<T>
  }

  /**
   * Get a list of unique options.
   *
   * @see {@linkcode Option}
   *
   * @public
   * @instance
   *
   * @template {Option} T
   *  The option instance
   *
   * @return {Set<T>}
   *  The list of options
   */
  public uniqueOptions<T extends Option>(): Set<T> {
    return new Set(this.options().values()) as Set<T>
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
   * Set the usage description.
   *
   * @see {@linkcode UsageData}
   *
   * @public
   * @instance
   *
   * @param {UsageData | null | undefined} usage
   *  Usage data
   * @return {this}
   *  `this` command
   */
  public usage(usage: UsageData | null | undefined): this

  /**
   * Get the usage description.
   *
   * @see {@linkcode UsageInfo}
   *
   * @public
   * @instance
   *
   * @return {UsageInfo}
   *  Usage info
   */
  public usage(): UsageInfo

  /**
   * Get or set the usage description.
   *
   * @see {@linkcode UsageInfo}
   * @see {@linkcode UsageData}
   *
   * @public
   * @instance
   *
   * @param {UsageData | null | undefined} [usage]
   *  Usage data
   * @return {UsageInfo | this}
   *  Usage info or `this` command
   */
  public usage(usage?: UsageData | null | undefined): UsageInfo | this {
    if (arguments.length) return this.info.usage = usage, this

    /**
     * The command usage data.
     *
     * @const {UsageData} data
     */
    const data: UsageData = { ...this.info.usage }

    data.options = trim(data.options)
    if (data.options !== null && !data.options) data.options = '[flags...]'

    return {
      arguments: toList(data.arguments).map(arg => arg.trim()),
      options: data.options,
      subcommand: trim(data.subcommand) ?? this.structural
        ? '<command>'
        : '[command]'
    }
  }

  /**
   * Get a list of options passed by the user.
   *
   * User options are have a value that is not `undefined`
   * and a source that is not `default`.
   *
   * @see {@linkcode Option}
   * @see {@linkcode OptionValueSource}
   *
   * @template {Option} T
   *  The option instance
   *
   * @public
   * @instance
   *
   * @param {OptionValueSource | null | undefined} [filter]
   *  An additional option value source filter
   * @return {T[]}
   *  The list of user options
   */
  public userOptions<T extends Option>(
    filter?: OptionValueSource | null | undefined
  ): T[] {
    return [...this.uniqueOptions<T>()].filter(option => {
      /**
       * The source of the option value.
       *
       * @var {OptionValueSource | undefined} source
       */
      let source: OptionValueSource | undefined

      return (
        this.optionValue(option.key) !== undefined &&
        !!(source = this.optionValueSource(option.key)) &&
        source !== optionValueSource.default &&
        (!filter || source !== filter)
      )
    })
  }

  /**
   * Set the command version.
   *
   * @see {@linkcode Version}
   *
   * @public
   * @instance
   *
   * @param {Version | null | undefined} version
   *  The command version
   * @return {this}
   *  `this` command
   */
  public version(version: Version | null | undefined): this

  /**
   * Print the command version.
   *
   * @public
   * @instance
   *
   * @param {true} version
   *  Whether to print the command version
   * @return {undefined}
   */
  public version(version: true): undefined

  /**
   * Get the command version.
   *
   * @public
   * @instance
   *
   * @template {Version} T
   *  The command version
   *
   * @return {T | null}
   *  The command version
   */
  public version<T extends Version>(): T | null

  /**
   * Get, set, or print the command version.
   *
   * @see {@linkcode Version}
   * @see {@linkcode VersionOptionData}
   *
   * @public
   * @instance
   *
   * @param {Version | true | null | undefined} [version]
   *  The command version or `true` to print the command version
   * @return {Version | this | null | undefined}
   *  The command version or `this` command
   */
  public version(
    version?: Version | true | null | undefined
  ): Version | this | null | undefined {
    if (arguments.length) {
      if (version === true) {
        if (!(version = this.version())) return void version
        return void this.process.stdout.write(String(version) + chars.lf)
      } else {
        this.info.version = version
      }

      return this
    }

    return this.info.version
      ? typeof this.info.version === 'string'
        ? trim(this.info.version)
        : this.info.version
      : null
  }

  /**
   * Configure the version option.
   *
   * > 👉 **Note**: No cleanup is performed when this method is called with
   * > different flags (i.e. `version` as a string or `version.flags`).
   *
   * @see {@linkcode VersionOptionData}
   *
   * @public
   * @instance
   *
   * @param {VersionOptionData | null | undefined} version
   *  Option flags, option info, option instance, `false` to disable the version
   *  option, or any other allowed value to use the default configuration
   * @return {this}
   *  `this` command
   */
  public versionOption(version: VersionOptionData | null | undefined): this

  /**
   * Get the version option.
   *
   * @see {@linkcode Option}
   *
   * @template {Option} T
   *  The version option instance
   *
   * @public
   * @instance
   *
   * @return {Option | null}
   *  Version option
   */
  public versionOption<T extends Option>(): T | null

  /**
   * Get or configure the version option.
   *
   * @see {@linkcode Option}
   * @see {@linkcode VersionOptionData}
   *
   * @public
   * @instance
   *
   * @param {VersionOptionData | null | undefined} [version]
   *  Option flags, option info, option instance, `false` to disable the version
   *  option, or any other allowed value to use the default configuration
   * @return {Option | null | this}
   *  Version option or `this` command
   */
  public versionOption(
    version?: VersionOptionData | null | undefined
  ): Option | null | this {
    if (arguments.length) {
      if (version === false) {
        this.info.versionOption = null
      } else {
        if (typeof version === 'string') version = { flags: version }
        if (!version || typeof version !== 'object') version = {}

        // set version option.
        if (isOption(version)) {
          this.info.versionOption = version
        } else {
          version.description ||= 'print version number'

          if ('flags' in version) {
            this.info.versionOption = this.createOption(version)
          } else {
            version = { ...version, flags: '-v, --version' }
            this.info.versionOption = this.createOption(version)
          }
        }

        // add version option and register version event listener.
        this.addOption(this.info.versionOption)
        this.on(this.info.versionOption.event, this.onVersion.bind(this))
      }

      return this
    }

    return this.info.versionOption ?? null
  }
}

export default Command
