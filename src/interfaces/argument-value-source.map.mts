/**
 * @file Interfaces - ArgumentValueSourceMap
 * @module kronk/interfaces/ArgumentValueSourceMap
 */

/**
 * Registry of command-argument value sources.
 */
interface ArgumentValueSourceMap {
  /**
   * The argument value was specified on the command line.
   */
  cli: 'cli'

  /**
   * The argument value came from a default value configuration.
   */
  default: 'default'
}

export type { ArgumentValueSourceMap as default }
