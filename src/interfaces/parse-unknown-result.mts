/**
 * @file Interfaces - ParseUnknownResult
 * @module kronk/interfaces/ParseUnknownResult
 */

/**
 * The result of parsing unknown arguments.
 */
interface ParseUnknownResult {
  /**
   * List of arguments that are operands (not options or values).
   */
  operands: string[]

  /**
   * List containing the first unknown option
   * and any remaining unknown arguments.
   */
  unknown: string[]
}

export type { ParseUnknownResult as default }
