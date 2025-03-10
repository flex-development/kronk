/**
 * @file Type Aliases - ArgumentSyntax
 * @module kronk/types/ArgumentSyntax
 */

import type { ArgumentSyntaxMap } from '@flex-development/kronk'

/**
 * Union of registered syntaxes used to define command and option arguments.
 *
 * To register custom syntaxes, augment {@linkcode ArgumentSyntaxMap}. They will
 * be added to this union automatically.
 */
type ArgumentSyntax = ArgumentSyntaxMap[keyof ArgumentSyntaxMap]

export type { ArgumentSyntax as default }
