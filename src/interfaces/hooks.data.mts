/**
 * @file Interfaces - HooksData
 * @module kronk/interfaces/HooksData
 */

import type {
  List,
  PostActionHook,
  PreActionHook,
  PreCommandHook
} from '@flex-development/kronk'

/**
 * Data transfer object for hooks.
 */
interface HooksData {
  /**
   * The callback, or callbacks, to fire immediately
   * after the running command's action.
   *
   * @see {@linkcode PostActionHook}
   */
  postAction?: PostActionHook | List<PostActionHook> | null | undefined

  /**
   * The callback, or callbacks, to fire immediately
   * before the running command's action.
   *
   * @see {@linkcode PreActionHook}
   */
  preAction?: PreActionHook | List<PreActionHook> | null | undefined

  /**
   * The callback, or callbacks, to fire before a subcommand is ran.
   *
   * @see {@linkcode PreCommandHook}
   */
  preCommand?: PreCommandHook | List<PreCommandHook> | null | undefined
}

export type { HooksData as default }
