/**
 * @file Type Aliases - OptionValueSource
 * @module kronk/types/OptionValueSource
 */

import type { OptionValueSourceMap } from '@flex-development/kronk'

/**
 * Union of registered option value sources.
 *
 * To register custom sources, augment {@linkcode OptionValueSourceMap}. They
 * will be added to this union automatically.
 */
type OptionValueSource = OptionValueSourceMap[keyof OptionValueSourceMap]

export type { OptionValueSource as default }
