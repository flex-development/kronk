/**
 * @file Command Fixtures - average
 * @module fixtures/commands/average
 */

import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * `average` program info.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: sfmt.optional({ id: 'num', variadic: true }),
  name: 'average'
}
