/**
 * @file digital-root
 * @module examples/digital-root
 */

import c from '@flex-development/colors'
import { Command } from '@flex-development/kronk'
import { number } from '@flex-development/kronk/parsers'

/**
 * The parsed command options.
 */
type Opts = {
  /**
   * Whether to enable debugging.
   */
  debug?: boolean
}

/**
 * The program.
 *
 * @const {Command} program
 */
const program: Command = new Command({
  /**
   * Print the digital root of a number.
   *
   * A [digital root][dr] is the _recursive sum of all digits in a number_.
   *
   * [dr]: https://en.wikipedia.org/wiki/Digital_root
   *
   * @this {Command}
   *
   * @param {Opts} opts
   *  The parsed command options
   * @param {number | undefined} n
   *  The number
   * @return {undefined}
   */
  action(this: Command, opts: Opts, n: number | undefined): undefined {
    return void console.log(digitalRoot(n ?? Number.NaN))

    /**
     * @example
     *  digitalRoot(16) // 17
     * @example
     *  digitalRoot(942) // 6
     * @example
     *  digitalRoot(132189) // 6
     * @example
     *  digitalRoot(493193) // 2
     *
     * @this {void}
     *
     * @param {number} n
     *  The number
     * @return {number}
     *  The digital root of `n`
     */
    function digitalRoot(this: void, n: number): number {
      if (opts.debug) console.dir({ n })
      if (Number.isNaN(n) || n <= 9 || n === Number.POSITIVE_INFINITY) return n

      /**
       * The recursive sum of all digits in `n`.
       *
       * @var {number} sum
       */
      let sum: number = 0

      // iterate through digits starting from rightmost digit.
      while (n > 0) {
        if (opts.debug) console.dir({ n, sum })
        sum += n % 10 | 0 // add rightmost digit.
        n = n / 10 | 0 // move onto next digit.
      }

      return digitalRoot(sum) // return digital root of `sum`.
    }
  },
  aliases: ['dr'],
  arguments: {
    description: 'the number',
    parser: number,
    syntax: '[n]'
  },
  description: 'A digital root is the ' +
    c.italic('recursive sum of all digits in a number') +
    '.\n\nGiven a number, `n`, get the sum of all unique digits in `n`.',
  examples: [
    { comment: '// 17', text: '16' },
    { comment: '// 6', text: '942' },
    { comment: '// 6', text: '132189' },
    { comment: '// 6', text: '493193' },
    { command: 'dr', comment: '// -Infinity', text: 'NEGATIVE_INFINITY' },
    { command: 'dr', comment: '// Infinity', text: 'POSITIVE_INFINITY' },
    { command: 'dr', comment: '// NaN', text: 'thirteen' }
  ].map(info => (info.text = c.yellow(info.text), info)),
  name: 'digital-root',
  options: {
    description: 'enable debugging',
    flags: '-d, --debug'
  },
  version: '1.0.0'
})

void program.parse() // parse cli arguments.
