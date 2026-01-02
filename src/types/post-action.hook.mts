/**
 * @file Type Aliases - PostActionHook
 * @module kronk/types/PostActionHook
 */

import type { KronkHookMap } from '@flex-development/kronk'

/**
 * Union of registered `postAction` hooks.
 *
 * To register custom hooks, augment {@linkcode KronkHookMap}.
 * They will be added to this union automatically.
 */
type PostActionHook = KronkHookMap['postAction']

export type { PostActionHook as default }
