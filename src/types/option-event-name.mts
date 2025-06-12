/**
 * @file Type Aliases - OptionEventName
 * @module kronk/types/OptionEventName
 */

import type { OptionEventNameMap } from '@flex-development/kronk'

/**
 * Union of registered option event names.
 *
 * To register custom event names, augment {@linkcode OptionEventNameMap}. They
 * will be added to this union automatically.
 */
type OptionEventName = OptionEventNameMap[keyof OptionEventNameMap]

export type { OptionEventName as default }
