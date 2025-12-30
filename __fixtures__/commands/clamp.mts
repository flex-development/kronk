/**
 * @file Command Fixtures - clamp
 * @module fixtures/commands/clamp
 */

import chars from '#enums/chars'
import bool from '#parsers/bool'
import number from '#parsers/number'
import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `clamp`.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: {
    description: 'the number to clamp',
    parser: number,
    syntax: sfmt.required({ id: 'n' })
  },
  description: 'clamp a number within a given range',
  examples: [['-M3', '-m-1', chars.delimiter, '-13'], ['-M=26', chars.digit9]],
  helpOption: '-h --help',
  name: 'clamp',
  options: [
    {
      choices: bool.choices,
      env: 'CLAMP_DEBUG',
      flags: '-d --debug [choice]',
      parser: bool()
    },
    {
      default: { value: 'MAX_SAFE_INTEGER' },
      description: 'upper bound (inclusive)',
      flags: '-M --max <n>',
      parser: number
    },
    {
      default: { value: 0 },
      description: 'lower bound (inclusive)',
      flags: '-m --min <n>',
      parser: number
    }
  ],
  usage: {
    arguments: sfmt.required({ id: 'number' })
  },
  version: {
    flags: '-v --version',
    version: '1.0.0'
  }
}
