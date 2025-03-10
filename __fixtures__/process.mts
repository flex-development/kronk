/**
 * @file Fixtures - process
 * @module fixtures/process
 */

import type { CommandError, ExitCode, Process } from '@flex-development/kronk'

/**
 * Object containing information about the current process.
 *
 * @type {Process}
 */
export default {
  argv: [],
  env: { PWD: process.env.PWD },
  exit: vi.fn(exit).mockName('process.exit') as unknown as Process['exit'],
  stderr: { write: vi.fn().mockName('process.stderr.write') },
  stdout: { write: vi.fn().mockName('process.stdout.write') }
} as Process

/**
 * @see {@linkcode CommandError}
 * @see {@linkcode ExitCode}
 *
 * @this {void}
 *
 * @param {ExitCode | null | undefined} code
 *  Exit status code
 * @param {CommandError | null | undefined} [e]
 *  Command error
 * @return {never | undefined}
 *  Never
 * @throws {CommandError}
 */
function exit(
  this: void,
  code: ExitCode | null | undefined,
  e?: CommandError | null | undefined
): never | undefined {
  if (e) throw e
  return void e
}
