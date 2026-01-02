/**
 * @file Type Aliases - KronkHookName
 * @module kronk/types/KronkHookName
 */

import type { KronkHookMap } from '@flex-development/kronk'

/**
 * Union of registered hook names.
 *
 * To register custom hook names, augment {@linkcode KronkHookMap}.
 * They will be added to this union automatically.
 */
type KronkHookName = Extract<keyof KronkHookMap, string>

export type { KronkHookName as default }
