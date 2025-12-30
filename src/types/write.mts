/**
 * @file Type Aliases - Write
 * @module kronk/types/Write
 */

/**
 * Write data to the stream.
 *
 * @this {void}
 *
 * @param {string} buffer
 *  The data to write
 * @return {boolean | undefined | void}
 *  `true` if all data was flushed successfully, `false` if all or part of
 *  the data was queued in user memory, or nothing
 */
type Write = (this: void, buffer: string) => boolean | undefined | void

export type { Write as default }
