/**
 * @file Interfaces - CommandEventNameMap
 * @module kronk/interfaces/CommandEventNameMap
 */

/**
 * Registry of command event names.
 *
 * This interface can be augmented to register custom event names.
 *
 * @example
 *  declare module '@flex-development/kronk' {
 *    interface CommandEventNameMap {
 *      custom: `command.${string}`
 *    }
 *  }
 */
interface CommandEventNameMap {
  command: `command:${string}`
}

export type { CommandEventNameMap as default }
