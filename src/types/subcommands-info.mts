/**
 * @file Type Aliases - SubcommandsInfo
 * @module kronk/types/SubcommandsInfo
 */

import type { CommandInfo } from '@flex-development/kronk'

/**
 * Record, where each key is a subcommand name and each value is an info object.
 *
 * @see {@linkcode CommandInfo}
 */
type SubcommandsInfo = { [subcommand: string]: CommandInfo }

export type { SubcommandsInfo as default }
