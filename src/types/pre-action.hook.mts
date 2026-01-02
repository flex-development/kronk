/**
 * @file Type Aliases - PreActionHook
 * @module kronk/types/PreActionHook
 */

import type { KronkHookMap } from '@flex-development/kronk'

/**
 * Union of registered `preAction` hooks.
 *
 * To register custom hooks, augment {@linkcode KronkHookMap}.
 * They will be added to this union automatically.
 */
type PreActionHook = KronkHookMap['preAction']

export type { PreActionHook as default }
