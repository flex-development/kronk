/**
 * @file Command Fixtures - grease
 * @module fixtures/commands/grease
 */

import chars from '#enums/chars'
import bool from '#parsers/bool'
import number from '#parsers/number'
import uniq from '#parsers/uniq'
import file from '#tests/parsers/file'
import files from '#tests/parsers/files'
import sfmt from '#tests/utils/sfmt'
import digits from '#utils/digits'
import c from '@flex-development/colors'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `grease`.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  description: 'A release workflow tool.',
  examples: [
    {
      text: ['bump', 'major']
    },
    {
      env: 'TZ=America/New_York',
      text: ['changelog', '-wo=$NOTES_FILE']
    },
    {
      text: ['pack', '-o', '%s-%v.tgz']
    },
    {
      text: ['tag', '-psm', '"release: {tag}"']
    },
    {
      comment: '# show help and exit',
      text: ['--help']
    }
  ],
  help: { columns: 130 },
  name: 'grease',
  options: [
    {
      choices: [
        chars.digit0,
        chars.digit1,
        chars.digit2,
        chars.digit3,
        chars.false,
        chars.true
      ],
      default: { description: 'isColorSupported()' },
      description: `whether color output is enabled${chars.lf}` +
        `  • ${c.yellow('0')}: 2 colors (disables colors)${chars.lf}` +
        `  • ${c.yellow('1')}: 16 colors${chars.lf}` +
        `  • ${c.yellow('2')}: 256 colors${chars.lf}` +
        `  • ${c.yellow('3')}: 16,777,216 colors${chars.lf}` +
        `  • ${c.yellow('false')}: disable colors${chars.lf}` +
        `  • ${c.yellow('true')}: default color support`,
      env: 'GREASE_COLOR',
      flags: '-c, --color [choice]',
      parser: bool(),
      preset: chars.true
    },
    {
      default: { value: true },
      description: 'the config file path or config search setting',
      env: 'GREASE_CONFIG',
      flags: '-g, --config [opt]',
      preset: chars.lowercaseY
    },
    {
      description: 'the path to the current working directory',
      env: ['GREASE_CWD', 'PWD'],
      flags: '-k, --cwd <dir>'
    },
    {
      conflicts: ['write'],
      default: { value: true },
      description:
        'whether grease should only report what it would have done, rather than make any changes (i.e. write to disk, publish)',
      env: 'GREASE_DRY',
      flags: '-n, --dry [choice]',
      parser: bool(),
      preset: chars.digit1
    },
    {
      description: 'whether to ignore scripts defined in manifest files',
      env: 'GREASE_IGNORE_SCRIPTS',
      flags: '--ignore-scripts'
    },
    {
      description: 'whether to enable json output',
      env: 'GREASE_JSON',
      flags: '-j, --json',
      implies: { color: false, logLevel: 'log' }
    },
    {
      choices: ['debug', 'error', 'info', 'log', 'silent', 'warn', 'verbose'],
      default: { value: 'info' },
      description: 'the log level',
      env: 'GREASE_LOG_LEVEL',
      flags: '-L, --log-level <level>'
    },
    {
      default: { value: chars.empty },
      description: 'the tag prefix to consider when handling tags',
      env: 'GREASE_TAG_PREFIX',
      flags: '-T, --tag-prefix <prefix>'
    },
    {
      choices: bool.choices,
      default: { value: true },
      description: 'whether to respect unstable tags',
      env: 'GREASE_UNSTABLE',
      flags: '-u, --unstable [choice]',
      parser: bool(),
      preset: chars.lowercaseY
    },
    {
      conflicts: ['dry'],
      description: 'whether to write to disk',
      env: 'GREASE_WRITE',
      flags: '-w, --write'
    }
  ],
  subcommands: {
    bump: {
      aliases: 'version',
      arguments: [
        {
          description: 'the release type or version',
          syntax: sfmt.required({ id: 'type|version' })
        },
        {
          description: 'the bump files',
          parser: files,
          syntax: sfmt.optional({ id: 'files', variadic: true })
        }
      ],
      description: 'Execute a version bump.',
      helpCommand: false,
      options: [
        {
          description:
            'the identifier to be used to prefix premajor, preminor, or prepatch version increments',
          env: 'GREASE_BUMP_PREID',
          flags: '--preid <id>'
        },
        {
          choices: [chars.digit0, chars.digit1],
          default: { value: +chars.digit1 },
          description: 'the base to use for the prerelease identifier',
          env: 'GREASE_BUMP_PRESTART',
          flags: '--prestart <start>',
          parser: number
        }
      ],
      subcommands: {
        arguments: {
          default: { description: 'inferred from changelog' },
          description: 'the version bump candidate',
          syntax: sfmt.optional({ id: 'candidate' })
        },
        description: 'Get a version bump recommendation.',
        examples: { text: [] },
        helpCommand: false,
        name: 'recommend',
        summary: 'get a recommended version bump'
      },
      summary: 'execute a version bump or get a recommendation'
    },
    changelog: {
      description: 'Generate a changelog from Git metadata.',
      options: [
        {
          default: { description: 'CHANGELOG.md given --samefile' },
          description: 'read the changelog from this file',
          env: 'GREASE_CHANGELOG_INFILE',
          flags: '-i, --infile <path>',
          parser: file
        },
        {
          description: 'write the changelog to this file',
          env: 'GREASE_CHANGELOG_OUTFILE',
          flags: '-o, --outfile <path>',
          parser: file
        },
        {
          default: { value: +chars.digit1 }, // dprint-ignore-next
          description: 'the number of releases to be generated from the latest. \nif `0`, the entire changelog will be regenerated',
          env: 'GREASE_CHANGELOG_RELEASES',
          flags: '-r, --releases <count>',
          parser: number
        },
        {
          choices: bool.choices,
          default: { value: false },
          description: 'whether to output content to `--infile`',
          env: 'GREASE_CHANGELOG_SAMEFILE',
          flags: '-s, --samefile [choice]',
          parser: bool(),
          preset: chars.lowercaseY
        },
        {
          default: { value: 'HEAD' },
          description: 'end of commit revision range',
          env: 'GREASE_CHANGELOG_TO',
          flags: '-t, --to <commitish>'
        }
      ],
      summary: 'generate a changelog'
    },
    distTag: {
      arguments: {
        description: 'the release type or version',
        syntax: sfmt.required({ id: 'target' })
      },
      description: 'Get a distribution tag from a release type or version.',
      examples: [
        {
          comment: '# alpha',
          text: ['grease@3.0.0-alpha.10', '-T=grease@']
        }
      ],
      name: 'dist-tag',
      summary: 'distribution tag lookup'
    },
    info: {
      description: 'Get an environment report.',
      options: [
        {
          choices: bool.choices,
          conflicts: ['json', 'yaml'],
          description: 'whether to enable markdown output',
          flags: '-m, --markdown []',
          implies: { logLevel: 'log' },
          parser: bool(),
          preset: chars.digit1
        },
        {
          choices: ['bun', 'npm', 'pnpm', 'yarn'],
          description: 'the package manager name',
          flags: '--pm, --package-manager <>'
        },
        {
          choices: bool.choices,
          conflicts: ['json', 'markdown'],
          description: 'whether to enable yaml output',
          flags: '-y, --yaml []',
          implies: { logLevel: 'log' },
          parser: bool(),
          preset: chars.digit1
        }
      ],
      summary: 'get an environment report'
    },
    manifest: {
      description: 'Manage the package manifest.',
      help: { globalOptions: false },
      helpCommand: false,
      options: {
        description: 'the manifest path or url',
        env: ['GREASE_MANIFEST_PATH', 'npm_package_json'],
        flags: '-M, --manifest <manifest>',
        parser: file
      },
      subcommands: {
        delete: {
          arguments: {
            description: 'the field to remove',
            syntax: sfmt.required({ id: 'field' })
          },
          description: 'Remove the value at `field` from the manifest.',
          summary: 'delete a value'
        },
        get: {
          arguments: {
            description: 'the field to retrieve',
            syntax: sfmt.required({ id: 'field' })
          },
          description: 'Get the value at `field` from the manifest.\n' +
            `Returned values are always in ${c.bold('json')} format.`,
          summary: 'get a value'
        },
        set: {
          arguments: {
            description: 'the list of field-value pairs',
            parser: uniq(),
            syntax: sfmt.required({ id: 'fieldValue', variadic: true })
          },
          description: 'Set the `value` at `field` in the manifest.',
          summary: 'set values',
          usage: {
            arguments: sfmt.required({ id: 'field=value', variadic: true })
          }
        }
      },
      summary: 'package manifest manager'
    },
    pack: {
      arguments: {
        default: { description: 'based on `files` property in manifest' },
        description: 'the files to pack',
        parser: files,
        syntax: sfmt.optional({ id: 'files', variadic: true })
      },
      description: 'Generate a tarball from the current project.',
      options: [
        {
          choices: digits,
          default: { value: +chars.digit9 },
          description: 'gzip compression level',
          env: 'GREASE_PACK_GZIP_LEVEL',
          flags: '--gzip, --gzip-level <level>',
          parser: number
        },
        {
          description: 'write the tarball to this file',
          env: 'GREASE_PACK_OUTFILE',
          flags: '-o, --out <outfile>'
        }
      ],
      summary: 'pack a project'
    },
    publish: {
      arguments: {
        description: 'the package artifact path',
        parser: file,
        syntax: sfmt.optional({ id: 'artifact' })
      },
      description:
        'Publish a package to a registry so it can be installed by name.',
      examples: [
        {
          text: [
            '@flex-development-kronk-1.0.0.tgz',
            '-PR=https://npm.pkg.github.com'
          ]
        }
      ],
      options: [
        {
          conflicts: ['provenance-file'], // dprint-ignore-next
          description: 'when publishing from a supported cloud ci/cd system, the package will be publicly linked to where it was built and published from',
          flags: '-P, --provenance'
        },
        {
          conflicts: ['provenance'],
          description: 'the provenance bundle path',
          flags: '--pf, --provenance-file'
        },
        {
          description: 'the registry url',
          flags: '-R, --registry <url!>'
        },
        {
          default: { value: 'latest' },
          description: 'the distribution tag',
          flags: '-t, --tag <tag>'
        }
      ],
      summary: 'publish a package',
      usage: {
        options: '--registry <url!> [flags...]'
      }
    },
    tag: {
      description: 'Manage release tags.',
      helpCommand: false,
      subcommands: {
        create: {
          arguments: {
            description: 'the tag to create',
            syntax: sfmt.required({ id: 'tag' })
          },
          description: 'Create a release tag.',
          help: { globalOptions: false },
          options: [
            {
              choices: bool.choices, // dprint-ignore-next
              description: 'whether to replace `tag` instead of failing if it already exists',
              env: 'GREASE_TAG_FORCE',
              flags: '-f, --force [choice]',
              parser: bool(),
              preset: chars.digit1
            },
            {
              default: { value: chars.empty },
              description: 'the message to associate with the new tag',
              env: 'GREASE_TAG_MESSAGE',
              flags: '-m, --message <msg>'
            },
            {
              default: { value: 'HEAD' },
              description: 'the object the new tag will refer to',
              env: 'GREASE_TAG_OBJECT',
              flags: '-o, --object <commitish>'
            },
            {
              description: 'whether to push the tag to remote after creation',
              env: 'GREASE_TAG_PUSH',
              flags: '-p, --push'
            },
            {
              default: { value: 'origin' },
              description: 'the push destination',
              env: 'GREASE_TAG_REMOTE',
              flags: '-r, --remote <dest>'
            },
            {
              default: { value: false }, // dprint-ignore-next
              description: 'create a gpg-signed tag using the default e-mail address\' key or the given key',
              env: 'GREASE_TAG_SIGN',
              flags: '-s, --sign [opt]',
              preset: 'true'
            },

            {
              choices: bool.choices,
              default: { description: '`true` if signing is enabled' },
              description: 'whether to verify gpg signature',
              env: 'GREASE_TAG_VERIFY',
              flags: '-V, --verify [choice]',
              parser: bool(),
              preset: chars.lowercaseY
            }
          ],
          summary: 'create release tags'
        },
        list: {
          aliases: ['ls'] as const,
          description: 'List release tags.',
          options: {
            default: {
              description: '[\'-creatordate\']',
              value: '-creatordate'
            },
            description: 'the sorting configuration',
            env: 'GREASE_TAG_SORT',
            flags: '--sort <list>'
          },
          summary: 'list release tags'
        }
      },
      summary: 'release tag manager'
    }
  },
  version: '3.0.0-alpha.10'
}
