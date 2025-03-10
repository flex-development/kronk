/**
 * @file Command Fixtures - dateformat
 * @module fixtures/commands/dateformat
 */

import chars from '#enums/chars'
import process from '#fixtures/process'
import sfmt from '#tests/utils/sfmt'
import type { CommandInfo } from '@flex-development/kronk'
import { masks } from 'dateformat'

/**
 * `dateformat` program info.
 *
 * @type {CommandInfo}
 */
export default {
  arguments: [
    {
      description: 'date string or timestamp',
      syntax: sfmt.optional({ id: 'date' })
    }
  ],
  description: 'https://github.com/felixge/node-dateformat',
  options: [
    {
      conflicts: 'utc',
      default: { value: false },
      description: 'convert local time to gmt time',
      flags: '-g | --gmt'
    },
    {
      choices: Object.keys(masks).sort((a, b) => a.localeCompare(b)),
      default: { value: masks.default },
      description: 'date format',
      flags: '-m --mask' + chars.space + sfmt.required(),
      parser: mask
    },
    {
      conflicts: 'gmt',
      default: { value: false },
      description: 'convert local time to utc time',
      flags: '-u | --utc'
    }
  ],
  process,
  subcommands: {
    aliases: 'tz',
    arguments: {
      description: 'date string',
      syntax: sfmt.optional({ id: 'date' })
    },
    description: 'get proper timezone abbreviation or timezone offset',
    name: 'timezone'
  }
} as CommandInfo

/**
 * @this {void}
 *
 * @param {string} value
 *  The value to parse
 * @return {string}
 *  Date format mask
 */
function mask(this: void, value: string): string {
  return value in masks ? masks[value]! : masks.default
}
