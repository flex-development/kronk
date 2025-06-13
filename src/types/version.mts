/**
 * @file Type Aliases - Version
 * @module kronk/types/Version
 */

import type { SemVer } from 'semver'

/**
 * Union of command version types.
 *
 * @see {@linkcode SemVer}
 */
type Version = SemVer | string

export type { Version as default }
