/**
 * @file Interfaces - OptionValueSourceMap
 * @module kronk/interfaces/OptionValueSourceMap
 */

/**
 * Registry of option value sources.
 */
interface OptionValueSourceMap {
  /**
   * The option value was specified on the command line.
   */
  cli: 'cli'

  /**
   * The option value was specified in a config file or object.
   */
  config: 'config'

  /**
   * The option value came from a default value configuration.
   */
  default: 'default'

  /**
   * The option value was specified as an environment variable.
   */
  env: 'env'
}

export type { OptionValueSourceMap as default }
