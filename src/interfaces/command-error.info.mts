/**
 * @file Interfaces - CommandErrorInfo
 * @module kronk/interfaces/CommandErrorInfo
 */

import type { KronkErrorInfo } from '@flex-development/kronk'

/**
 * Data used to create command errors.
 *
 * @see {@linkcode KronkErrorInfo}
 *
 * @extends {KronkErrorInfo}
 */
interface CommandErrorInfo extends KronkErrorInfo {
  /**
   * Unique id representing the error.
   *
   * @override
   */
  id: string
}

export type { CommandErrorInfo as default }
