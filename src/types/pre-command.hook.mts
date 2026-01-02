/**
 * @file Type Aliases - PreCommandHook
 * @module kronk/types/PreCommandHook
 */

import type { KronkHookMap } from '@flex-development/kronk'

/**
 * Union of registered `preCommand` hooks.
 *
 * To register custom hooks, augment {@linkcode KronkHookMap}.
 * They will be added to this union automatically.
 */
type PreCommandHook = KronkHookMap['preCommand']

export type { PreCommandHook as default }
