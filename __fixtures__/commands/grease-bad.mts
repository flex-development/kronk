/**
 * @file Command Fixtures - greaseBad
 * @module fixtures/commands/greaseBad
 */

import grease from '#fixtures/commands/grease'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `grease` with invalid configurations.
 *
 * @type {CommandInfo}
 */
export default Object.assign({}, grease, {
  options: grease.options.map(info => {
    if (!info.flags.endsWith('--json')) return info
    return { ...info, implies: { LEVEL: 'log' } }
  }),
  subcommands: Object.assign({}, grease.subcommands, {
    info: {
      ...grease.subcommands.info,
      options: grease.subcommands.info.options.map(info => {
        if (!info.flags.includes('--markdown')) return info
        return { ...info, implies: { level: 'log' } }
      })
    }
  })
})
