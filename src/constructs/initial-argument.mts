/**
 * @file Constructs - initialArgument
 * @module constructs/initialArgument
 */

import argumentSyntax from '#constructs/argument-syntax'
import {
  codes,
  initialize,
  type InitialConstruct
} from '@flex-development/vfile-tokenizer'

/**
 * Initial construct for `Argument` instances.
 *
 * @internal
 *
 * @const {InitialConstruct} initialArgument
 */
const initialArgument: InitialConstruct = initialize({
  [codes.leftAngleBracket]: argumentSyntax,
  [codes.leftBracket]: argumentSyntax
})

export default initialArgument
