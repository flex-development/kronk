/**
 * @file Enums - keid
 * @module kronk/enums/keid
 */

import type { KronkErrorId } from '@flex-development/kronk'

/**
 * Kronk error ids.
 *
 * @see {@linkcode KronkErrorId}
 *
 * @internal
 *
 * @enum {KronkErrorId}
 */
const enum keid {
  argument_after_variadic = 'kronk/argument-after-variadic',
  conflicting_option = 'kronk/conflicting-option',
  duplicate_option = 'kronk/duplicate-option',
  duplicate_subcommand = 'kronk/duplicate-subcommand',
  error = 'kronk/error',
  excess_arguments = 'kronk/excess-arguments',
  invalid_argument = 'kronk/invalid-argument',
  invalid_argument_syntax = 'kronk/invalid-argument-syntax',
  invalid_flags = 'kronk/invalid-flags',
  invalid_subcommand_name = 'kronk/invalid-subcommand-name',
  missing_argument = 'kronk/missing-argument',
  missing_mandatory_option = 'kronk/missing-mandatory-option',
  no_flags = 'kronk/no-flags',
  unknown_option = 'kronk/unknown-option'
}

export default keid
