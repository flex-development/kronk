/**
 * @file Constructs - initialOption
 * @module constructs/initialOption
 */

import argumentSyntax from '#constructs/argument-syntax'
import longFlag from '#constructs/flag-long'
import shortFlag from '#constructs/flag-short'
import {
  codes,
  initialize,
  type InitialConstruct
} from '@flex-development/fsm-tokenizer'

/**
 * Initial construct for `Option` instances.
 *
 * @internal
 *
 * @const {InitialConstruct} initialOption
 */
const initialOption: InitialConstruct = initialize({
  [codes.hyphen]: [longFlag, shortFlag],
  [codes.leftAngleBracket]: argumentSyntax,
  [codes.leftBracket]: argumentSyntax
})

export default initialOption
