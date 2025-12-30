/**
 * @file Type Aliases - HelpOptionData
 * @module kronk/types/HelpOptionData
 */

import type {
  Flags,
  Option,
  OptionData,
  OptionInfo
} from '@flex-development/kronk'

/**
 * Union of types used to configure the command help option.
 *
 * The command help option can be customized with an `Option` instance, option
 * flags, or an info object. It can also be disabled (`false`).
 *
 * @see {@linkcode Flags}
 * @see {@linkcode Option}
 * @see {@linkcode OptionInfo}
 * @see {@linkcode OptionData}
 */
type HelpOptionData = Flags | Option | OptionInfo | OptionData | boolean

export type { HelpOptionData as default }
