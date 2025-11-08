/**
 * @file Type Aliases - HelpCommandData
 * @module kronk/types/HelpCommandData
 */

import type { Command, SubcommandInfo } from '@flex-development/kronk'

/**
 * Union of types used to configure the help subcommand.
 *
 * The help subcommand can be customized with a `Command` instance, subcommand
 * info object, or a subcommand name. It can also be disabled (`false`).
 *
 * @see {@linkcode Command}
 * @see {@linkcode SubcommandInfo}
 */
type HelpCommandData = Command | SubcommandInfo | string | false

export type { HelpCommandData as default }
