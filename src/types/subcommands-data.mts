/**
 * @file Type Aliases - SubcommandsData
 * @module kronk/types/SubcommandsData
 */

import type { SubcommandInfo, SubcommandsInfo } from '@flex-development/kronk'

/**
 * Union of types used to create subcommands.
 *
 * @see {@linkcode SubcommandInfo}
 * @see {@linkcode SubcommandsInfo}
 */
type SubcommandsData = SubcommandInfo | SubcommandsInfo

export type { SubcommandsData as default }
