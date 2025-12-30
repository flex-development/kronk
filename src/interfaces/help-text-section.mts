/**
 * @file Interfaces - HelpTextSection
 * @module kronk/interfaces/HelpTextSection
 */

/**
 * An object representing a help text section.
 *
 * @internal
 */
interface HelpTextSection {
  /**
   * The section content.
   */
  content: readonly string[] | string | null | undefined

  /**
   * The title of the section.
   */
  title?: string | null | undefined
}

export type { HelpTextSection as default }
