/**
 * @file Command Fixtures - grease
 * @module fixtures/commands/grease
 */

import digits from '#fixtures/digits'
import bool from '#parsers/bool'
import number from '#parsers/number'
import sfmt from '#tests/utils/sfmt'
import { chars } from '@flex-development/fsm-tokenizer'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * `grease` program info.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  description: 'release workflow tool',
  name: 'grease',
  options: [
    {
      choices: bool.choices,
      default: { description: 'isColorSupported()' },
      description: 'whether color output is enabled',
      env: 'GREASE_COLOR',
      flags: '-c | --color [choice]',
      parser: bool(),
      preset: chars.lowercaseY
    },
    {
      default: { value: true },
      description: 'path to config file or config search setting',
      env: 'GREASE_CONFIG',
      flags: '-g | --config [opt]',
      preset: chars.lowercaseY
    },
    {
      description: 'path to current working directory',
      env: ['GREASE_CWD', 'PWD'],
      flags: '-k | --cwd <dir>'
    },
    {
      description: 'enable json output',
      env: 'GREASE_JSON',
      flags: '-j | --json',
      implies: { level: 'log' },
      parser: bool()
    },
    {
      choices: ['debug', 'error', 'info', 'log', 'silent', 'warn', 'verbose'],
      default: { value: 'info' },
      description: 'log level',
      env: 'GREASE_LOG_LEVEL',
      flags: '-L | --level <level>'
    },
    {
      default: { value: chars.empty },
      description: 'tag prefix to consider when handling tags',
      env: 'GREASE_TAG_PREFIX',
      flags: '-T | --tag-prefix <prefix>'
    },
    {
      choices: bool.choices,
      description: 'whether to respect unstable tags',
      env: 'GREASE_UNSTABLE',
      flags: '-u | --unstable [choice]',
      parser: bool(),
      preset: chars.lowercaseY
    },
    {
      default: { value: false },
      description: 'write to disk',
      env: 'GREASE_WRITE',
      flags: '-w | --write'
    }
  ],
  subcommands: {
    bump: {
      arguments: {
        description: 'release type or version',
        syntax: sfmt.optional({ id: 'release' })
      },
      description: 'execute a version bump',
      options: [
        {
          description: 'prerelease identifier',
          env: 'GREASE_BUMP_PREID',
          flags: '--preid <id>'
        },
        {
          choices: [chars.digit0, chars.digit1],
          default: { value: +chars.digit1 },
          description: 'base to be used for prerelease identifier',
          env: 'GREASE_BUMP_PRESTART',
          flags: '--prestart <start>',
          parser: number
        }
      ],
      subcommands: {
        arguments: {
          description: 'version bump candidate',
          syntax: sfmt.optional({ id: 'candidate' })
        },
        description: 'get a version bump recommendation',
        name: 'recommend'
      }
    },
    changelog: {
      aliases: 'ch',
      description: 'generate a changelog from git metadata',
      options: [
        {
          default: { description: 'CHANGELOG.md given --samefile' },
          description: 'read CHANGELOG from this file',
          env: 'GREASE_CHANGELOG_INFILE',
          flags: '-i | --infile <path>'
        },
        {
          description: 'write CHANGELOG to this file',
          env: 'GREASE_CHANGELOG_OUTFILE',
          flags: '-o | --outfile <path>'
        },
        {
          default: { value: +chars.digit1 }, // dprint-ignore-next
          description: 'number of releases to be generated from the latest. if `0`, the entire changelog will be regenerated',
          env: 'GREASE_CHANGELOG_RELEASES',
          flags: '-r | --releases <count>',
          parser: number
        },
        {
          choices: bool.choices,
          default: { value: false },
          description: 'output content to infile',
          env: 'GREASE_CHANGELOG_SAMEFILE',
          flags: '-s | --samefile [choice]',
          parser: bool(),
          preset: chars.lowercaseY
        },
        {
          default: { value: 'HEAD' },
          description: 'end of commit revision range',
          env: 'GREASE_CHANGELOG_TO',
          flags: '-t | --to <commitish>'
        }
      ]
    },
    info: {
      description: 'get an environment report',
      options: [
        {
          choices: bool.choices,
          conflicts: ['json'],
          description: 'enable markdown output',
          flags: '-m | --markdown',
          parser: bool(),
          preset: chars.digit1
        },
        {
          choices: ['bun', 'npm', 'pnpm', 'yarn'],
          description: 'package manager name',
          flags: '--pm | --package-manager'
        }
      ]
    },
    pack: {
      description: 'generate a tarball from the active workspace',
      options: [
        {
          choices: bool.choices,
          description: 'do everything except write the tarball to disk',
          env: 'GREASE_PACK_DRY',
          flags: '-n | --dry [choice]',
          parser: bool(),
          preset: chars.lowercaseY
        },
        {
          choices: digits,
          default: { value: +chars.digit9 },
          description: 'custom compression level for gzip',
          env: 'GREASE_PACK_GZIP_LEVEL',
          flags: '--gzip-level <level>',
          parser: number
        },
        {
          description: 'tarball outfile',
          env: 'GREASE_PACK_OUTFILE',
          flags: '-o | --out <outfile>'
        }
      ]
    },
    tag: {
      description: 'create and list tags',
      options: [
        {
          default: { description: '["-creatordate"]', value: '-creatordate' },
          description: 'tag sorting configuration',
          env: 'GREASE_TAG_SORT',
          flags: '--sort <list>'
        }
      ],
      subcommands: {
        create: {
          arguments: {
            description: 'the tag to create',
            syntax: sfmt.required({ id: 'tag' })
          },
          description: 'create a tag',
          options: [
            {
              choices: bool.choices,
              description: 'replace an existing tag instead of failing',
              env: 'GREASE_TAG_FORCE',
              flags: '-f | --force [choice]',
              parser: bool(),
              preset: chars.digit1
            },
            {
              default: { value: chars.empty },
              description: 'tag message',
              env: 'GREASE_TAG_MESSAGE',
              flags: '-m | --message <msg>'
            },
            {
              default: { value: 'HEAD' },
              description: 'the object the new tag will refer to',
              env: 'GREASE_TAG_OBJECT',
              flags: '-o | --object <commitish>'
            },
            {
              choices: bool.choices,
              description: 'push tag to remote after successful creation',
              env: 'GREASE_TAG_PUSH',
              flags: '-p | --push [choice]',
              parser: bool(),
              preset: chars.lowercaseY
            },
            {
              default: { value: 'origin' },
              description: 'push destination',
              env: 'GREASE_TAG_REMOTE',
              flags: '-r | --remote <dest>'
            },
            {
              default: { value: false }, // dprint-ignore-next
              description: 'create a gpg-signed tag using the default e-mail address\' key or the given key',
              env: 'GREASE_TAG_SIGN',
              flags: '-s | --sign [opt]',
              preset: 'true'
            },
            {
              choices: bool.choices,
              default: { description: '`true` if signing is enabled' },
              description: 'verify gpg signature',
              env: 'GREASE_TAG_VERIFY',
              flags: '-V | --verify [choice]',
              parser: bool(),
              preset: chars.lowercaseY
            }
          ]
        },
        list: {
          description: 'list tags'
        }
      }
    }
  },
  version: '3.0.0-alpha.10'
}
