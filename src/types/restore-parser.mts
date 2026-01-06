/**
 * @file Type Aliases - RestoreParser
 * @module kronk/types/RestoreParser
 */

import type { Awaitable } from '@flex-development/kronk'

/**
 * Restore parser state.
 *
 * @see {@linkcode Awaitable}
 *
 * @this {void}
 *
 * @return {Awaitable<null | undefined | void>}
 */
type RestoreParser = (this: void) => Awaitable<null | undefined | void>

export type { RestoreParser as default }
