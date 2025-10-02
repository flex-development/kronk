/**
 * @file Type Aliases - OptionsData
 * @module kronk/types/OptionsData
 */

import type { Flags, List, OptionInfo } from '@flex-development/kronk'

/**
 * Union of types used to create command options.
 *
 * @see {@linkcode Flags}
 * @see {@linkcode List}
 * @see {@linkcode OptionInfo}
 */
type OptionsData =
  | Flags
  | List<Flags | OptionInfo>
  | OptionInfo

export type { OptionsData as default }
