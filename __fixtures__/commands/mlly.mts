/**
 * @file Command Fixtures - mlly
 * @module fixtures/commands/mlly
 */

import unique from '#parsers/unique'
import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'
import { canParseUrl, defaultConditions, toUrl } from '@flex-development/mlly'
import type {} from '@flex-development/pkg-types'

/**
 * The program info for `mlly`.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  description: 'ecmascript module utilities',
  name: 'mlly',
  options: [
    {
      flags: '-d | --debug'
    },
    {
      description: 'the parent module url',
      flags: '-p | --parent <!>',
      parser: url
    }
  ],
  subcommands: {
    resolve: {
      arguments: [
        {
          description: 'the module specifier to resolve',
          syntax: sfmt.required({ id: 'specifier' })
        }
      ],
      name: 'resolve',
      options: [
        {
          default: { description: 'node,import', value: defaultConditions },
          description: 'list of export/import conditions',
          flags: '-c | --conditions <...>',
          parser: unique
        },
        {
          description: 'whether to keep symlinks instead of resolving them',
          flags: '--ps | --preserve-symlinks'
        }
      ],
      summary: 'resolve modules'
    }
  },
  version: '1.0.0-alpha.20'
}

/**
 * @this {void}
 *
 * @param {string} value
 *  The value to parse
 * @return {URL}
 *  The `URL` parsed from `value`
 */
function url(this: void, value: string): URL {
  if (canParseUrl(value)) new URL(value)
  return toUrl(value)
}
