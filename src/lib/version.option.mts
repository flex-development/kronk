/**
 * @file VersionOption
 * @module kronk/lib/VersionOption
 */

import Option from '#lib/option'
import type { Version, VersionOptionInfo } from '@flex-development/kronk'

/**
 * A command version option (i.e. `-v | --version`).
 *
 * @see {@linkcode Option}
 *
 * @class
 * @extends {Option}
 */
class VersionOption extends Option {
  /**
   * The version of the command.
   *
   * @public
   * @instance
   * @member {string} version
   */
  public version: string

  /**
   * Create a new version option.
   *
   * @see {@linkcode Version}
   * @see {@linkcode VersionOptionInfo}
   *
   * @param {Version | VersionOptionInfo} info
   *  Command version or option info
   */
  constructor(info: Version | VersionOptionInfo) {
    if (typeof info === 'string' || 'compare' in info) info = { version: info }

    super({
      ...info,
      description: info.description ?? 'print version number',
      flags: info.flags ?? '-v | --version'
    })

    this.version = String(info.version)
  }
}

export default VersionOption
