/**
 * @file Interfaces - ArgvSourceMap
 * @module kronk/interfaces/ArgvSourceMap
 */

/**
 * Registry of command-line argument sources.
 */
interface ArgvSourceMap {
  /**
   * Command-line arguments are from when the Node.js process was launched.
   */
  node: 'node'

  /**
   * Command-line arguments were passed by a user without an application or
   * script path reference.
   */
  user: 'user'
}

export type { ArgvSourceMap as default }
