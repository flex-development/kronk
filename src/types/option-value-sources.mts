/**
 * @file Type Aliases - OptionValueSources
 * @module kronk/types/OptionValueSources
 */

import type { Option, OptionValueSource } from '@flex-development/kronk'

/**
 * Record, where each key is an option key
 * and each value is the source of the option value.
 *
 * @see {@linkcode Option.key}
 * @see {@linkcode OptionValueSource}
 */
type OptionValueSources = { [x: Option['key']]: OptionValueSource }

export type { OptionValueSources as default }
