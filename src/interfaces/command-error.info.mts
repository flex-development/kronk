/**
 * @file Interfaces - CommandErrorInfo
 * @module kronk/interfaces/CommandErrorInfo
 */

import type {
  Command,
  KronkErrorId,
  KronkErrorInfo
} from '@flex-development/kronk'

/**
 * Data used to create command errors.
 *
 * @see {@linkcode KronkErrorInfo}
 *
 * @extends {KronkErrorInfo}
 */
interface CommandErrorInfo extends KronkErrorInfo {
  /**
   * The command where the error originated.
   *
   * @see {@linkcode Command}
   */
  command?: Command | null | undefined

  /**
   * Unique id representing the error.
   *
   * @see {@linkcode KronkErrorId}
   *
   * @override
   */
  id: KronkErrorId
}

export type { CommandErrorInfo as default }
