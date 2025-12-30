/**
 * @file Command Fixtures - bun
 * @module fixtures/commands/bun
 */

import chars from '#enums/chars'
import number from '#parsers/number'
import unique from '#parsers/unique'
import sfmt from '#tests/utils/sfmt'
import c from '@flex-development/colors'
import type { SubcommandInfo as CommandInfo } from '@flex-development/kronk'

/**
 * The program info for `bun`.
 *
 * @type {CommandInfo}
 */
export default {
  async: true as const,
  description: `${c.bold(c.magenta('Bun'))} is a fast JavaScript runtime,  ` +
    'package manager, bundler, and test runner.',
  help: { globalOptions: false },
  helpOption: { description: 'display this menu and exit' },
  name: 'bun',
  options: [
    {
      description: 'whether to use the bun runtime instead of nodejs',
      flags: '--b, --bun'
    },
    {
      description: 'custom conditions to resolve',
      flags: '--conditions <...>',
      parser: unique
    },
    {
      default: { description: '$cwd/bunfig.toml' },
      description: 'the path to config file',
      flags: '-c, --config <>'
    },
    {
      description: 'the path to current working directory',
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
      description: 'the number of lines of script output shown when using `--filter`;\nset to `0` to show all lines',
      flags: '--elide-lines <lines>',
      parser: number
    },
    {
      description: 'load environment variables from the specified file(s)',
      flags: '--env-file <...>',
      parser: unique
    },
    {
      description: 'run a script in all workspaces matching the pattern',
      flags: '-F, --filter <pattern>'
    },
    {
      description: 'whether to enable auto reload',
      flags: '--hot'
    },
    { // dprint-ignore-next
      description: 'whether to disable clearing the terminal screen on reload\nwhen `--hot` or `--watch` is enabled',
      flags: '--no-clear-screen'
    },
    {
      description: 'whether to use the latest matching versions of packages',
      flags: '--prefer-latest'
    },
    {
      description: 'import a module before other modules are loaded',
      flags: '-r, --preload <module>'
    },
    {
      choices: ['bun', 'system'],
      description: 'the shell used for `package.json` scripts',
      flags: '--shell <sh>'
    },
    {
      description: 'whether to auto-restart the process on file change',
      flags: '--watch'
    }
  ],
  subcommands: {
    init: {
      arguments: {
        default: { value: chars.dot },
        description: 'the path to the project directory',
        syntax: sfmt.optional({ id: 'folder' })
      },
      description: 'Initialize a Bun project in the specified directory.\n' +
        'Creates a `package.json`, `tsconfig.json`, and `bunfig.toml` ' +
        'if they don\'t exist.',
      examples: [
        c.cyan('--yes'),
        c.cyan('--react'),
        [c.cyan('--react=tailwind'), c.blue('my-app')]
      ],
      helpOption: { description: 'print this menu' },
      options: [
        {
          description: 'whether to only initialize type definitions',
          flags: '-m, --minimal'
        },
        {
          choices: ['shadcn', 'tailwind'],
          description: 'whether to initialize a react project\n' +
            '  • `shadcn`: initialize with @shadcn/ui and tailwindcss\n' +
            '  • `tailwind`: initialize with tailwindcss\n',
          flags: '-r, --react [type]'
        },
        {
          description: 'whether to accept all default options',
          flags: '-y, --yes'
        }
      ],
      summary: 'initialize a project',
      usage: {
        arguments: c.blue(sfmt.optional({ id: '<folder>' })),
        options: c.cyan(sfmt.optional({ id: 'flags' }))
      }
    },
    run: {
      arguments: {
        description: 'the module path',
        syntax: sfmt.required({ id: 'module' })
      },
      default: true,
      description: c.magenta('https://bun.com/docs/cli/run'),
      examples: [
        c.blue('./index.js'),
        c.blue('./index.tsx'),
        c.blue('dev'),
        c.blue('lint'),
        [
          c.yellow('--define'),
          c.blueBright('process.env.NODE_ENV:"development"')
        ],
        [
          c.yellow('--loader'),
          c.blueBright('.js:jsx')
        ]
      ],
      help: { globalOptions: false },
      helpOption: { description: 'display this menu and exit' },
      options: [
        {
          description: 'substitute `k:v` while parsing',
          flags: '-d, --define <>'
        },
        {
          default: { value: 'tsx,.ts,.jsx,.js,.json' },
          flags: '--extension-order <>'
        },
        {
          // dprint-ignore-next
          description: 'parse files with .ext:loader\nvalid loaders: `js`, `jsx`, `ts`, `tsx`, `json`, `toml`, `text`, `file`, `wasm`, `napi`',
          flags: '-l, --loader <...>'
        },
        {
          default: { description: '`--target` dependant' },
          description: 'the main fields to lookup in `package.json`',
          flags: '--main-fields <...>'
        },
        {
          description: 'whether to preserve symlinks when resolving files',
          flags: '--preserve-symlinks'
        },
        {
          default: { description: `${c.gray('$cwd')}/tsconfig.json` },
          description: 'the path to a custom tsconfig file',
          flags: '--tsconfig-override <>'
        }
      ],
      summary: 'execute a file',
      usage: {
        arguments: sfmt.required({ id: 'file or script' }),
        options: c.cyan(sfmt.optional({ id: 'flags' }))
      }
    }
  },
  usage: {
    arguments: sfmt.optional({ id: '...args' }),
    options: c.cyan(sfmt.optional({ id: '...flags' })),
    subcommand: sfmt.required({ id: 'command' })
  },
  version: {
    description: 'print version and exit',
    version: '1.2.19+aad3abead'
  }
}
