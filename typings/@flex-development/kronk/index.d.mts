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
     * Whether the `parseAsync` method should be called instead of `parse`
     * during testing.
     *
     * @internal
     */
    async?: true
  }

  interface SubcommandInfo {
    /**
     * Information about the current process.
     *
     * @internal
     *
     * @override
     */
    process?: null | undefined
  }
}

export {}
