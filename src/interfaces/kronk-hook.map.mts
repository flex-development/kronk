/**
 * @file Interfaces - KronkHookMap
 * @module kronk/interfaces/KronkHookMap
 */

import type { Hook } from '@flex-development/kronk'

/**
 * Registry of hooks.
 *
 * Each key is the name of a hook and each value is a hook function.
 *
 * This interface can be augmented to register custom hooks.
 *
 * @example
 *  declare module '@flex-development/kronk' {
 *    interface KronkHookMap {
 *      customHook: CustomHook
 *    }
 *  }
 */
interface KronkHookMap {
  postAction: Hook
  preAction: Hook
  preCommand: Hook
}

export type { KronkHookMap as default }
