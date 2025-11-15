/**
 * @file Interfaces - ExampleInfo
 * @module kronk/interfaces/ExampleInfo
 */

/**
 * Command example info.
 */
interface ExampleInfo {
  /**
   * The example {@linkcode text} prefix.
   */
  prefix?: string | null | undefined

  /**
   * The example text.
   */
  text: string
}

export type { ExampleInfo as default }
