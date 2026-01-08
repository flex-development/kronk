/**
 * @file Command Fixtures - deploy
 * @module fixtures/commands/deploy
 */

import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `deploy`.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  description: String.raw`
    Deploy the current application build to the specified environment.
    Some options require additional context to be provided explicitly.
  `,
  name: 'deploy',
  options: [
    {
      description: 'the config file path',
      env: 'DEPLOY_CONFIG',
      flags: '-g, --config <config!>'
    },
    {
      description: 'the deployment environment',
      flags: '-e, --env <env>'
    },
    {
      depends: ['env', 'token'],
      description: 'the deployment tag',
      flags: '-t, --tag <tag>'
    }
  ]
}
