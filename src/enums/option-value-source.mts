/**
 * @file Enums - optionValueSource
 * @module kronk/enums/optionValueSource
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
  env = 'env',
  implied = 'implied'
}

export default optionValueSource
