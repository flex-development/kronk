/**
 * @file Command Fixtures - average
 * @module fixtures/commands/average
 */

import process from '#fixtures/process'
import sfmt from '#tests/utils/sfmt'
import type { CommandInfo } from '@flex-development/kronk'

/**
 * `average` program info.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: sfmt.optional({ id: 'num', variadic: true }),
  name: 'average',
  process
} as CommandInfo
