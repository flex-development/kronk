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
   * The maximum number of columns to output.
   *
   * @default 80
   *
   * @protected
   * @instance
   * @member {number} columns
   */
  protected columns: number

  /**
   * An object containing methods for coloring and styling text.
   *
   * @see {@linkcode Colors}
   *
   * @protected
   * @instance
   * @member {Colors} style
   */
  protected style: Colors

  /**
   * Create a new help text utility.
   *
   * @see {@linkcode HelpTextOptions}
   *
   * @param {HelpTextOptions | null | undefined} [options]
   *  Options for formating help text
   */
  constructor(options?: HelpTextOptions | null | undefined) {
    this.columns = options?.columns ?? 80
    this.style = createColors(options)
  }

  /**
   * Generate help text for a command.
   *
   * @see {@linkcode Command}
   *
   * @public
   * @instance
   *
   * @param {Command} cmd
   *  The command to generate help text for
   * @return {string}
   *  Formatted help text
   */
  public text(cmd: Command): string {
    return void cmd, chars.empty
  }
}

export default Help
