/**
 * @file Functional Tests - Command
 * @module kronk/lib/tests/functional/Command
 */

import chars from '#enums/chars'
import eid from '#enums/keid'
import CommandError from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import average from '#fixtures/commands/average'
import bun from '#fixtures/commands/bun'
import clamp from '#fixtures/commands/clamp'
import grease from '#fixtures/commands/grease'
import greaseBad from '#fixtures/commands/grease-bad'
import mlly from '#fixtures/commands/mlly'
import smallestNum from '#fixtures/commands/smallest-num'
import stringUtil from '#fixtures/commands/string-util'
import tribonacci from '#fixtures/commands/tribonacci'
import TestSubject from '#lib/command'
import createProcess from '#tests/utils/create-process'
import errorSnapshot from '#tests/utils/error-snapshot'
import type {
  Action,
  CommandInfo,
  Exit,
  List,
  OptionValues,
  ParseOptions,
  Process
} from '@flex-development/kronk'
import type { Logger } from '@flex-development/log'
import pathe from '@flex-development/pathe'
import type { Constructor } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { MockInstance } from 'vitest'

describe('functional:lib/Command', () => {
  type ActionMock = MockInstance<Action>
  type GetActionSpy = (this: void, command: TestSubject) => ActionMock

  type ParseCase = [
    info: CommandInfo,
    argv: string[],
    hooks?: (this: void, argv: string[]) => ParseCaseHooks
  ]

  type ParseCaseHooks = {
    /**
     * After parse hook.
     *
     * @this {void}
     *
     * @param {Command} subject
     *  The command under test
     * @param {Command} result
     *  The command that was run
     * @return {undefined}
     */
    after?(this: void, subject: TestSubject, result: TestSubject): undefined

    /**
     * Before parse hook.
     *
     * @this {void}
     *
     * @param {Command} subject
     *  The command under test
     * @return {undefined}
     */
    before?(this: void, subject: TestSubject): undefined
  }

  let act: GetActionSpy
  let dn: GetActionSpy
  let nodeArgv: List<string>
  let options: ParseOptions

  beforeAll(() => {
    nodeArgv = ['node', pathe.fileURLToPath(import.meta.url)]
    options = { from: 'user' }

    /**
     * @this {void}
     *
     * @param {TestSubject} command
     *  The command under test
     * @return {MockInstance<Action>}
     *  Command action callback spy
     */
    act = function act(this: void, command: TestSubject): MockInstance<Action> {
      // @ts-expect-error [2445] testing.
      ok(command.info.action, 'expected command action callback')

      // @ts-expect-error [2445] testing.
      return vi.spyOn(command.info, 'action')
    }

    /**
     * @this {void}
     *
     * @param {TestSubject} command
     *  The command under test
     * @return {MockInstance<Action>}
     *  Command done callback spy
     */
    dn = function act(this: void, command: TestSubject): MockInstance<Action> {
      // @ts-expect-error [2445] testing.
      ok(command.info.done, 'expected command done callback')

      // @ts-expect-error [2445] testing.
      return vi.spyOn(command.info, 'done').mockImplementation(done)

      /**
       * @this {TestSubject}
       *
       * @return {undefined}
       */
      function done(this: TestSubject): undefined {
        return void this.exit()
      }
    }
  })

  describe('errors', () => {
    let exiter: Exit

    beforeEach(() => {
      exiter = vi.fn().mockName('exiter')
    })

    it.each<ParseCase>([
      [grease, [grease.name, '-j', 'info', '--markdown']],
      [grease, ['info', '-jm']],
      [grease, ['info', '--yaml', '--markdown']]
    ])('should error on conflicting option (%#)', async (
      info,
      argv
    ) => {
      void test(eid.conflicting_option, info, argv)
    })

    it.each<ParseCase>([
      [bun, ['--watch', 'server.mts', 'main.mts']],
      [bun, ['server.mts', 'main.mts', '--hot']],
      [clamp, [chars.digit0, chars.digit1]],
      [clamp, [chars.delimiter, chars.minus + chars.digit1, chars.digit1]],
      [grease, ['-w' + chars.equal + chars.digit1]],
      [grease, ['pack', 'CHANGELOG.md', 'LICENSE.md', 'README.md', 'dist']],
      [grease, [grease.name, 'tag', 'list', 'fab255b']],
      [
        tribonacci,
        [
          '-n' + chars.digit3,
          chars.digit0,
          chars.digit1,
          chars.digit2,
          chars.digit3
        ]
      ]
    ])('should error on excess command or option arguments (%#)', async (
      info,
      argv
    ) => {
      void test(eid.excess_arguments, info, argv)
    })

    it.each<ParseCase>([
      [bun, ['--shell=node', 'release']],
      [clamp, [chars.delimiter, chars.minus + chars.digit4]],
      [grease, [grease.name, 'pack']],
      [tribonacci, [chars.digit0, chars.digit1, '-n13', chars.digit2]],
      [
        tribonacci,
        ['-n' + chars.digit1, chars.lowercaseA, chars.digit0, chars.digit1]
      ]
    ])('should error on invalid command or option argument choice (%#)', async (
      info,
      argv
    ) => {
      info.process = createProcess({
        CLAMP_DEBUG: chars.lowercaseF,
        GREASE_PACK_GZIP_LEVEL: '-1'
      })

      void test(eid.invalid_argument, info, argv)
    })

    it.each<ParseCase>([
      [bun, []],
      [bun, [bun.name, 'app.mts', '--elide-lines']],
      [clamp, []],
      [clamp, [clamp.name, chars.digit5, '-M']],
      [grease, [grease.name, 'tag', 'create']],
      [stringUtil, ['join', chars.digit1 + chars.plus + chars.digit2, '-s']],
      [tribonacci, ['-n', chars.digit3, chars.digit3, chars.digit9]]
    ])('should error on missing command or option argument (%#)', async (
      info,
      argv
    ) => {
      void test(eid.missing_argument, info, argv)
    })

    it.each<ParseCase>([
      [mlly, [mlly.name, 'resolve', '#lib/command']]
    ])('should error on missing mandatory option (%#)', async (info, argv) => {
      void test(eid.missing_mandatory_option, info, argv)
    })

    it.each<ParseCase>([
      [greaseBad, [greaseBad.name, '--json']],
      [greaseBad, [greaseBad.name, '-j']],
      [greaseBad, ['info', '--markdown']],
      [greaseBad, ['info', '-m']]
    ])('should error on unknown implied option (%#)', async (
      info,
      argv
    ) => {
      void test(eid.unknown_implied_option, info, argv, KronkError)
    })

    it.each<ParseCase>([
      [average, ['--debug', chars.delimiter, '13', '26']],
      [bun, ['run.mts', '--import=./loader.mjs']],
      [grease, [grease.name, 'tag', '--list']],
      [grease, ['-m', 'info', '-y']],
      [mlly, [mlly.name, '-p' + chars.dot, 'resolve', 'a.mts', '-m', 'main']]
    ])('should error on unknown option (%#)', async (info, argv) => {
      void test(eid.unknown_option, info, argv)
    })

    /**
     * @async
     *
     * @this {void}
     *
     * @param {string} id
     *  Unique id representing the expected error
     * @param {CommandInfo} info
     *  Command info
     * @param {string[]} argv
     *  Command-line arguments
     * @param {Constructor<KronkError>} [Error=CommandError]
     *  The expected error constructor
     * @return {Promise<undefined>}
     */
    async function test(
      this: void,
      id: string,
      info: CommandInfo,
      argv: string[],
      Error: Constructor<KronkError> = CommandError
    ): Promise<undefined> {
      info.exit = exiter
      info.process ??= createProcess()

      // Arrange
      const method: 'parse' | 'parseAsync' = info.async ? 'parseAsync' : 'parse'
      const subject: TestSubject = new TestSubject(info)
      let error!: KronkError

      // Act
      try {
        await subject[method]([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(Error).and.have.property('id', id)
      expect(exiter).toHaveBeenCalledExactlyOnceWith(error)
      expect(info.process).to.have.property('exitCode', error.code)

      // Expect (conditional)
      if (Error === CommandError) {
        expect(error).to.have.property('command').be.instanceof(TestSubject)
      }

      // Expect (snapshot)
      expect(errorSnapshot(error)).toMatchSnapshot()

      return delete info.process, void 0
    }
  })

  describe('parsing', () => {
    let action: MockInstance<Action<any, any>> | undefined
    let done: MockInstance<Action<any, any>> | undefined
    let process: Process
    let log: MockInstance<Logger['log']>
    let message: string | undefined
    let subcommand: TestSubject | null | undefined

    afterEach(() => {
      action = undefined
      done = undefined
      message = undefined
      subcommand = undefined
    })

    beforeAll(() => {
      process = createProcess({ GREASE_COLOR: chars.true, PWD: pathe.cwd() })
    })

    it.each<ParseCase>([
      [average, []],
      [average, [average.name]],
      [average, [average.name, chars.digit3, chars.digit4, chars.digit5]],
      [average, [chars.digit3, chars.digit6, chars.digit9]],
      [
        bun,
        [bun.name, 'init', 'packages/types', '-ym'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[1]!)!
              ok(subcommand, 'expected `subcommand`')
              return void this
            }
          }
        }
      ],
      [
        bun,
        ['--tsconfig-override=tsconfig.prod.json', 'src/main.mts'],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              ok(subject.defaultCommand, 'expected `subject.defaultCommand`')
              subcommand = subject.defaultCommand
              return void this
            }
          }
        }
      ],
      [clamp, ['-M3', '-m-1', chars.delimiter, '-13']],
      [clamp, ['-M=26', chars.digit9]],
      [clamp, [chars.digit1, '--max', '26', '--min=13']],
      [clamp, [clamp.name, chars.digit3, '--max', '13', '--min=']],
      [grease, [grease.name]],
      [
        Object.assign({}, grease, { actionOverride: true as const }),
        ['--help'],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @return {undefined}
             */
            before(this: void): undefined {
              return message = '', void this
            }
          }
        }
      ],
      [
        Object.assign({}, grease, { help: true as const }),
        ['help'],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.helpCommand()
              ok(subcommand, 'expected `subcommand`')
              return message = '', void this
            }
          }
        }
      ],
      [
        Object.assign({}, grease, { actionOverride: true as const }),
        [grease.name, 'bump', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[1]!)!
              ok(subcommand, 'expected `subcommand`')
              return message = '', void this
            }
          }
        }
      ],
      [
        Object.assign({}, grease, { help: true as const }),
        [grease.name, 'bump', 'help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[1]!)!
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.helpCommand()
              ok(subcommand, 'expected `subcommand`')
              return message = '', void this
            }
          }
        }
      ],
      [
        Object.assign({}, grease, { actionOverride: true as const }),
        ['-u', '--version'],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @return {undefined}
             */
            before(this: void): undefined {
              return message = grease.version, void this
            }
          }
        }
      ],
      [
        grease,
        ['-ju', '--level=verbose', 'bump', '--preid=alpha', 'recommend'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[2]!)!
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv.at(-1)!)!
              ok(subcommand, 'expected `subcommand`')
              return void this
            }
          }
        }
      ],
      [
        grease,
        ['ch', '-wr=0', '-t$(jq .version package.json -r)'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.findCommand(argv[0])
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        grease,
        ['changelog', '-wo$NOTES_FILE'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[0]!)!
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'pack', '-o', '%s-%v.tgz'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[1]!)!
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        grease,
        [
          grease.name,
          'tag',
          'create',
          '-p',
          '-s',
          '-m=release: {tag}',
          grease.version
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[1]!)!
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv[2]!)!
              ok(subcommand, 'expected `subcommand`')
              return void this
            }
          }
        }
      ],
      [
        Object.assign({}, mlly, { actionOverride: true as const }),
        ['--version'],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @return {undefined}
             */
            before(this: void): undefined {
              return message = mlly.version, void this
            }
          }
        }
      ],
      [
        Object.assign({}, mlly, { actionOverride: true as const }),
        [mlly.name, 'resolve', '--version'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[1]!)!
              ok(subcommand, 'expected `subcommand`')

              message = subcommand.version()!
              ok(message, 'expected `subcommand` version')

              return void this
            }
          }
        }
      ],
      [
        mlly,
        ['resolve', '#internal/tokenize', `--parent=${chars.dot}`],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[0]!)!
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        mlly,
        [
          mlly.name,
          '-p' + chars.dot,
          'resolve',
          '#lib/command',
          '--conditions=kronk',
          '-c',
          'development',
          '--ps',
          '-c' + 'node'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[2]!)!
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        smallestNum,
        [
          smallestNum.aliases,
          chars.digit0,
          chars.digit0,
          chars.digit3,
          chars.digit5
        ]
      ],
      [
        stringUtil,
        [
          'join',
          '-s' + chars.slash,
          chars.lowercaseA + chars.slash + chars.lowercaseZ
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              subcommand = subject.commands().get(argv[0]!)!
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        tribonacci,
        [chars.digit3, chars.digit3, '-n' + chars.digit3, chars.digit9]
      ]
    ])('should run command (%#)', async (info, argv, hooks) => {
      const { after, before } = hooks?.(argv) ?? {}

      // Arrange
      const subject: TestSubject = new TestSubject({ ...info, process })
      let command: TestSubject
      let opts: OptionValues
      let optsWithGlobals: OptionValues
      let result: TestSubject

      // Act
      before?.(subject)
      command = subcommand ?? subject
      command.action(vi.fn().mockName('action')).done(vi.fn().mockName('done'))
      action ??= act(command)
      done ??= dn(command)
      log = vi.spyOn(command.logger, 'log')
      result = await subject[info.async ? 'parseAsync' : 'parse'](argv, options)
      opts = result.opts()
      optsWithGlobals = result.optsWithGlobals()

      // Expect (conditional)
      if (info.actionOverride) {
        expect(action).not.toHaveBeenCalled()
        expect(log).toHaveBeenCalledExactlyOnceWith(message)
        expect(done).toHaveBeenCalledAfter(log)
      } else if (info.help) {
        expect(action).toHaveBeenCalledOnce()
        expect(action.mock.contexts[0]).to.eq(result)
        expect(action.mock.lastCall).to.eql([opts, ...result.args])
        expect(done).toHaveBeenCalledAfter(action)
      } else {
        expect(action).toHaveBeenCalledOnce()
        expect(action.mock.contexts[0]).to.eq(result)
        expect(action.mock.lastCall).to.eql([opts, ...result.args])
        expect(done).toHaveBeenCalledAfter(action)
      }

      // Expect
      expect(done).toHaveBeenCalledOnce()
      expect(done.mock.contexts[0]).to.eq(result)
      expect(done.mock.lastCall).to.eql([optsWithGlobals, ...result.args])

      // Expect (conditional)
      if (after) {
        expect.hasAssertions(), after(subject, result)
      } else if (subcommand) {
        expect(result).to.eq(subcommand).and.not.eq(subject)
      } else {
        expect(result).to.eq(subject)
      }

      // Expect (snapshot)
      expect(result.snapshot()).toMatchSnapshot()
    })
  })
})
