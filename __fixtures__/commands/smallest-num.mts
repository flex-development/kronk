/**
 * @file Command Fixtures - smallest-num
 * @module fixtures/commands/smallest-num
 */

import uniq from '#parsers/uniq'
import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `smallest-num`.
 *
 * @type {CommandInfo}
 */
export default {
  aliases: 'sn',
  arguments: {
    parser: uniq(),
    syntax: sfmt.required({ id: 'numbers', variadic: true })
  },
  description: 'find the smallest number.',
  name: 'smallest-num',
  version: '1.2.0'
}
