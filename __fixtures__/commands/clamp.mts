/**
 * @file Command Fixtures - clamp
 * @module fixtures/commands/clamp
 */

import bool from '#parsers/bool'
import number from '#parsers/number'
import sfmt from '#tests/utils/sfmt'
import { chars } from '@flex-development/fsm-tokenizer'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * `clamp` program info.
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
  name: 'clamp',
  options: [
    {
      choices: bool.choices,
      env: 'CLAMP_DEBUG',
      flags: '-d | --debug [choice]',
      parser: bool(),
      preset: chars.digit1
    },
    {
      default: { value: Number.MAX_SAFE_INTEGER },
      description: 'upper bound (inclusive)',
      flags: '-M | --max <n>',
      parser: number
    },
    {
      default: { value: 0 },
      description: 'lower bound (inclusive)',
      flags: '-m | --min <n>',
      parser: number
    }
  ]
}
