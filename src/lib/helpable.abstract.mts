/**
 * @file Helpable
 * @module kronk/lib/Helpable
 */

import chars from '#enums/chars'
import orNIL from '#internal/or-nil'
import type { HelpableInfo } from '@flex-development/kronk'
import { fallback, isNIL } from '@flex-development/tutils'
import { ok } from 'devlop'

/**
 * A help text candidate.
 *
 * @class
 * @abstract
 */
abstract class Helpable {
  /**
   * Candidate metadata.
   *
   * @see {@linkcode HelpableInfo}
   *
   * @protected
   * @instance
   * @member {HelpableInfo} info
   */
  protected info: HelpableInfo

  /**
   * Create a new help text candidate.
   *
   * @param {HelpableInfo | null | undefined} [info]
   *  Help text candidate info
   */
  constructor(info?: HelpableInfo | null | undefined) {
    this.info = { ...info }
    this.description(this.info.description)
    this.hide(!!this.info.hidden)
  }

  /**
   * Whether the candidate should **not** be displayed in help text.
   *
   * @public
   * @instance
   *
   * @return {boolean}
   *  `true` if candidate should removed from help text, `false` otherwise
   */
  public get hidden(): boolean {
    ok(typeof this.info.hidden === 'boolean', 'expected `info.hidden`')
    return this.info.hidden
  }

  /**
   * Set the candidate description.
   *
   * The description can be long or short form text, or a URL pointing to more
   * information about the candidate.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} description
   *  Candidate description text or a URL pointing to more info
   * @return {this}
   *  `this` candidate
   */
  public description(description: URL | string | null | undefined): this

  /**
   * Get the candidate description.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  Candidate description text or a URL pointing to more info
   */
  public description(): string

  /**
   * Get or set the candidate description.
   *
   * @public
   * @instance
   *
   * @param {URL | string | null | undefined} [description]
   *  Candidate description text or a URL pointing to more info
   * @return {string | this}
   *  Candidate description or `this` candidate
   */
  public description(
    description?: URL | string | null | undefined
  ): string | this {
    if (!arguments.length) return String(this.info.description ?? chars.empty)
    return this.info.description = orNIL(description), this
  }

  /**
   * Remove the candidate from the help text.
   *
   * @public
   * @instance
   *
   * @param {boolean | null | undefined} [hidden=true]
   *  Whether the candidate should be hidden in help text
   * @return {this}
   *  `this` candidate
   */
  public hide(hidden?: boolean | null | undefined): this {
    return this.info.hidden = fallback(hidden, true, isNIL), this
  }
}

export default Helpable
