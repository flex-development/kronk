/**
 * @file Command Fixtures - distinct
 * @module fixtures/commands/distinct
 */

import chars from '#enums/chars'
import unique from '#parsers/unique'
import sfmt from '#tests/utils/sfmt'
import c from '@flex-development/colors'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `distinct`.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: {
    default: {
      description: c.redBright('new') + chars.space + c.blueBright('Set()'),
      value: new Set()
    },
    description: 'the list of numbers',
    parser: unique,
    syntax: sfmt.optional({ id: 'numbers', variadic: true })
  },
  description: 'print a list of numbers with all duplicates removed.\n' +
    'https://codewars.com/kata/57a5b0dfcf1fa526bb000118',
  examples: [
    { command: false as const, comment: '//', text: '' },
    { command: false as const, comment: '// 1', text: '1' },
    { command: false as const, comment: '// 1 3', text: '3 1 3' },
    { command: false as const, comment: '// show help', text: '--help' }
  ].map(info => (info.text && (info.text = c.cyan(info.text)), info)),
  name: 'distinct',
  usage: { options: null }
}
