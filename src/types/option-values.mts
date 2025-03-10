/**
 * @file Type Aliases - OptionValues
 * @module kronk/types/OptionValues
 */

import type { Option } from '@flex-development/kronk'

/**
 * Record, where each key is an option key ({@linkcode Option.key}) and each
 * value is a parsed option value.
 *
 * @template {any} [T=any]
 *  Parsed option value type
 */
type OptionValues<T = any> = { [x: Option['key']]: T }

export type { OptionValues as default }
