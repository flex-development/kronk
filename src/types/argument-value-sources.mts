/**
 * @file Type Aliases - ArgumentValueSources
 * @module kronk/types/ArgumentValueSources
 */

import type { ArgumentValueSource } from '@flex-development/kronk'

/**
 * List, where each index is the position of a command-argument
 * and each value is the source of the argument value.
 *
 * @see {@linkcode ArgumentValueSource}
 */
type ArgumentValueSources = (ArgumentValueSource | undefined)[]

export type { ArgumentValueSources as default }
