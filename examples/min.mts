/**
 * @file min
 * @module examples/min
 */

import c from '@flex-development/colors'
import { Command, type EmptyObject } from '@flex-development/kronk'
import { number } from '@flex-development/kronk/parsers'

/**
 * The program.
 *
 * @const {Command} program
 */
const program: Command = new Command({
  /**
   * Given a list of numbers, print the smallest number in the list.
   *
   * @this {Command}
   *
   * @param {EmptyObject} opts
   *  The parsed command options
   * @param {number[]} [numbers]
   *  The list of numbers
   * @return {undefined}
   */
  action(this: Command, opts: EmptyObject, ...numbers: number[]): undefined {
    return void console.log(Math.min(...numbers))
  },
  arguments: {
    default: { description: c.cyan('[]'), value: [] },
    description: 'the list of numbers',
    parser: number,
    syntax: '[numbers...]'
  },
  description: 'Given a list of `numbers`, get the smallest number in the list',
  examples: ['44 26 88 13', '34 -345 -1 100'].map(c.yellow),
  name: 'min'
})

void program.parse() // parse cli arguments.
