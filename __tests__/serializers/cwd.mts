/**
 * @file Snapshot Serializers - cwd
 * @module tests/serializers/cwd
 * @see https://vitest.dev/guide/snapshot
 */

import { ok } from 'devlop'
import type { SnapshotSerializer } from 'vitest'

/**
 * `process.cwd()` snapshot serializer.
 *
 * @const {SnapshotSerializer} serializer
 */
const serializer: SnapshotSerializer = { print, test }

export default serializer

/**
 * Print a snapshot value.
 *
 * > 👉 **Note**: `value` is expected to be a string.
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to print
 * @return {string}
 *  Snapshot value
 */
function print(this: void, value: unknown): string {
  ok(test(value), 'expected `value` to pass `test`')
  return value.replaceAll(process.cwd(), '${process.cwd()}')
}

/**
 * Check if `value` is a string containing {@linkcode process.cwd}.
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {value is string}
 *  `true` if `value` is string containing `process.cwd`
 */
function test(this: void, value: unknown): value is string {
  return typeof value === 'string' && value.includes(process.cwd())
}
