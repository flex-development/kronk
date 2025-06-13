/**
 * @file Command Fixtures - mlly
 * @module fixtures/commands/mlly
 */

import sfmt from '#tests/utils/sfmt'
import { faker } from '@faker-js/faker'
import type { CommandInfo } from '@flex-development/kronk'
import * as mlly from '@flex-development/mlly'
import { SemVer } from 'semver'

/**
 * `mlly` program info.
 *
 * @type {CommandInfo}
 */
export default {
  description: 'ecmascript module utilities',
  name: 'mlly',
  options: [
    {
      description: 'module id of current working directory',
      env: 'PWD',
      flags: '--cwd <!>',
      parser: url
    },
    {
      default: { value: false },
      flags: '-d | --debug'
    },
    {
      description: 'url of parent module',
      flags: '-p | --parent <!>',
      parser: url
    }
  ],
  subcommands: [
    {
      arguments: [
        {
          description: 'the module specifier to resolve',
          syntax: sfmt.required({ id: 'specifier' })
        }
      ],
      name: 'resolve',
      options: [
        {
          default: {
            description: 'node,import',
            value: mlly.defaultConditions
          },
          description: 'list of export/import conditions',
          flags: '-c | --conditions <...>',
          parser: unique
        },
        {
          default: { value: false },
          description: 'keep symlinks instead of resolving them',
          flags: '--ps | --preserve-symlinks'
        }
      ],
      version: new SemVer(faker.system.semver())
    }
  ]
} as CommandInfo

/**
 * @this {void}
 *
 * @param {string[]} value
 *  The value to parse
 * @return {Set<string>}
 *  Unique list created from `value`
 */
function unique(this: void, value: string[]): Set<string> {
  return new Set<string>(value)
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
  if (mlly.canParseUrl(value)) new URL(value)
  return mlly.toUrl(value)
}
