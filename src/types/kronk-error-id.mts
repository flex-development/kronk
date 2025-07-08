/**
 * @file Type Aliases - KronkErrorId
 * @module kronk/types/KronkErrorId
 */

import type { KronkErrorMap } from '@flex-development/kronk'

/**
 * Union of registered error ids.
 *
 * To register custom error ids, augment {@linkcode KronkErrorMap}. They will be
 * added to this union automatically.
 */
type KronkErrorId = `kronk/${keyof KronkErrorMap}`

export type { KronkErrorId as default }
