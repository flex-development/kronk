/**
 * @file Command Fixtures - auth
 * @module fixtures/commands/auth
 */

import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `auth`.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  helpCommand: false,
  helpOption: '-h --help',
  name: 'auth',
  options: [
    {
      description: 'the unique user id',
      flags: '-U --username <user>'
    }
  ],
  subcommands: {
    login: {
      description: 'Authenticate using one of several supported methods.',
      options: [
        {
          conflicts: ['token'],
          depends: ['access', 'username'],
          description: 'authenticate using a password',
          flags: '--password <password>'
        },
        {
          description: 'authenticate using an api token',
          flags: '--token <token>'
        }
      ],
      summary: 'authenticate a user'
    }
  }
}
