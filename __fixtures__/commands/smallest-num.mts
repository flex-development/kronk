/**
 * @file Command Fixtures - smallest-num
 * @module fixtures/commands/smallest-num
 */

import unique from '#parsers/unique'
import sfmt from '#tests/utils/sfmt'
import { faker } from '@faker-js/faker'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * `smallest-num` program info.
 *
 * @type {CommandInfo}
 */
export default {
  aliases: 'sn',
  arguments: {
    parser: unique,
    syntax: sfmt.required({ id: 'numbers', variadic: true })
  },
  description: 'find the smallest number',
  name: 'smallest-num',
  version: faker.system.semver()
}
