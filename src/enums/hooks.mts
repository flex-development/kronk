/**
 * @file Enums - hooks
 * @module kronk/enums/hooks
 */

import type { KronkHookName } from '@flex-development/kronk'

/**
 * Default hook names.
 *
 * @see {@linkcode KronkHookName}
 *
 * @internal
 *
 * @enum {KronkHookName}
 */
const enum hooks {
  postAction = 'postAction',
  preAction = 'preAction',
  preCommand = 'preCommand'
}

export default hooks
