declare module '@flex-development/kronk' {
  import type { CommandError, ExitCode } from '@flex-development/kronk'

  interface CommandData {
    /**
     * Object containing information about the current process.
     *
     * @internal
     *
     * @see {@linkcode Process}
     */
    process?: Process | null | undefined
  }

  interface Process {
    /**
     * Terminate the process synchronously with an exit status of `code`.
     * If `code` is omitted, `exit` uses either the 'success' code `0` or the
     * value of {@linkcode exitCode} if it has been set.
     *
     * @see {@linkcode ExitCode}
     *
     * @internal
     *
     * @param {ExitCode | null | undefined} code
     *  Exit status code
     * @param {CommandError | null | undefined} e
     *  Command error
     * @return {never}
     */
    exit(
      code: ExitCode | null | undefined,
      e: CommandError | null | undefined
    ): never
  }
}

export {}
