/**
 * @file Enums - argumentValueSource
 * @module kronk/enums/argumentValueSource
 */

import type { ArgumentValueSource } from '@flex-development/kronk'

/**
 * Default argument value sources.
 *
 * @enum {ArgumentValueSource}
 */
const enum argumentValueSource {
  cli = 'cli',
  default = 'default'
}

export default argumentValueSource
