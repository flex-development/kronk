/**
 * @file Type Aliases - OptionValues
 * @module kronk/types/OptionValues
 */

import type { Option } from '@flex-development/kronk'

/**
 * Record, where each key is an option key
 * and each value is the parsed option value.
 *
 * @see {@linkcode Option.key}
 *
 * @template {any} [T=any]
 *  The parsed option value
 */
type OptionValues<T = any> = { [x: Option['key']]: T }

export type { OptionValues as default }
