/**
 * @file Type Aliases - ArgumentsData
 * @module kronk/types/ArgumentsData
 */

import type {
  ArgumentInfo,
  ArgumentSyntax,
  List
} from '@flex-development/kronk'

/**
 * Union of types used to create command arguments.
 *
 * @see {@linkcode ArgumentInfo}
 * @see {@linkcode ArgumentSyntax}
 * @see {@linkcode List}
 */
type ArgumentsData =
  | ArgumentInfo
  | List<ArgumentInfo | ArgumentSyntax>
  | string

export type { ArgumentsData as default }
