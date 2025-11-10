/**
 * @file Interfaces - HelpableInfo
 * @module kronk/interfaces/HelpableInfo
 */

/**
 * Data used to create help text candidates.
 */
interface HelpableInfo {
  /**
   * A description of the candidate.
   *
   * The description can be long or short form text, or a URL pointing to more
   * information about the candidate.
   *
   * @default ''
   */
  description?: URL | string | null | undefined

  /**
   * Whether the candidate should **not** be displayed in help text.
   *
   * @default false
   */
  hidden?: boolean | null | undefined
}

export type { HelpableInfo as default }
