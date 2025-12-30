/**
 * @file Command Fixtures - tribonacci
 * @module fixtures/commands/tribonacci
 */

import chars from '#enums/chars'
import number from '#parsers/number'
import sfmt from '#tests/utils/sfmt'
import digits from '#utils/digits'
import c from '@flex-development/colors'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `tribonacci`.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: [
    {
      choices: digits,
      description: 'first value in starting sequence',
      parser: number,
      syntax: sfmt.required({ id: chars.lowercaseA })
    },
    {
      choices: digits,
      description: 'second value in starting sequence',
      parser: number,
      syntax: sfmt.required({ id: chars.lowercaseB })
    },
    {
      choices: digits,
      description: 'third value in starting sequence',
      parser: number,
      syntax: sfmt.required({ id: chars.lowercaseC })
    }
  ],
  description: 'Given the starting sequence `[a, b, c]`,\n' +
    'print the first `n` elements of the sequence.',
  examples: c.yellow('-n10 0 0 1'),
  help: { columns: 80 },
  name: 'tribonacci',
  options: {
    choices: digits.filter(digit => digit !== chars.digit0),
    description: 'the number of values to include in the sequence',
    flags: '-n' + chars.space + sfmt.required({ mandatory: true })
  },
  version: '1.0.0'
}
