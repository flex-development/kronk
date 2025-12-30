/**
 * @file Command Fixtures - copy
 * @module fixtures/commands/copy
 */

import chars from '#enums/chars'
import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `copy`.
 *
 * @type {CommandInfo}
 */
export default {
  aliases: 'cp',
  arguments: [
    {
      description: 'the file to copy',
      syntax: sfmt.required({ id: 'source' })
    },
    {
      default: { value: chars.dot },
      description: 'the file or folder to copy the source file to',
      syntax: sfmt.optional({ id: 'dest' })
    }
  ],
  description: 'copy a file.',
  name: 'copy',
  version: '0.0.1'
}
