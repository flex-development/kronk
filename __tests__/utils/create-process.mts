/**
 * @file Test Utilities - createProcess
 * @module tests/utils/createProcess
 */

import type { Process, ProcessEnv } from '@flex-development/kronk'

/**
 * Create a mock process object.
 *
 * @this {void}
 *
 * @param {ProcessEnv | null | undefined} [env]
 *  Information about the user environment
 * @return {Process}
 *  Information about the current process
 */
function createProcess(
  this: void,
  env?: ProcessEnv | null | undefined
): Process {
  return {
    argv: [],
    env: { ...env },
    exit: vi.fn().mockName('process.exit'),
    stderr: { write: vi.fn().mockName('process.stderr.write') },
    stdout: { write: vi.fn().mockName('process.stdout.write') }
  }
}

export default createProcess
