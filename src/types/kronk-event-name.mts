/**
 * @file Type Aliases - KronkEventName
 * @module kronk/types/KronkEventName
 */

import type { KronkEventNameMap } from '@flex-development/kronk'

/**
 * Union of registered event names.
 *
 * To register custom event names, augment {@linkcode KronkEventNameMap}. They
 * will be added to this union automatically.
 */
type KronkEventName = KronkEventNameMap[keyof KronkEventNameMap]

export type { KronkEventName as default }
