/**
 * @file Type Aliases - ExitProcess
 * @module kronk/types/ExitProcess
 */

import type { ExitCode } from '@flex-development/kronk'

/**
 * Terminate the process synchronously with an exit status of `code`.
 *
 * If `code` is omitted, `exit` uses either the 'success' code `0` or the value
 * of `process.exitCode` if it has been set.
 *
 * @see {@linkcode ExitCode}
 *
 * @param {ExitCode | null | undefined} [code]
 *  Exit status code
 * @return {undefined}
 */
type ExitProcess = (code?: ExitCode | null | undefined) => undefined

export type { ExitProcess as default }
