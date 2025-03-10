/**
 * @file Type Aliases - ArgvSource
 * @module kronk/types/ArgvSource
 */

import type { ArgvSourceMap } from '@flex-development/kronk'

/**
 * Union of registered command-line argument sources.
 *
 * To register custom sources, augment {@linkcode ArgvSourceMap}. They will be
 * added to this union automatically.
 */
type ArgvSource = ArgvSourceMap[keyof ArgvSourceMap]

export type { ArgvSource as default }
