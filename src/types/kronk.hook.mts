/**
 * @file Type Aliases - KronkHook
 * @module kronk/types/KronkHook
 */

import type { KronkHookMap } from '@flex-development/kronk'

/**
 * Union of registered hooks.
 *
 * To register custom hooks, augment {@linkcode KronkHookMap}.
 * They will be added to this union automatically.
 */
type KronkHook = KronkHookMap[keyof KronkHookMap]

export type { KronkHook as default }
