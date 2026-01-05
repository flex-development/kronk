/**
 * @file Command Fixtures - copy
 * @module fixtures/commands/copy
 */

import chars from '#enums/chars'
import file from '#tests/parsers/file'
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
      parser: file,
      syntax: sfmt.required({ id: 'source' })
    },
    {
      default: { value: chars.dot },
      description: 'the file or folder to copy the source file to',
      parser: file,
      syntax: sfmt.optional({ id: 'dest' })
    }
  ],
  async: true as const,
  description: 'copy a file.',
  name: 'copy',
  version: '0.0.1'
}
