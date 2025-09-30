/**
 * @file Interfaces - Process
 * @module kronk/interfaces/Process
 */

import type { ExitCode, ExitProcess, ProcessEnv } from '@flex-development/kronk'
import type { WriteStream } from '@flex-development/log'

/**
 * Object containing information about the current process.
 */
interface Process {
  /**
   * List of command-line arguments passed when the process was launched.
   */
  argv: string[]

  /**
   * Object containing information about the user environment.
   *
   * @see {@linkcode ProcessEnv}
   */
  env: ProcessEnv

  /**
   * Terminate the process synchronously with an exit status of `code`.
   *
   * If `code` is omitted, `exit` uses either the 'success' code `0` or the
   * value of {@linkcode exitCode} if it has been set.
   *
   * @see {@linkcode ExitProcess}
   */
  exit: ExitProcess

  /**
   * The exit code to use when the process exits gracefully, or is exited via
   * {@linkcode exit} without specifying a code.
   *
   * @see {@linkcode ExitCode}
   */
  exitCode?: ExitCode | null | undefined

  /**
   * The writeable stream for standard error output.
   *
   * @see {@linkcode WriteStream}
   */
  stderr: WriteStream

  /**
   * The writeable stream for standard output.
   *
   * @see {@linkcode WriteStream}
   */
  stdout: WriteStream
}

export type { Process as default }
