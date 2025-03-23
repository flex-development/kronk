/**
 * @file Command Fixtures - tribonacci
 * @module fixtures/commands/tribonacci
 */

import chars from '#enums/chars'
import digits from '#fixtures/digits'
import sfmt from '#tests/utils/sfmt'
import type { CommandInfo } from '@flex-development/kronk'

/**
 * `tribonacci` program info.
 *
 * @type {CommandInfo}
 */
export default {
  name: 'tribonacci',
  subcommands: {
    arguments: [
      {
        choices: digits,
        description: 'first value in starting sequence',
        syntax: sfmt.required({ id: chars.lowercaseA })
      },
      {
        choices: digits,
        description: 'second value in starting sequence',
        syntax: sfmt.required({ id: chars.lowercaseB })
      },
      {
        choices: digits,
        description: 'third value in starting sequence',
        syntax: sfmt.required({ id: chars.lowercaseC })
      }
    ],
    default: true,
    options: [
      '-d | --debug',
      {
        choices: digits.filter(digit => digit !== chars.digit0),
        description: 'number of values to include in new sequence',
        flags: '-n' + chars.ht + sfmt.required({ mandatory: true })
      }
    ]
  }
} as CommandInfo
