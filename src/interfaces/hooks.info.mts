/**
 * @file Interfaces - HooksInfo
 * @module kronk/interfaces/HooksInfo
 */

import type {
  HooksData,
  PostActionHook,
  PreActionHook,
  PreCommandHook
} from '@flex-development/kronk'

/**
 * Command hooks info.
 *
 * Each key is the name of a hook and each value is a hook function list.
 *
 * @see {@linkcode HooksData}
 *
 * @extends {HooksData}
 */
interface HooksInfo extends HooksData {
  /**
   * The callbacks to fire immediately after the running command's action.
   *
   * @see {@linkcode PostActionHook}
   *
   * @override
   */
  postAction: PostActionHook[]

  /**
   * The callbacks to fire immediately before the running command's action.
   *
   * @see {@linkcode PreActionHook}
   *
   * @override
   */
  preAction: PreActionHook[]

  /**
   * The callback, or callbacks, to fire before a subcommand is ran.
   *
   * @see {@linkcode PreCommandHook}
   *
   * @override
   */
  preCommand: PreCommandHook[]
}

export type { HooksInfo as default }
