/**
 * @file Command Fixtures - semver
 * @module fixtures/commands/semver
 */

import unique from '#parsers/unique'
import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `semver`.
 *
 * @type {CommandInfo}
 */
export default {
  description: 'Utilities for semantic versioning.',
  examples: [],
  name: 'semver',
  options: [],
  subcommands: {
    parse: {
      arguments: {
        description: 'the string to parse',
        syntax: sfmt.required({ id: 'string' })
      },
      default: true,
      description: 'Attempt to parse a string as a semantic version.',
      options: {
        description: 'whether to interpret versions loosely',
        flags: '-l, --loose'
      },
      summary: 'semantic version parser',
      version: '3.2.1'
    },
    satisfies: {
      arguments: [
        {
          description: 'the version to check',
          syntax: sfmt.required({ id: 'version' })
        },
        {
          description: 'the range to check `version` against',
          syntax: sfmt.required({ id: 'range' })
        }
      ],
      description: 'Check if `version` satisfies the given `range`.',
      subcommands: {
        max: {
          arguments: [
            {
              description: 'the range to check `versions` against',
              syntax: sfmt.required({ id: 'range' })
            },
            {
              description: 'the versions to check',
              parser: unique,
              syntax: sfmt.required({ id: 'versions', variadic: true })
            }
          ],
          description: 'Get the highest `version` satisfying `range`.',
          summary: 'get the highest version satisfying a range',
          version: '1.3.2'
        }
      },
      summary: 'check if a version satisfies a range'
    }
  },
  version: '3.4.5'
}
