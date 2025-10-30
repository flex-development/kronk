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
} from '@flex-development/fsm-tokenizer'

/**
 * Initial construct for `Command` instances.
 *
 * Tokenizes option flags, operands, and delimiters.
 *
 * @internal
 *
 * @const {InitialConstruct} initialCommand
 */
const initialCommand: InitialConstruct = initialize({
  /**
   * Tokenize option flags and delimiters.
   */
  [codes.hyphen]: [delimiter, longFlag, shortFlag],

  /**
   * Tokenize command-arguments, option-arguments, and subcommand names.
   */
  null: operand
})

export default initialCommand
