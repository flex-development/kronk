/**
 * @file Command Fixtures - string-util
 * @module fixtures/commands/string-util
 */

import sfmt from '#tests/utils/sfmt'
import { chars } from '@flex-development/fsm-tokenizer'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * `string-util` program info.
 *
 * @type {CommandInfo}
 */
export default {
  description: 'string utilities',
  name: 'string-util',
  options: {
    default: { value: chars.comma },
    description: 'separator character',
    flags: '-s, --separator <char>'
  },
  subcommands: {
    join: {
      arguments: {
        description: 'one or more strings',
        syntax: sfmt.required({ id: 'strings', variadic: true })
      },
      description: 'join several strings into a single string'
    },
    split: {
      arguments: {
        description: 'the string to split',
        syntax: sfmt.required({ id: 'string' })
      },
      description: 'split a string into substrings',
      options: {
        description: 'number of substrings to display',
        flags: '--limit <>'
      }
    }
  }
}
