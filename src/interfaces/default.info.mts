/**
 * @file Interfaces - DefaultInfo
 * @module kronk/interfaces/DefaultInfo
 */

/**
 * Data used to configure the default value of a command argument or option.
 *
 * @template {any} [T=any]
 *  Default value type
 */
interface DefaultInfo<T = any> {
  /**
   * A description of the default value.
   */
  description?: URL | string | null | undefined

  /**
   * The default value.
   *
   * @default undefined
   */
  value?: T
}

export type { DefaultInfo as default }
