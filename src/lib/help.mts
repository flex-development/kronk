/**
 * @file Help
 * @module kronk/lib/Help
 */

import chars from '#enums/chars'
import type HelpTextSection from '#interfaces/help-text-section'
import toList from '#internal/to-list'
import { createColors, type Colors } from '@flex-development/colors'
import type {
  Argument,
  Command,
  CommandName,
  DefaultInfo,
  ExampleInfo,
  Helpable,
  HelpTextOptions,
  List,
  Numeric,
  Option,
  Parseable,
  UsageInfo
} from '@flex-development/kronk'
import { number } from '@flex-development/kronk/parsers'
import { isArgument } from '@flex-development/kronk/utils'
import {
  wrap,
  type Config as WrapConfig,
  type Options as WrapOptions
} from '@flex-development/string-wrap'
import { fallback, fork, isNIL, sift } from '@flex-development/tutils'
import { ok } from 'devlop'
import stringWidth from 'string-width'

/**
 * Help text utility.
 *
 * @class
 */
class Help {
  /**
   * An object containing methods for styling text.
   *
   * @see {@linkcode Colors}
   *
   * @protected
   * @instance
   * @member {Colors} style
   */
  protected ansi!: Colors

  /**
   * The maximum number of columns to output.
   *
   * @default 110
   *
   * @protected
   * @instance
   * @member {number} columns
   */
  protected columns!: number

  /**
   * The character, or characters, used to mark the end of a line.
   *
   * @default '\n'
   *
   * @protected
   * @instance
   * @member {string} eol
   */
  protected eol!: string

  /**
   * The example marker to use.
   *
   * @default '$'
   *
   * @protected
   * @instance
   * @member {string} exampleMarker
   */
  protected exampleMarker!: string

  /**
   * Whether to show global options.
   *
   * @default true
   *
   * @protected
   * @instance
   * @member {boolean | null | undefined} showGlobalOptions
   */
  protected showGlobalOptions?: boolean | null | undefined

  /**
   * Create a new help text utility.
   *
   * @see {@linkcode HelpTextOptions}
   *
   * @param {HelpTextOptions | null | undefined} [options]
   *  Options for formating help text
   */
  constructor(options?: HelpTextOptions | null | undefined) {
    void this.prepare(options)
  }

  /**
   * Check if a value is a boolean or stringified boolean.
   *
   * @protected
   * @static
   *
   * @param {unknown} value
   *  The thing to check
   * @return {value is boolean | 'false' | 'true'}
   *  `true` if `value` is boolean or stringified boolean, `false` otherwise
   */
  protected static isBoolean(
    value: unknown
  ): value is boolean | 'false' | 'true' {
    return ([chars.false, chars.true] as string[]).includes(String(value))
  }

  /**
   * Check if a value is a number or numeric.
   *
   * @see {@linkcode Numeric}
   *
   * @protected
   * @static
   *
   * @param {unknown} value
   *  The thing to check
   * @return {value is Numeric | number}
   *  `true` if `value` is number or numeric, `false` otherwise
   */
  protected static isNumber(value: unknown): value is Numeric | number {
    return (
      typeof value === 'number' ||
      typeof value === 'string' && !Number.isNaN(number(value))
    )
  }

  /**
   * Get the list of aliases.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected aliases(command: Command): HelpTextSection {
    return {
      content: [...command.aliases()].map(alias => this.item(alias, -1)),
      title: 'Aliases'
    }
  }

  /**
   * Pretty print an argument.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Argument} argument
   *  The argument
   * @param {Command} command
   *  The parent command
   * @return {string}
   *  The formatted argument
   */
  protected argument(argument: Argument, command: Command): string {
    return this.item(
      this.argumentTerm(argument),
      this.longestTerm(command),
      this.argumentDescription(argument),
      this.choices(argument),
      this.default(argument)
    )
  }

  /**
   * Get a description to show in the list of arguments.
   *
   * @see {@linkcode Argument}
   *
   * @protected
   * @instance
   *
   * @param {Argument} argument
   *  The argument
   * @return {string}
   *  The formatted description
   */
  protected argumentDescription(argument: Argument): string {
    return this.ansi.italic(argument.description())
  }

  /**
   * Get a term to show in the list of arguments.
   *
   * @see {@linkcode Argument}
   *
   * @protected
   * @instance
   *
   * @param {Argument} argument
   *  The argument
   * @return {string}
   *  The formatted term
   */
  protected argumentTerm(argument: Argument): string {
    return argument.id
  }

  /**
   * Get the list of arguments.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected arguments(command: Command): HelpTextSection {
    return {
      content: this.visibleArguments(command).map(argument => {
        return this.argument(argument, command)
      }),
      title: 'Arguments'
    }
  }

  /**
   * Format a parse candidate choice.
   *
   * @protected
   * @instance
   *
   * @param {string} choice
   *  One of the allowed candidate choices
   * @return {string}
   *  The formatted choice
   */
  protected choice(choice: string): string {
    if (!Help.isBoolean(choice) && !Help.isNumber(choice)) {
      choice = this.quote(JSON.stringify(choice).slice(1, -1))
    }

    return choice
  }

  /**
   * Get a list of parse candidate choices.
   *
   * @see {@linkcode Parseable}
   *
   * @protected
   * @instance
   *
   * @param {Parseable} candidate
   *  The parse candidate
   * @return {string | null}
   *  The formatted list of allowed candidate choices
   */
  protected choices(candidate: Parseable): string | null {
    /**
     * The list of allowed choices.
     *
     * @const {string[]} choices
     */
    const choices: string[] = [...candidate.choices()]

    /**
     * The formatted list.
     *
     * @var {string | null} list
     */
    let list: string | null = null

    // add formatted choices to the list.
    if (choices.length) {
      list = 'choices' + chars.colon + chars.space
      list += choices.map(c => this.choice(c)).join(chars.bar)
    }

    return list
  }

  /**
   * Compare two strings.
   *
   * @see {@linkcode Intl.CollatorOptions}
   * @see {@linkcode Intl.LocalesArgument}
   *
   * @protected
   * @instance
   *
   * @param {string} a
   *  The target string
   * @param {string} b
   *  The string to compare to the target string
   * @param {Intl.LocalesArgument | null | undefined} [locale]
   *  A locale string or array of locale strings containing
   *  one or more language or locale tags
   * @param {Intl.CollatorOptions | null | undefined} [opts]
   *  Comparision options
   * @param {'false' | 'lower' | 'upper' | undefined} [opts.caseFirst='upper']
   *  Case comparision options
   * @return {number}
   *  The comparison result
   */
  protected compare(
    a: string,
    b: string,
    locale?: Intl.LocalesArgument | null | undefined,
    opts?: Intl.CollatorOptions | null | undefined
  ): number {
    return a.localeCompare(
      b,
      locale ?? undefined,
      opts ?? { caseFirst: 'upper' }
    )
  }

  /**
   * Compare two subcommands.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} a
   *  The first subcommand
   * @param {Command} b
   *  The subcommand to compare to `a`
   * @return {number}
   *  The comparison result
   */
  protected compareCommand(a: Command, b: Command): number {
    /**
     * The name of command `a`.
     *
     * @const {CommandName} aName
     */
    const aName: CommandName = a.id()

    /**
     * The name of command `b`.
     *
     * @const {CommandName} bName
     */
    const bName: CommandName = b.id()

    ok(typeof aName === 'string', 'expected subcommand `a` to have a name')
    ok(typeof bName === 'string', 'expected subcommand `b` to have a name')

    return this.compare(aName, bName)
  }

  /**
   * Compare two options.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} a
   *  The first option
   * @param {Option} b
   *  The option to compare to `a`
   * @return {number}
   *  The comparison result
   */
  protected compareOption(a: Option, b: Option): number {
    return this.compare(a.id, b.id)
  }

  /**
   * Format a conflicting option.
   *
   * @protected
   * @instance
   *
   * @param {string} conflict
   *  The name of the conflicting option
   * @return {string}
   *  The formatted conflicting option name
   */
  protected conflict(conflict: string): string {
    return conflict
  }

  /**
   * Get the list of conflicting options to show in an option description.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string | null}
   *  The formatted list of conflicting option names
   */
  protected conflicts(option: Option): string | null {
    /**
     * The list of conflicting option names.
     *
     * @const {string[]} conflicts
     */
    const conflicts: string[] = [...option.conflicts()]

    /**
     * The formatted list.
     *
     * @var {string | null} list
     */
    let list: string | null = null

    if (conflicts.length) {
      list = 'conflicts' + chars.colon + chars.space + conflicts
        .map(this.conflict.bind(this))
        .join(chars.comma + chars.space)
    }

    return list
  }

  /**
   * Get the default value configuration
   * to show in a parse candidate description.
   *
   * @see {@linkcode Parseable}
   *
   * @protected
   * @instance
   *
   * @param {Parseable} candidate
   *  The parse candidate
   * @return {string | undefined}
   *  The formatted default value configuration
   */
  protected default(candidate: Parseable): string | undefined {
    /**
     * The default value info.
     *
     * @const {DefaultInfo | undefined} info
     */
    const info: DefaultInfo | undefined = candidate.default()

    /**
     * The formatted default value configuration.
     *
     * @var {string | undefined} formatted
     */
    let formatted: string | undefined = undefined

    if (info) {
      formatted = 'default' + chars.colon + chars.space
      formatted += info.description || this.defaultValue(info.value)
    }

    return formatted
  }

  /**
   * Format a default value.
   *
   * @protected
   * @instance
   *
   * @param {unknown} value
   *  The default value
   * @return {string}
   *  The formatted default value
   */
  protected defaultValue(value: unknown): string {
    return typeof value === 'string' ? this.quote(value) : String(value)
  }

  /**
   * Get the list of environment variables to show in an option description.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string | null}
   *  The formatted list of environment variable names
   */
  protected env(option: Option): string | null {
    /**
     * The list of environment variable names.
     *
     * @const {string[]} vars
     */
    const vars: string[] = [...option.env()]

    /**
     * The formatted list.
     *
     * @var {string | null} list
     */
    let list: string | null = null

    if (vars.length) {
      list = 'env' + chars.colon + chars.space
      list += vars.map(v => this.environment(v)).join(chars.comma + chars.space)
    }

    return list
  }

  /**
   * Format an environment variable name.
   *
   * @protected
   * @instance
   *
   * @param {string} name
   *  The environment variable name
   * @return {string}
   *  The formatted environment variable name
   */
  protected environment(name: string): string {
    return name
  }

  /**
   * Pretty print an example.
   *
   * @see {@linkcode Command}
   * @see {@linkcode ExampleInfo}
   *
   * @protected
   * @instance
   *
   * @param {ExampleInfo} example
   *  The example info
   * @param {Command} command
   *  The parent command
   * @return {string}
   *  The formatted example
   */
  protected example(example: ExampleInfo, command: Command): string {
    return this.item(
      this.exampleTerm(example, command),
      this.longestTerm(command),
      !!this.width(example.comment) && this.ansi.dim(example.comment)
    )
  }

  /**
   * Get a term to show in the list of arguments.
   *
   * @see {@linkcode Command}
   * @see {@linkcode ExampleInfo}
   *
   * @protected
   * @instance
   *
   * @param {ExampleInfo} info
   *  The example info
   * @param {Command} command
   *  The command
   * @return {string}
   *  The formatted term
   */
  protected exampleTerm(info: ExampleInfo, command: Command): string {
    /**
     * The parts of the example term.
     *
     * @const {(string | null | undefined)[]} parts
     */
    const parts: (string | null | undefined)[] = [
      this.exampleMarker,
      this.ansi.gray(toList(info.env).join(chars.space)),
      toList(info.text).join(chars.space)
    ]

    // add references to `command` and its ancestors.
    if (info.command !== false) {
      /**
       * The command names string.
       *
       * @var {ReadonlyArray<CommandName>} names
       */
      let names: readonly CommandName[] = toList(info.command)

      if (!names.length) {
        names = [command, ...command.ancestors()].reverse().map(cmd => cmd.id())
      }

      parts.splice(-1, 0, this.filterJoin(names))
    }

    return this.filterJoin(parts)
  }

  /**
   * Get the list of examples.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected examples(command: Command): HelpTextSection {
    return {
      content: command.examples().map(info => this.example(info, command)),
      title: 'Examples'
    }
  }

  /**
   * Filter and join a `list`.
   *
   * @todo update documentation
   *
   * @see {@linkcode List}
   *
   * @protected
   * @instance
   *
   * @param {List<string | false | null | undefined>} list
   *  The list to filter
   * @param {string | null | undefined} [separator]
   *  The string used to separate one element of `list` from the next in the
   *  resulting string. If omitted, list items are separated with a space (` `).
   * @return {string}
   *  Sifted and joined `list`
   */
  protected filterJoin(
    list: List<string | false | null | undefined>,
    separator?: string | null | undefined
  ): string {
    return [...list]
      .filter(item => typeof item === 'string' && !!this.width(item))
      .join(separator ?? chars.space)
  }

  /**
   * Pretty print a global option.
   *
   * @see {@linkcode Command}
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @param {Command} command
   *  The parent command
   * @return {string}
   *  The formatted option
   */
  protected globalOption(option: Option, command: Command): string {
    return this.item(
      this.globalOptionTerm(option),
      this.longestTerm(command),
      this.globalOptionDescription(option),
      this.choices(option),
      this.default(option),
      option.optional && this.preset(option),
      this.env(option),
      this.conflicts(option)
    )
  }

  /**
   * Get the description to show in the list of global options.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string}
   *  The formatted description
   */
  protected globalOptionDescription(option: Option): string {
    return this.optionDescription(option)
  }

  /**
   * Get the term to show in the list of global options.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string}
   *  The formatted term
   */
  protected globalOptionTerm(option: Option): string {
    return this.optionTerm(option)
  }

  /**
   * Get a list of global options.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected globalOptions(command: Command): HelpTextSection {
    return {
      content: this.visibleGlobalOptions(command).map(option => {
        return this.globalOption(option, command)
      }),
      title: 'Global Options'
    }
  }

  /**
   * Get the help text header.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected header(command: Command): HelpTextSection {
    /**
     * The lines of the header.
     *
     * @const {string[]} lines
     */
    const lines: string[] = []

    /**
     * The name of the command.
     *
     * @const {CommandName} name
     */
    const name: CommandName = command.id()

    /**
     * The command version.
     *
     * @const {string | null} version
     */
    const version: string | null = command.version()

    /**
     * The command usage descriptor.
     *
     * @var {string} usage
     */
    let usage: string = this.usage(command)

    // add command name.
    if (name) lines.push(name)

    // add command version.
    if (version) {
      if (lines.length) {
        lines[0]! += this.ansi.dim(chars.at) + version
      } else {
        lines.push(this.ansi.dim(chars.lowercaseV + version))
      }
    }

    // include ancestor command names in usage descriptor.
    // at minimum, commands are expected to have a help subcommand or option.
    // this means `usage` is expected to always be a non-empty string.
    usage = this.filterJoin(command.ancestors().reduce((acc, ancestor) => {
      return acc.unshift(ancestor.id()), acc
    }, [name, usage]))

    // add usage line.
    lines.push(this.ansi.bold('usage') + chars.colon + chars.space + usage)

    return {
      content: this.filterJoin([
        ...lines.map(line => this.wrap(line)),
        this.wrap(command.description(), null, { indent: chars.digit2 })
      ], chars.lf)
    }
  }

  /**
   * Highlight inline code in a string.
   *
   * @protected
   * @instance
   *
   * @param {string} string
   *  The target string
   * @return {string}
   *  The string with inline code highlighted
   */
  protected inlineCode(string: string): string {
    return string.replace(/`([^`]+)`/gm, (_, m) => this.ansi.cyan(m))
  }

  /**
   * Format an item, consisting of a term,
   * description, and optional description details.
   *
   * @protected
   * @instance
   *
   * @param {string} term
   *  The item term
   * @param {number} longestTermWidth
   *  The width of the longest term
   * @param {false | string | null | undefined} [description]
   *  The item description
   * @param {(false | string | null | undefined)[]} [details]
   *  A list of description details
   * @return {string}
   *  The formatted item
   */
  protected item(
    term: string,
    longestTermWidth: number,
    description?: false | string | null | undefined,
    ...details: (false | string | null | undefined)[]
  ): string {
    /**
     * The indent size.
     *
     * @const {string} indent
     */
    const indent: string = chars.digit2

    /**
     * The formatted item.
     *
     * @var {string} item
     */
    let item: string = chars.space.repeat(+indent) + term

    if (typeof description === 'string') {
      /**
       * The width of the term.
       *
       * @const {number} termWidth
       */
      const termWidth: number = this.width(term)

      // pad out to a consistent width so term details are aligned.
      item += chars.space.repeat(Math.max(0, longestTermWidth - termWidth))
      item += chars.space.repeat(+chars.digit5) // spacer.

      /**
       * The current width of the item.
       *
       * @const {number} itemWidth
       */
      const itemWidth: number = this.width(item)

      // add item description.
      item += this.wrap(description, {
        /**
         * Get the maximum number of columns for the line at `index`.
         *
         * @param {number} index
         *  The index of the current line
         * @return {number}
         *  The maximum number of columns
         */
        columns: (index: number): number => {
          return index <= 0 ? this.columns - itemWidth : this.columns
        },
        /**
         * Get the size of the string used to the pad the left side
         * of the line at `index`.
         *
         * @this {void}
         *
         * @param {number} index
         *  The index of the current line
         * @return {number | string}
         *  The size of left padding string
         */
        padLeft(this: void, index: number): number | string {
          return index <= 0 ? chars.digit0 : itemWidth
        }
      })

      // add item description details.
      for (const detail of details) {
        if (typeof detail === 'string' && this.width(detail)) {
          item = this.newline(item) + this.wrap(detail, this.columns, {
            indent,
            padLeft: itemWidth
          })
        }
      }
    }

    return item
  }

  /**
   * Get the width of the longest argument term.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {number}
   *  The width of the longest visible argument term
   */
  protected longestArgumentTerm(command: Command): number {
    return this.visibleArguments(command).reduce((width, argument) => {
      return Math.max(width, this.width(this.argumentTerm(argument)))
    }, +chars.digit0)
  }

  /**
   * Get the width of the longest example term.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {number}
   *  The width of the longest example term
   */
  protected longestExampleTerm(command: Command): number {
    return command.examples().reduce((width, info) => {
      return Math.max(width, this.width(this.exampleTerm(info, command)))
    }, +chars.digit0)
  }

  /**
   * Get the width of the longest global option term.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {number}
   *  The width of the longest visible global option term
   */
  protected longestGlobalOptionTerm(command: Command): number {
    return this.visibleGlobalOptions(command).reduce((width, option) => {
      return Math.max(width, this.width(this.optionTerm(option)))
    }, +chars.digit0)
  }

  /**
   * Get the width of the longest option term.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {number}
   *  The width of the longest visible option term
   */
  protected longestOptionTerm(command: Command): number {
    return this.visibleOptions(command).reduce((width, option) => {
      return Math.max(width, this.width(this.optionTerm(option)))
    }, +chars.digit0)
  }

  /**
   * Get the width of the longest subcommand term.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {number}
   *  The width of the longest visible subcommand term
   */
  protected longestSubcommandTerm(command: Command): number {
    return this.visibleCommands(command).reduce((width, command) => {
      return Math.max(width, this.width(this.subcommandTerm(command)))
    }, +chars.digit0)
  }

  /**
   * Get the width of the longest argument, option, or subcommand term.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {number}
   *  The width of the longest term
   */
  protected longestTerm(command: Command): number {
    return Math.max(
      this.longestArgumentTerm(command),
      this.longestExampleTerm(command),
      this.longestGlobalOptionTerm(command),
      this.longestOptionTerm(command),
      this.longestSubcommandTerm(command)
    )
  }

  /**
   * Append new lines to a string.
   *
   * @protected
   * @instance
   *
   * @param {string | null | undefined} [string=chars.empty]
   *  The string to append line breaks to
   * @param {number | string | null | undefined} [count=1]
   *  The number of line breaks to append
   * @return {string}
   *  The string with line breaks appended
   */
  protected newline(
    string?: string | null | undefined,
    count?: number | string | null | undefined
  ): string {
    string = fallback(string, chars.empty, isNIL)
    return string + this.eol.repeat(+(count ?? chars.digit1))
  }

  /**
   * Pretty print an option.
   *
   * @see {@linkcode Command}
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @param {Command} command
   *  The parent command
   * @return {string}
   *  The formatted option
   */
  protected option(option: Option, command: Command): string {
    return this.item(
      this.optionTerm(option),
      this.longestTerm(command),
      this.optionDescription(option),
      this.choices(option),
      this.default(option),
      option.optional && this.preset(option),
      this.env(option),
      this.conflicts(option)
    )
  }

  /**
   * Get the description to show in the list of options.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string}
   *  The formatted description
   */
  protected optionDescription(option: Option): string {
    return this.ansi.italic(option.description() || chars.minus)
  }

  /**
   * Get the term to show in the list of options.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string}
   *  The formatted term
   */
  protected optionTerm(option: Option): string {
    return option.flags
  }

  /**
   * Get a list of options.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected options(command: Command): HelpTextSection {
    return {
      content: this.visibleOptions(command).map(option => {
        return this.option(option, command)
      }),
      title: 'Options'
    }
  }

  /**
   * Prepare the help text context.
   *
   * @see {@linkcode HelpTextOptions}
   *
   * @public
   * @instance
   *
   * @param {HelpTextOptions | null | undefined} [options]
   *  Options for formating help text
   * @return {this}
   *  The help text utility
   */
  public prepare(options?: HelpTextOptions | null | undefined): this {
    this.ansi = createColors(options)
    this.columns = options?.columns ?? 110
    this.eol = options?.eol ?? chars.lf
    this.exampleMarker = options?.exampleMarker ?? chars.dollar
    this.showGlobalOptions = options?.globalOptions ?? true
    return this
  }

  /**
   * Pretty print an option preset.
   *
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Option} option
   *  The option
   * @return {string | null}
   *  The formatted preset
   */
  protected preset(option: Option): string | null {
    /**
     * The option preset.
     *
     * @const {string | null} preset
     */
    const preset: string | null = option.preset()

    /**
     * The formatted option preset.
     *
     * @var {string | null} string
     */
    let string: string | null = null

    if (preset) {
      string = 'preset' + chars.colon + chars.space + this.presetValue(preset)
    }

    return string
  }

  /**
   * Format a preset option value.
   *
   * @protected
   * @instance
   *
   * @param {string} value
   *  The preset value
   * @return {string}
   *  The formatted preset value
   */
  protected presetValue(value: string): string {
    if (!Help.isBoolean(value) && !Help.isNumber(value)) {
      value = this.quote(JSON.stringify(value).slice(1, -1))
    }

    return value
  }

  /**
   * Wrap a string in quotes.
   *
   * @protected
   * @instance
   *
   * @param {string} string
   *  The string to wrap
   * @param {string | null | undefined} [char='\'']
   *  The quotation character to use
   * @return {string}
   *  The quoted `string`
   */
  protected quote(string: string, char?: string | null | undefined): string {
    return char ??= chars.apostrophe, char + string + char
  }

  /**
   * Format a list of sections.
   *
   * @see {@linkcode HelpTextSection}
   * @see {@linkcode List}
   *
   * @protected
   * @instance
   *
   * @param {List<HelpTextSection | false | null | undefined>} list
   *  The sections to format
   * @return {string}
   *  The formatted list of sections
   */
  protected sections(
    list: List<HelpTextSection | false | null | undefined>
  ): string {
    return sift([...list])
      .filter(nonempty.bind(this))
      .reduce(format.bind(this), chars.empty)

    /**
     * @this {Help}
     *
     * @param {string} acc
     *  The current formatted list of sections
     * @param {HelpTextSection} section
     *  The current section
     * @param {number} index
     *  The index of `section` in `sections`
     * @param {ReadonlyArray<HelpTextSection>} sections
     *  The filtered list of sections
     * @return {string}
     *  The new formatted list of sections
     */
    function format(
      this: Help,
      acc: string,
      section: HelpTextSection,
      index: number,
      sections: readonly HelpTextSection[]
    ): string {
      // add section title.
      if (section.title && this.width(section.title)) {
        acc += this.title(section.title)
      }

      // add section content.
      acc += Array.isArray(section.content)
        ? section.content.join(chars.lf)
        : section.content

      return this.newline(
        acc,
        index < sections.length - 1 ? chars.digit2 : chars.digit1
      )
    }

    /**
     * @this {Help}
     *
     * @param {HelpTextSection} item
     *  The current list item
     * @return {boolean}
     *  `true` if `item` is non-empty section, `false` otherwise
     */
    function nonempty(this: Help, item: HelpTextSection): boolean {
      return (
        !!item.content &&
        (
          typeof item.content === 'string' && !!this.width(item.content) ||
          Array.isArray(item.content) && !!item.content.length
        )
      )
    }
  }

  /**
   * Get a description to show in the list of subcommands.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} subcommand
   *  The subcommand
   * @return {string}
   *  The formatted description
   */
  protected subcommandDescription(subcommand: Command): string {
    return subcommand.summary() || subcommand.description()
  }

  /**
   * Get the term to show in the list of subcommands.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} subcommand
   *  The subcommand
   * @return {string}
   *  The formatted term
   */
  protected subcommandTerm(subcommand: Command): string {
    return this.filterJoin([subcommand.id(), this.usage(subcommand)])
  }

  /**
   * Get the list of subcommands.
   *
   * @see {@linkcode Command}
   * @see {@linkcode HelpTextSection}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {HelpTextSection}
   *  Help text section
   */
  protected subcommands(command: Command): HelpTextSection {
    return {
      content: this.visibleCommands(command).map(subcommand => {
        return this.item(
          this.subcommandTerm(subcommand),
          this.longestTerm(command),
          this.subcommandDescription(subcommand)
        )
      }),
      title: 'Commands'
    }
  }

  /**
   * Generate help text for a command.
   *
   * @see {@linkcode Command}
   *
   * @public
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {string}
   *  Formatted help text
   */
  public text(command: Command): string {
    return this.inlineCode(this.sections([
      this.header(command),
      this.aliases(command),
      this.examples(command),
      this.arguments(command),
      this.options(command),
      this.globalOptions(command),
      this.subcommands(command)
    ]))
  }

  /**
   * Format a title.
   *
   * @protected
   * @instance
   *
   * @param {string} title
   *  The title to format
   * @return {string}
   *  Formatted title
   */
  protected title(title: string): string {
    return this.newline(this.ansi.underline(title))
  }

  /**
   * Get a command usage description.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {string}
   *  The formatted usage descriptor
   */
  protected usage(command: Command): string {
    /**
     * The list of visible arguments.
     *
     * @const {ReadonlyArray<Argument>} args
     */
    const args: readonly Argument[] = this.visibleArguments(command)

    /**
     * Command usage info.
     *
     * @const {UsageInfo} info
     */
    const info: UsageInfo = command.usage()

    /**
     * The formatted usage segments.
     *
     * @const {string} parts
     */
    const parts: string[] = []

    // indicate command has options.
    if (info.options && this.visibleOptions(command).length) {
      parts.push(this.usageTerm(info.options, 'options'))
    }

    // indicate command has subcommands.
    if (info.subcommand && this.visibleCommands(command).length) {
      parts.push(this.usageTerm(info.subcommand, 'subcommand'))
    }

    // indicate command has arguments.
    if (info.arguments.length && args.length) {
      for (const term of info.arguments) {
        parts.push(this.usageTerm(term, 'arguments'))
      }
    } else {
      for (const arg of args) {
        parts.push(this.usageTerm(arg.syntax, 'arguments'))
      }
    }

    return this.wrap(this.filterJoin(parts))
  }

  /**
   * Format a usage term.
   *
   * @see {@linkcode UsageInfo}
   *
   * @protected
   * @instance
   *
   * @param {string} term
   *  The term to format
   * @param {keyof UsageInfo} type
   *  The type of term to format
   * @return {string}
   *  The formatted term
   */
  protected usageTerm(term: string, type: keyof UsageInfo): string {
    return void type, term
  }

  /**
   * Check if a help text candidate should be shown in the help text.
   *
   * @see {@linkcode Helpable}
   *
   * @protected
   * @instance
   *
   * @param {Argument | Command | Option} candidate
   *  The help text candidate to check
   * @return {boolean}
   *  `true` if `candidate` should be displayed in help text, `false` otherwise
   */
  protected visible(candidate: Helpable): boolean {
    if (isArgument(candidate)) return !!candidate.description()
    return !candidate.hidden
  }

  /**
   * Get a list of visible arguments.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {ReadonlyArray<Argument>}
   *  List of visible arguments
   */
  protected visibleArguments(command: Command): readonly Argument[] {
    return Object.freeze(command.arguments().filter(this.visible.bind(this)))
  }

  /**
   * Get a sorted list of visible subcommands.
   *
   * @see {@linkcode Command}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {ReadonlyArray<Command>}
   *  List of visible subcommands
   */
  protected visibleCommands(command: Command): readonly Command[] {
    /**
     * The help subcommand.
     *
     * @const {Command | null}
     */
    const help: Command | null = command.helpCommand()

    /**
     * The list of visible subcommands.
     *
     * @var {Command[]} list
     */
    let list: Command[] = [...new Set(command.commands().values())]

    // filter subcommands by visibility.
    list = list.filter(this.visible.bind(this))

    // sort subcommands.
    list = fork(list, forker).flatMap(list => {
      return list.sort(this.compareCommand.bind(this))
    })

    return Object.freeze(list)

    /**
     * @this {void}
     *
     * @param {Command} subcommand
     *  The current subcommand
     * @return {boolean}
     *  `true` if `command` is not help subcommand, `false` otherwise
     */
    function forker(this: void, subcommand: Command): boolean {
      return subcommand !== help
    }
  }

  /**
   * Get a sorted list of visible global options.
   *
   * > 👉 **Note**: If visible, the `help` and `version` options will **always**
   * > be the last two options.
   *
   * @see {@linkcode Command}
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {ReadonlyArray<Option>}
   *  List of visible command options
   */
  protected visibleGlobalOptions(command: Command): readonly Option[] {
    /**
     * The list of visible command options.
     *
     * @var {ReadonlyArray<Option>} options
     */
    let options: readonly Option[] = Object.freeze([])

    if (this.showGlobalOptions) {
      /**
       * The global help option that will be displayed.
       *
       * @var {Option | undefined} help
       */
      let help: Option | undefined = undefined

      // get visible global options and remove all help options after the first.
      options = this.#visibleOptions(command.ancestors().flatMap(ancestor => {
        /**
         * The ancestor help option.
         *
         * @var {Option | null} helpOption
         */
        let helpOption: Option | null = ancestor.helpOption()

        // remove all help options except the first.
        return ancestor.options().filter(option => {
          if (option !== helpOption) return true
          if (!help) return help = option, true
          return false
        })
      }), command)
    }

    return options
  }

  /**
   * Get a sorted list of visible options.
   *
   * > 👉 **Note**: If visible, the `help` and `version` options will **always**
   * > be the last two options.
   *
   * @see {@linkcode Command}
   * @see {@linkcode Option}
   *
   * @private
   * @instance
   *
   * @param {ReadonlyArray<Option>} options
   *  The list of options
   * @param {Command} command
   *  The command
   * @return {ReadonlyArray<Option>}
   *  List of visible command options
   */
  #visibleOptions(
    options: readonly Option[],
    command: Command
  ): readonly Option[] {
    /**
     * The list of visible options.
     *
     * @var {Option[]} list
     */
    let list: Option[] = [...options]

    // filter options by visibility.
    list = list.filter(this.visible.bind(this))

    // sort options by id.
    list = fork(list, forker).flatMap(list => {
      return list.sort(this.compareOption.bind(this))
    })

    return Object.freeze(list)

    /**
     * @this {void}
     *
     * @param {Option} option
     *  The current option
     * @return {boolean}
     *  `true` if `option` is not help or version option, `false` otherwise
     */
    function forker(this: void, option: Option): boolean {
      return [command, ...command.ancestors()].every(cmd => {
        return option !== cmd.helpOption() && option !== cmd.versionOption()
      })
    }
  }

  /**
   * Get a sorted list of visible options.
   *
   * > 👉 **Note**: If visible, the `help` and `version` options will **always**
   * > be the last two options.
   *
   * @see {@linkcode Command}
   * @see {@linkcode Option}
   *
   * @protected
   * @instance
   *
   * @param {Command} command
   *  The command
   * @return {ReadonlyArray<Option>}
   *  List of visible command options
   */
  protected visibleOptions(command: Command): readonly Option[] {
    return this.#visibleOptions(command.options(), command)
  }

  /**
   * Get the visual width of a `string`.
   *
   * @protected
   * @instance
   *
   * @param {string | null | undefined} string
   *  The string to measure
   * @return {number}
   *  The number of columns required to display `string`
   */
  protected width(string: string | null | undefined): number {
    return string ? stringWidth(string) : 0
  }

  /**
   * Wrap a string to the specified number of `columns`.
   *
   * @see {@linkcode WrapOptions}
   *
   * @protected
   * @instance
   *
   * @param {string} string
   *  The string to wrap
   * @param {number | string | null | undefined} [columns]
   *  The number of columns to wrap the string to
   * @param {WrapOptions | null | undefined} [options]
   *  Options for wrapping
   * @return {string}
   *  The wrapped string
   */
  protected wrap(
    string: string,
    columns?: number | string | null | undefined,
    options?: WrapOptions | null | undefined
  ): string

  /**
   * Wrap a string to the specified column width.
   *
   * @see {@linkcode WrapConfig}
   *
   * @protected
   * @instance
   *
   * @param {string} string
   *  The string to wrap
   * @param {WrapConfig | number | string | null | undefined} [config]
   *  The wrap configuration or the number of columns to wrap the string to
   * @return {string}
   *  The wrapped string
   */
  protected wrap(
    string: string,
    config?: WrapConfig | number | string | null | undefined
  ): string

  /**
   * Wrap a string to the specified column width.
   *
   * @see {@linkcode WrapConfig}
   * @see {@linkcode WrapOptions}
   *
   * @protected
   * @instance
   *
   * @param {string} string
   *  The string to wrap
   * @param {WrapConfig | number | string | null | undefined} [config]
   *  The wrap configuration or the number of columns to wrap the string to
   * @param {WrapOptions | null | undefined} [options]
   *  Options for wrapping
   * @return {string}
   *  The wrapped string
   */
  protected wrap(
    string: string,
    config: WrapConfig | number | string | null | undefined,
    options?: WrapOptions | null | undefined
  ): string {
    return wrap(string, (config ?? this.columns) as never, options)
  }
}

export default Help
