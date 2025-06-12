/**
 * @file Interfaces - KronkEventNameMap
 * @module kronk/interfaces/KronkEventNameMap
 */

import type { OptionEventNameMap } from '@flex-development/kronk'

/**
 * Registry of event names.
 *
 * This interface can be augmented to register custom event names.
 *
 * @see {@linkcode OptionEventNameMap}
 *
 * @example
 *  declare module '@flex-development/kronk' {
 *    interface KronkEventNameMap {
 *      custom: `command:custom`
 *    }
 *  }
 *
 * @extends {OptionEventNameMap}
 */
interface KronkEventNameMap extends OptionEventNameMap {}

export type { KronkEventNameMap as default }
