/**
 * @file Internal - trim
 * @module kronk/internal/trim
 */

export default trim

/**
 * Trim the beginning and end of a string.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string} value
 *  The string
 * @return {string | null}
 *  The trimmed string
 */
function trim(this: void, value: string): string | null

/**
 * Trim the beginning and end of a string.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {null | undefined} value
 *  The string
 * @return {null | undefined}
 *  The trimmed string
 */
function trim(this: void, value: null | undefined): null | undefined

/**
 * Trim the beginning and end of a string.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string | null | undefined} value
 *  The string
 * @return {string | null | undefined}
 *  The trimmed string
 */
function trim(
  this: void,
  value: string | null | undefined
): string | null | undefined

/**
 * Trim the beginning and end of a string.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string | null | undefined} value
 *  The string
 * @return {string | null | undefined}
 *  The trimmed string
 */
function trim(
  this: void,
  value: string | null | undefined
): string | null | undefined {
  return typeof value === 'string' ? value.trim() || null : value
}
