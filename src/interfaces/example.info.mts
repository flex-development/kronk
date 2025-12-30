/**
 * @file Interfaces - ExampleInfo
 * @module kronk/interfaces/ExampleInfo
 */

import type { CommandName } from '@flex-development/kronk'

/**
 * Command example info.
 */
interface ExampleInfo {
  /**
   * The command name or names to use,
   * with `false` used to omit the command name.
   *
   * @see {@linkcode CommandName}
   */
  command?: CommandName | readonly CommandName[] | false | undefined

  /**
   * A comment to append to the example {@linkcode text}.
   */
  comment?: string | null | undefined

  /**
   * Environment variable usage,
   * to be prepended to the example {@linkcode text}.
   */
  env?: readonly string[] | string | null | undefined

  /**
   * The example text.
   */
  text: readonly string[] | string
}

export type { ExampleInfo as default }
