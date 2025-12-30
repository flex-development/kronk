/**
 * @file Type Aliases - EmptyObject
 * @module kronk/types/EmptyObject
 */

/**
 * The empty object symbol.
 *
 * @internal
 *
 * @const {symbol} tag
 */
export declare const tag: unique symbol

/**
 * An empty object.
 */
type EmptyObject = { [tag]?: never }

export type { EmptyObject as default }
