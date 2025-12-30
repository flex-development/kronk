/**
 * @file Interfaces - WriteStream
 * @module kronk/interfaces/WriteStream
 */

import type { Write } from '@flex-development/kronk'

/**
 * The write stream API.
 */
interface WriteStream {
  /**
   * The number of columns the TTY currently has.
   */
  columns?: number | null | undefined

  /**
   * Write data to the stream.
   *
   * @see {@linkcode Write}
   */
  write: Write
}

export type { WriteStream as default }
