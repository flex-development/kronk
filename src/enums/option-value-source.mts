/**
 * @file Enums - chars
 * @module kronk/enums/chars
 */

import type { OptionValueSource } from '@flex-development/kronk'

/**
 * Default option value sources.
 *
 * @enum {OptionValueSource}
 */
const enum optionValueSource {
  cli = 'cli',
  config = 'config',
  default = 'default',
  env = 'env'
}

export default optionValueSource
