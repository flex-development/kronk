/**
 * @file Interfaces - CommandErrorSnapshot
 * @module kronk/interfaces/CommandErrorSnapshot
 */

import type { CommandSnapshot, KronkErrorJson } from '@flex-development/kronk'

/**
 * Command error overview.
 *
 * @see {@linkcode KronkErrorJson}
 *
 * @extends {KronkErrorJson}
 */
interface CommandErrorSnapshot extends KronkErrorJson {
  /**
   * An overview of the failed command.
   *
   * @see {@linkcode CommandSnapshot}
   */
  command: CommandSnapshot | null
}

export type { CommandErrorSnapshot as default }
