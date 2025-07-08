/**
 * @file Snapshot Serializers - serializer
 * @module tests/serializers/serializer
 * @see https://vitest.dev/guide/snapshot
 */

import { isObject } from '@flex-development/tutils'
import { format, type Config } from '@vitest/pretty-format'
import type { SnapshotSerializer } from 'vitest'

/**
 * Plain object snapshot serializer.
 *
 * @const {SnapshotSerializer} serializer
 */
const serializer: SnapshotSerializer = { serialize, test: isObject }

export default serializer

/**
 * Serialize a snapshot value.
 *
 * > 👉 **Note**: `value` is expected to be a plain object.
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to print
 * @param {Config} config
 *  Format configuration
 * @return {string}
 *  Snapshot value
 */
function serialize(
  this: void,
  value: unknown,
  config: Config
): string {
  return format(value, {
    callToJSON: config.callToJSON,
    compareKeys: null,
    escapeRegex: config.escapeRegex,
    escapeString: config.escapeString,
    indent: config.indent.length,
    maxDepth: config.maxDepth,
    maxWidth: config.maxWidth,
    min: config.min,
    printBasicPrototype: config.printBasicPrototype,
    printFunctionName: config.printFunctionName
  }).replaceAll(process.cwd(), '${process.cwd()}')
}
