/**
 * @file Command Fixtures - string-util
 * @module fixtures/commands/string-util
 */

import process from '#fixtures/process'
import sfmt from '#tests/utils/sfmt'
import type { CommandInfo } from '@flex-development/kronk'

/**
 * `string-util` program info.
 *
 * @type {CommandInfo}
 */
export default {
  description: 'string utilities',
  name: 'string-util',
  options: {
    default: { value: ',' },
    description: 'separator character',
    flags: '-s, --separator <char>'
  },
  process,
  subcommands: [
    {
      arguments: [
        {
          description: 'one or more strings',
          syntax: sfmt.required({ id: 'strings', variadic: true })
        }
      ],
      description: 'join several strings into a single string',
      name: 'join'
    },
    {
      arguments: [
        {
          description: 'string to split',
          syntax: sfmt.required({ id: 'string' })
        }
      ],
      description: 'split a string into substrings',
      name: 'split',
      options: {
        description: 'number of substrings to display',
        flags: '--limit <>'
      }
    }
  ]
} as CommandInfo
