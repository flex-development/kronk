/**
 * @file Type Aliases - OptionPriority
 * @module kronk/types/OptionPriority
 */

/**
 * Union of strategies used when merging global and local options.
 *
 * - `global`: global options overwrite local options
 * - `local`: local options overwrite global options
 */
type OptionPriority = 'global' | 'local'

export type { OptionPriority as default }
