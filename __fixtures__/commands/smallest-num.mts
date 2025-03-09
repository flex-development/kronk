/**
 * @file Command Fixtures - smallestNum
 * @module fixtures/commands/smallestNum
 */

import process from '#fixtures/process'
import sfmt from '#tests/utils/sfmt'
import type { CommandInfo } from '@flex-development/kronk'

/**
 * `smallest-num` program info.
 *
 * @type {CommandInfo}
 */
export default {
  aliases: ['sn'],
  arguments: {
    parser: unique,
    syntax: sfmt.required({ id: 'num', variadic: true })
  },
  description: 'find the smallest number',
  name: 'smallest-num',
  process
} as CommandInfo

/**
 * @this {void}
 *
 * @param {string[]} value
 *  The value to parse
 * @return {Set<number>}
 *  Unique list created from `value`
 */
function unique(this: void, value: string[]): Set<number> {
  return new Set(value.map(str => +str))
}
