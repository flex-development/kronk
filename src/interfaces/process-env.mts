/**
 * @file Interfaces - ProcessEnv
 * @module kronk/interfaces/ProcessEnv
 */

/**
 * Object containing information about the user environment.
 *
 * > 👉 **Note**: On Windows operating systems, environment variables are
 * > case-insensitive.
 *
 * @see http://man7.org/linux/man-pages/man7/environ.7.html
 */
interface ProcessEnv {
  [key: string]: string | undefined
}

export type { ProcessEnv as default }
