/**
 * @file Command Fixtures - greaseBad
 * @module fixtures/commands/greaseBad
 */

import grease from '#fixtures/commands/grease'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * `grease` program info with invalid configurations.
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
        if (!info.flags.endsWith('--markdown')) return info
        return { ...info, implies: { logLevel: 'log' } }
      })
    }
  })
})
