/**
 * @file Type Aliases - ArgumentValueSource
 * @module kronk/types/ArgumentValueSource
 */

import type { ArgumentValueSourceMap } from '@flex-development/kronk'

/**
 * Union of registered command-argument value sources.
 *
 * To register custom sources, augment {@linkcode ArgumentValueSourceMap}.
 * They will be added to this union automatically.
 */
type ArgumentValueSource = ArgumentValueSourceMap[keyof ArgumentValueSourceMap]

export type { ArgumentValueSource as default }
