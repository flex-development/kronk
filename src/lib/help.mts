/**
 * @file Help
 * @module kronk/lib/Help
 */

import chars from '#enums/chars'
import { createColors, type Colors } from '@flex-development/colors'
import type { Command, HelpTextOptions } from '@flex-development/kronk'

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
    return void command, chars.empty
  }
}

export default Help
