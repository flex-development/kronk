/**
 * @file Type Aliases - CommandEventName
 * @module kronk/types/CommandEventName
 */

import type { CommandEventNameMap } from '@flex-development/kronk'

/**
 * Union of registered command event names.
 *
 * To register custom event names, augment {@linkcode CommandEventNameMap}.
 * They will be added to this union automatically.
 */
type CommandEventName = CommandEventNameMap[keyof CommandEventNameMap]

export type { CommandEventName as default }
