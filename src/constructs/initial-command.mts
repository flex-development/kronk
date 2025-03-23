/**
 * @file Constructs - initialCommand
 * @module constructs/initialCommand
 */

import delimiter from '#constructs/delimiter'
import longFlag from '#constructs/flag-long'
import shortFlag from '#constructs/flag-short'
import operand from '#constructs/operand'
import {
  codes,
  initialize,
  type InitialConstruct
} from '@flex-development/vfile-tokenizer'

/**
 * Initial construct for `Command` instances.
 *
 * @internal
 *
 * @const {InitialConstruct} initialCommand
 */
const initialCommand: InitialConstruct = initialize({
  [codes.hyphen]: [delimiter, longFlag, shortFlag],
  null: operand
})

export default initialCommand
