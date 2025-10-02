/**
 * @file Type Aliases - VersionData
 * @module kronk/types/VersionData
 */

import type {
  Version,
  VersionOption,
  VersionOptionInfo
} from '@flex-development/kronk'

/**
 * Union of types used to configure the version of a command.
 *
 * @see {@linkcode Version}
 * @see {@linkcode VersionOption}
 * @see {@linkcode VersionOptionInfo}
 */
type VersionData = Version | VersionOption | VersionOptionInfo

export type { VersionData as default }
