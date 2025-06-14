/**
 * @file Interfaces - OptionEventNameMap
 * @module kronk/interfaces/OptionEventNameMap
 */

/**
 * Registry of option event names.
 *
 * This interface can be augmented to register custom event names.
 *
 * @example
 *  declare module '@flex-development/kronk' {
 *    interface OptionEventNameMap {
 *      custom: `option.${string}`
 *    }
 *  }
 */
interface OptionEventNameMap {
  option: `option:${string}`
}

export type { OptionEventNameMap as default }
