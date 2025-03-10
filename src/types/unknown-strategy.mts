/**
 * @file Type Aliases - UnknownStrategy
 * @module kronk/types/UnknownStrategy
 */

/**
 * Union of values used to alter handling of unknown command-line arguments.
 *
 * - `'arguments'`: allow unknown command-arguments only
 * - `'options'`: allow unknown options only
 * - `false`: disallow unknown command-arguments and options
 * - `true`: allow unknown command-arguments and options
 */
type UnknownStrategy = 'arguments' | 'options' | boolean

export type { UnknownStrategy as default }
