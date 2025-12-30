/**
 * @file Command Fixtures - factorial
 * @module fixtures/commands/factorial
 */

import chars from '#enums/chars'
import integer from '#parsers/integer'
import sfmt from '#tests/utils/sfmt'
import c from '@flex-development/colors'
import type {
  SubcommandInfo as CommandInfo,
  ExampleInfo
} from '@flex-development/kronk'

/**
 * The program info for `factorial`.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: {
    description: 'the integer',
    parser: integer,
    syntax: sfmt.required({ id: 'n' })
  },
  description: 'Given an integer, `n`, print `n!`.\n' +
    'https://codewars.com/kata/5694cb0ec554589633000036',
  examples: [
    { comment: '// 1', text: '0' },
    { comment: '// 1', text: '1' },
    { comment: '// 2', text: '2' },
    { comment: '// 6', text: '3' },
    { comment: '// 6227020800', text: '13' },
    { comment: '// show help and exit', text: '--help' }
  ].map((info: ExampleInfo) => {
    if (info.text) info.text = c.yellow(info.text)
    return info.command = c.bold('factorial'), info
  }),
  name: 'factorial',
  usage: { options: null },
  version: chars.empty
}
