/**
 * @file Interfaces - KronkEventNameMap
 * @module kronk/interfaces/KronkEventNameMap
 */

import type {
  CommandEventNameMap,
  OptionEventNameMap
} from '@flex-development/kronk'

/**
 * Registry of event names.
 *
 * This interface can be augmented to register custom event names.
 *
 * @see {@linkcode CommandEventNameMap}
 * @see {@linkcode OptionEventNameMap}
 *
 * @example
 *  declare module '@flex-development/kronk' {
 *    interface KronkEventNameMap {
 *      custom: 'kronk:custom'
 *    }
 *  }
 *
 * @extends {CommandEventNameMap}
 * @extends {OptionEventNameMap}
 */
interface KronkEventNameMap extends CommandEventNameMap, OptionEventNameMap {}

export type { KronkEventNameMap as default }
