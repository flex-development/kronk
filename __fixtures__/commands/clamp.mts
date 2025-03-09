/**
 * @file Command Fixtures - clamp
 * @module fixtures/commands/clamp
 */

import process from '#fixtures/process'
import sfmt from '#tests/utils/sfmt'
import type { CommandInfo } from '@flex-development/kronk'

/**
 * `clamp` program info.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: [
    {
      description: 'the number to clamp',
      parser: int,
      syntax: sfmt.required({ id: 'n' })
    }
  ],
  description: 'clamp a number within a given range',
  name: 'clamp',
  options: [
    {
      default: { value: false },
      flags: '--debug'
    },
    {
      default: { value: Number.MAX_SAFE_INTEGER },
      description: 'upper bound (inclusive)',
      flags: '-M | --max <n>',
      parser: int
    },
    {
      default: { value: 0 },
      description: 'lower bound (inclusive)',
      flags: '-m | --min <n>',
      parser: int
    }
  ],
  process
} as CommandInfo

/**
 * @this {void}
 *
 * @param {string} value
 *  The value to parse
 * @return {number}
 *  The integer parsed from `value`
 */
function int(this: void, value: string): number {
  return Number.parseInt(value)
}
