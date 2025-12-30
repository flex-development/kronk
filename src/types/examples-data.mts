/**
 * @file Type Aliases - ExamplesData
 * @module kronk/types/ExamplesData
 */

import type { ExampleInfo, List } from '@flex-development/kronk'

/**
 * Union of types used to configure command examples.
 *
 * @see {@linkcode ExampleInfo}
 * @see {@linkcode List}
 */
type ExamplesData =
  | ExampleInfo
  | List<ExampleInfo | readonly string[] | string>
  | readonly string[]
  | string

export type { ExamplesData as default }
