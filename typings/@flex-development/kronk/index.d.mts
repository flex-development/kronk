import type { Process } from '@flex-development/kronk'

declare module '@flex-development/kronk' {
  interface CommandData {
    /**
     * Information about the current process.
     *
     * @internal
     *
     * @see {@linkcode Process}
     */
    process?: Process | null | undefined
  }

  interface CommandInfo {
    /**
     * Whether the command {@linkcode action} is expected to be overridden
     * during testing (e.g. testing `--version`).
     *
     * @internal
     */
    actionOverride?: true

    /**
     * Whether the `parseAsync` method should be called instead of `parse`
     * during testing.
     *
     * @internal
     */
    async?: true

    /**
     * Whether help text is expected to be printed during testing.
     *
     * @internal
     */
    helpText?: true
  }
}

export {}
