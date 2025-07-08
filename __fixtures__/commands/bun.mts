/**
 * @file Command Fixtures - bun
 * @module fixtures/commands/bun
 */

import number from '#parsers/number'
import unique from '#parsers/unique'
import sfmt from '#tests/utils/sfmt'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'
import { dedent } from 'ts-dedent'

/**
 * `bun` program info.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  name: 'bun',
  options: [
    {
      description: 'use the bun runtime instead of nodejs',
      flags: '--b | --bun'
    },
    {
      description: 'pass custom conditions to resolve',
      flags: '--conditions <...>',
      parser: unique
    },
    {
      default: { description: '$cwd/bunfig.toml' },
      description: 'path to config file',
      flags: '-c | --config <>'
    },
    {
      description: 'path to current working directory',
      env: 'PWD',
      flags: '--cwd <>'
    },
    {
      choices: ['ipv4first', 'ipv6first', 'verbatim'],
      default: { value: 'verbatim' },
      description: 'set the default order of dns lookup results',
      flags: '--dns-result-order <order>'
    },
    {
      default: { value: 10 }, // dprint-ignore-next
      description: 'number of lines of script output shown when using --filter; set to `0` to show all lines',
      flags: '--elide-lines <num>',
      parser: number
    },
    {
      description: 'load environment variables from the specified file(s)',
      flags: '--env-file <...>',
      parser: unique
    },
    {
      description: 'run a script in all workspaces matching the pattern',
      flags: '-F | --filter <pattern>'
    },
    {
      description: 'enable auto reload',
      flags: '--hot'
    },
    { // dprint-ignore-next
      description: 'disable clearing the terminal screen on reload when --hot or --watch is enabled',
      flags: '--no-clear-screen'
    },
    {
      description: 'use the latest matching versions of packages',
      flags: '--prefer-latest'
    },
    {
      description: 'import a module before other modules are loaded',
      flags: '-r | --preload <module>'
    },
    {
      choices: ['bun', 'system'],
      description: 'the shell used for package.json scripts',
      flags: '--shell <sh>'
    },
    {
      description: 'automatically restart the process on file change',
      flags: '--watch'
    }
  ],
  subcommands: {
    init: {
      arguments: sfmt.optional({ id: 'folder' }),
      description: dedent`
        Initialize a project in the specified directory.
        Creates a \`package.json\`, \`tsconfig.json\`, and \`bunfig.toml\` if they don't exist.
      `,
      options: [
        {
          description: 'Only initialize type definitions',
          flags: '-m | --minimal'
        },
        {
          description: 'Accept all default options',
          flags: '-y | --yes'
        }
      ],
      usage: {
        arguments: sfmt.optional({ id: '<folder>' }),
        options: sfmt.optional({ id: 'flags' })
      }
    },
    run: {
      arguments: sfmt.required(),
      default: true,
      description: 'execute a file',
      options: [
        {
          // dprint-ignore-next
          description: 'substitute k:v while parsing, e.g. --define process.env.NODE_ENV:"development". values are parsed as json',
          flags: '-d | --define <>'
        },
        {
          default: { value: 'tsx,.ts,.jsx,.js,.json' },
          flags: '--extension-order <>'
        },
        {
          // dprint-ignore-next
          description: 'parse files with .ext:loader, e.g. --loader .js:jsx. valid loaders: js, jsx, ts, tsx, json, toml, text, file, wasm, napi',
          flags: '-l | --loader <...>'
        },
        {
          default: { description: '--target dependent' },
          description: 'main fields to lookup in `package.json`',
          flags: '--main-fields <...>'
        },
        {
          description: 'preserve symlinks when resolving files',
          flags: '--preserve-symlinks'
        },
        {
          default: { description: '<d>$cwd<r>/tsconfig.json' },
          description: 'path to custom tsconfig file',
          flags: '--tsconfig-override <>'
        }
      ],
      usage: {
        arguments: sfmt.required({ id: 'file or script' }),
        options: sfmt.optional({ id: 'flags' })
      }
    }
  },
  usage: {
    arguments: sfmt.optional({ id: '...args' }),
    options: sfmt.optional({ id: '...flags' }),
    subcommand: sfmt.required({ id: 'command' })
  },
  version: {
    description: 'print version and exit',
    version: '1.2.12+32a47ae45'
  }
}
