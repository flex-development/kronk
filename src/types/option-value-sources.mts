/**
 * @file Type Aliases - OptionValueSources
 * @module kronk/types/OptionValueSources
 */

import type { Option, OptionValueSource } from '@flex-development/kronk'

/**
 * Record, where each key is an option key ({@linkcode Option.key}) and each
 * value is an {@linkcode OptionValueSource}.
 */
type OptionValueSources = {
  [x: Option['key']]: OptionValueSource | null | undefined
}

export type { OptionValueSources as default }
