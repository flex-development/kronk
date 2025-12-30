/**
 * @file Functional Tests - Command
 * @module kronk/lib/tests/functional/Command
 */

import chars from '#enums/chars'
import eid from '#enums/keid'
import CommandError from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import clamp from '#fixtures/commands/clamp'
import copy from '#fixtures/commands/copy'
import distinct from '#fixtures/commands/distinct'
import factorial from '#fixtures/commands/factorial'
import grease from '#fixtures/commands/grease'
import greaseBad from '#fixtures/commands/grease-bad'
import mlly from '#fixtures/commands/mlly'
import semver from '#fixtures/commands/semver'
import smallestNum from '#fixtures/commands/smallest-num'
import tribonacci from '#fixtures/commands/tribonacci'
import TestSubject from '#lib/command'
import Help from '#lib/help'
import createProcess from '#tests/utils/create-process'
import errorSnapshot from '#tests/utils/error-snapshot'
import digits from '#utils/digits'
import type {
  Action,
  CommandInfo,
  Exit,
  List,
  OptionValues,
  ParseOptions,
  Process,
  WriteStream
} from '@flex-development/kronk'
import pathe from '@flex-development/pathe'
import { constant, type Constructor } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { MockInstance } from 'vitest'

describe('functional:lib/Command', () => {
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

  let nodeArgv: List<string>
  let options: ParseOptions

  beforeAll(() => {
    nodeArgv = ['node', pathe.fileURLToPath(import.meta.url)]
    options = { from: 'user' }
  })

  describe('errors', () => {
    let exiter: Exit

    beforeEach(() => {
      exiter = vi.fn().mockName('exiter')
    })

    it.each<ParseCase>([
      [grease, [grease.name, 'changelog', '-nsw']],
      [grease, [grease.name, '-j', 'info', '--markdown']],
      [grease, ['info', '--yaml', '--markdown']]
    ])('should error on conflicting option (%#)', async (
      info,
      argv
    ) => {
      void test(eid.conflicting_option, info, argv)
    })

    it.each<ParseCase>([
      [clamp, [chars.delimiter, chars.minus + chars.digit1, chars.digit1]],
      [copy, [copy.aliases, './index.mjs', './dist', './lib']],
      [factorial, [factorial.name, chars.digit1, chars.digit3]],
      [grease, [grease.name, 'changelog', '-sw1']],
      [grease, [grease.name, 'changelog', 'changelog.md']],
      [grease, [grease.subcommands.distTag.name, '1.0.0', '2.0.0-alpha.1']],
      [semver, [semver.name, semver.version, semver.subcommands.parse.version]],
      [semver, [copy.version, grease.version]],
      [semver, [semver.version, '-l1']]
    ])('should error on excess command or option arguments (%#)', async (
      info,
      argv
    ) => {
      void test(eid.excess_arguments, info, argv)
    })

    it.each<ParseCase>([
      [clamp, ['-m13', chars.digit0]],
      [grease, [grease.name, 'pack']],
      [
        tribonacci,
        [
          tribonacci.name,
          chars.digit0,
          chars.digit1,
          chars.digit2,
          '-n' + chars.digit0
        ]
      ],
      [
        tribonacci,
        [
          '-n' + chars.digit1,
          chars.lowercaseA,
          chars.digit2,
          chars.digit3
        ]
      ]
    ])('should error on invalid command or option argument choice (%#)', async (
      info,
      argv
    ) => {
      info.process = createProcess({
        CLAMP_DEBUG: 'verbose',
        GREASE_PACK_GZIP_LEVEL: '-1'
      })

      void test(eid.invalid_argument, info, argv)
    })

    it.each<ParseCase>([
      [clamp, []],
      [clamp, [clamp.name, chars.digit5, '-M']],
      [copy, [copy.name]],
      [copy, [copy.aliases]],
      [grease, [grease.subcommands.bump.aliases]],
      [grease, [grease.subcommands.distTag.name]],
      [grease, [grease.name, 'manifest', '--manifest', 'get', 'name']],
      [grease, ['manifest', 'set']],
      [smallestNum, []],
      [tribonacci, ['-n' + chars.digit3, chars.digit3, chars.digit9]]
    ])('should error on missing command or option argument (%#)', async (
      info,
      argv
    ) => {
      void test(eid.missing_argument, info, argv)
    })

    it.each<ParseCase>([
      [grease, ['publish', '@flex-development-kronk-1.0.0.tgz']],
      [mlly, [mlly.name, 'resolve', '#lib/command']],
      [tribonacci, [chars.digit1, chars.digit2, chars.digit3]]
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
      [copy, [copy.aliases, './index.mts', '--debug']],
      [factorial, [factorial.name, '-V', chars.digit3]],
      [grease, [grease.name, 'tag', '--list']],
      [grease, ['-m', 'info', '-y']],
      [mlly, [mlly.name, '-p' + chars.dot, 'resolve', 'a.mts', '-m', 'main']],
      [semver, [semver.name, semver.version, '-S']]
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
     *  The command-line arguments
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
    let helpCommand: TestSubject | null | undefined
    let process: Process
    let subcommand: TestSubject | null | undefined

    afterEach(() => {
      helpCommand = undefined
      subcommand = undefined
    })

    beforeAll(() => {
      process = createProcess({ GREASE_COLOR: chars.true, PWD: pathe.cwd() })
    })

    beforeEach(() => {
      vi.spyOn(Help.prototype, 'text').mockImplementation(constant(chars.empty))
    })

    it.each<[version: string, ...ParseCase]>([
      [clamp.version.version, clamp, ['--version']],
      [clamp.version.version, clamp, [clamp.name, '-v', chars.digit3]],
      [copy.version, copy, [copy.aliases, '--version']],
      [copy.version, copy, [copy.aliases, '-v']],
      [copy.version, copy, ['--version']],
      [copy.version, copy, ['-v']],
      [factorial.version, factorial, [factorial.name, '--version']],
      [factorial.version, factorial, [factorial.name, '-v']],
      [factorial.version, factorial, ['--version']],
      [factorial.version, factorial, ['-v']],
      [grease.version, grease, ['--version']],
      [grease.version, grease, ['-v']],
      [grease.version, grease, ['-vc' + chars.equal + chars.digit2]],
      [grease.version, grease, [grease.name, '-vj']],
      [semver.version, semver, ['--version']],
      [semver.version, semver, [semver.name, '--version']],
      [smallestNum.version, smallestNum, [smallestNum.name, '--version']],
      [smallestNum.version, smallestNum, [smallestNum.name, '-v']],
      [smallestNum.version, smallestNum, [smallestNum.aliases, '--version']],
      [smallestNum.version, smallestNum, [smallestNum.aliases, '-v']],
      [smallestNum.version, smallestNum, ['--version']],
      [smallestNum.version, smallestNum, ['-v']],
      [tribonacci.version, tribonacci, [tribonacci.name, '--version']],
      [tribonacci.version, tribonacci, [tribonacci.name, '-v']],
      [tribonacci.version, tribonacci, ['--version']],
      [tribonacci.version, tribonacci, ['-v']],
      [
        semver.subcommands.parse.version,
        semver,
        [semver.name, 'parse', '-v'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver.subcommands.satisfies.subcommands.max.version,
        semver,
        ['satisfies', 'max', '--version'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv[1]!)!
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ]
    ])('should print command version (%#)', async (
      version,
      info,
      argv,
      hooks
    ) => {
      const { before } = hooks?.(argv) ?? {}
      const { async: isAsync, ...rest } = info

      // Arrange
      const done: MockInstance<Action> = vi.fn().mockName('done')
      const subject: TestSubject = new TestSubject({ ...rest, process })
      let command: TestSubject
      let opts: OptionValues
      let optsWithGlobals: OptionValues
      let printVersion: MockInstance<Action>
      let result: TestSubject
      let write: MockInstance<WriteStream['write']>

      // Act
      before?.(subject)
      command = subcommand ?? subject
      command.done(done as unknown as Action) // @ts-expect-error [2445] testing
      printVersion = vi.spyOn(command, 'printVersion')
      write = vi.spyOn(process.stdout, 'write')
      result = await subject[isAsync ? 'parseAsync' : 'parse'](argv, options)
      opts = result.opts()
      optsWithGlobals = result.optsWithGlobals()

      // Expect
      expect(result).to.eq(command)
      expect(opts).to.have.property('version', version)
      expect(optsWithGlobals).to.have.property('version', version)
      expect(printVersion).toHaveBeenCalledOnce()
      expect(printVersion.mock.contexts[0]).to.eq(result)
      expect(printVersion.mock.lastCall).to.eql([opts, ...result.args])
      expect(done).toHaveBeenCalledAfter(printVersion)
      expect(done).toHaveBeenCalledOnce()
      expect(done.mock.contexts[0]).to.eq(result)
      expect(done.mock.lastCall).to.eql([optsWithGlobals, ...result.args])

      // Expect (version conditional)
      if (version) {
        expect(write).toHaveBeenCalledExactlyOnceWith(version + chars.lf)
        expect(done).toHaveBeenCalledAfter(write)
      } else {
        expect(write).not.toHaveBeenCalled()
      }

      // Expect (subcommand conditional)
      if (subcommand) expect(result).to.not.eq(subject)
    })

    it.each<ParseCase>([
      [copy, [copy.aliases, '--help']],
      [copy, [copy.aliases, '-h']],
      [copy, ['--help']],
      [copy, ['-h']],
      [distinct, [distinct.name, '--help']],
      [distinct, [distinct.name, '-h']],
      [distinct, ['--help']],
      [distinct, ['-h']],
      [factorial, [factorial.name, '--help']],
      [factorial, [factorial.name, '-h']],
      [factorial, ['--help']],
      [factorial, ['-h']],
      [grease, []],
      [grease, ['-w']],
      [grease, [grease.name]],
      [grease, [grease.name, '--help']],
      [grease, [grease.name, '-h']],
      [grease, ['--help']],
      [grease, ['-h']],
      [semver, [semver.name, '--help']],
      [semver, [semver.name, '-h']],
      [semver, ['--help']],
      [semver, ['-h']],
      [smallestNum, [smallestNum.name, '--help']],
      [smallestNum, [smallestNum.name, '-h']],
      [smallestNum, [smallestNum.aliases, '--help']],
      [smallestNum, [smallestNum.aliases, '-h']],
      [smallestNum, ['--help']],
      [smallestNum, ['-h']],
      [tribonacci, [tribonacci.name, '--help']],
      [tribonacci, [tribonacci.name, '-h']],
      [tribonacci, ['--help']],
      [tribonacci, ['-h']],
      [
        grease,
        [grease.name, 'help'],
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
              return helpCommand = subject.helpCommand(), void this
            }
          }
        }
      ],
      [
        grease,
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
              return helpCommand = subject.helpCommand(), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'manifest'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        ['manifest', '-M' + 'packages/api/package.json'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'tag'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        ['tag'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'tag', '--help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'tag', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        ['tag', '--help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        ['tag', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        [semver.name, 'help'],
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
              return helpCommand = subject.helpCommand(), void this
            }
          }
        }
      ],
      [
        semver,
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
              return helpCommand = subject.helpCommand(), void this
            }
          }
        }
      ],
      [
        semver,
        [semver.name, 'parse', '--help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        [semver.name, 'parse', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        ['parse', '--help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        ['parse', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        [semver.name, 'satisfies', '--help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        [semver.name, 'satisfies', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        ['satisfies', '--help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        ['satisfies', '-h'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        semver,
        [semver.name, 'satisfies', 'help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return helpCommand = subcommand.helpCommand(), void this
            }
          }
        }
      ],
      [
        semver,
        ['satisfies', 'help'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              ok(subcommand, 'expected `subcommand`')
              return helpCommand = subcommand.helpCommand(), void this
            }
          }
        }
      ]
    ])('should print help text for command (%#)', async (
      info,
      argv,
      hooks
    ) => {
      const { before } = hooks?.(argv) ?? {}
      const { async: isAsync, ...rest } = info

      // Arrange
      const done: MockInstance<Action> = vi.fn().mockName('done')
      const subject: TestSubject = new TestSubject({ ...rest, process })
      let command: TestSubject
      let help: Help
      let opts: OptionValues
      let optsWithGlobals: OptionValues
      let printHelp: MockInstance<Action>
      let result: TestSubject
      let write: MockInstance<WriteStream['write']>

      // Act
      before?.(subject)
      command = subcommand ?? subject
      command.done(done as unknown as Action)
      help = command.help() // @ts-expect-error [2445] testing.
      printHelp = vi.spyOn(command, 'printHelp')
      write = vi.spyOn(process.stdout, 'write')
      result = await subject[isAsync ? 'parseAsync' : 'parse'](argv, options)
      opts = result.opts()
      optsWithGlobals = result.optsWithGlobals()

      // Expect
      expect(result).to.eq(helpCommand ?? command)
      expect(printHelp).toHaveBeenCalledOnce()
      expect(printHelp.mock.contexts[0]).to.eq(helpCommand ? command : result)
      expect(printHelp.mock.lastCall).to.eql([opts, ...result.args])
      expect(write).toHaveBeenCalledExactlyOnceWith(help.text(command))
      expect(done).toHaveBeenCalledAfter(printHelp)
      expect(done).toHaveBeenCalledAfter(write)
      expect(done).toHaveBeenCalledOnce()
      expect(done.mock.contexts[0]).to.eq(result)
      expect(done.mock.lastCall).to.eql([optsWithGlobals, ...result.args])

      // Expect (subcommand conditional)
      if (subcommand) expect(result).to.not.eq(subject)
    })

    it.each<ParseCase>([
      [clamp, [chars.digit0]],
      [clamp, [clamp.name, chars.digit1]],
      [clamp, [chars.digit3, '-M', '13', '--min=']],
      [clamp, ['-M3', '-m-1', chars.delimiter, '-13']],
      [clamp, ['--min=13', '--max', '26', chars.digit1]],
      [copy, [copy.name, './dist/index.mjs']],
      [copy, [copy.aliases, './src/global.d.mts', './dist/global.d.mts']],
      [copy, ['./src/main.mjs']],
      [copy, ['./src/typings/*.d.mts', './dist/typings']],
      [distinct, []],
      [distinct, [distinct.name]],
      [distinct, [distinct.name, ...digits, ...digits]],
      [distinct, [chars.digit0, chars.digit0, chars.digit1]],
      [
        smallestNum,
        [smallestNum.name, chars.digit3, chars.digit4, chars.digit5]
      ],
      [
        grease,
        [grease.name, 'bump', 'major'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [
          grease.subcommands.bump.aliases,
          '3.1.3',
          'package.json',
          'versions.json',
          '-jT=grease@'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'bump', 'recommend'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              subcommand = subcommand.commands().get(argv.at(-1)!)!
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        ['-ju', '--log-level=verbose', 'bump', '--preid=alpha', 'recommend'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        [
          grease.subcommands.bump.aliases,
          'recommend',
          '-u' + chars.false,
          '1.0.0-alpha.3'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv[1]!)!
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [
          grease.name,
          '-w',
          'changelog',
          '-r' + chars.equal + chars.digit0,
          '-t$(jq .version package.json -r)'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
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
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, grease.subcommands.distTag.name, '2.0.0-beta.4'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [
          grease.subcommands.distTag.name,
          'grease@3.0.0-alpha.10',
          '-T=grease@'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        [grease.name, 'manifest', '-M=package.json', 'get', 'version'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              subcommand = subcommand.commands().get(argv.at(-2)!)!
              return ok(subcommand, 'expected `subcommand`'), void this
            }
          }
        }
      ],
      [
        grease,
        ['manifest', 'set', 'name=@flex-development/kronk', 'version=0.0.0'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv[1]!)!
              return ok(subcommand, 'expected `subcommand`'), void this
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
         *  The command-line arguments
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
          'pack',
          '-o' + '%s-%v.tgz',
          'CHANGELOG.md',
          'LICENSE.md',
          'README.md',
          'dist',
          '--gzip' + chars.equal + chars.digit9
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        [grease.name, 'publish', '-PR=https://npm.pkg.github.com'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
          'publish',
          '--registry=https://registry.npmjs.org',
          '--tag=beta',
          'package.tgz'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        [grease.name, 'tag', 'create', grease.version, '-psm=release: {tag}'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        grease,
        [grease.name, 'tag', 'list'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        grease,
        ['tag', grease.subcommands.tag.subcommands.list.aliases[0]],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv[1]!)!
              ok(subcommand, 'expected `subcommand`')
              return void this
            }
          }
        }
      ],
      [
        mlly,
        [mlly.name, 'resolve', '#internal/tokenize', '-p' + chars.dot],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        mlly,
        [
          '--parent' + chars.equal + chars.dot,
          'resolve',
          '--ps',
          '--conditions=kronk',
          '-c' + 'node',
          '-c',
          'development',
          '#lib/command'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        semver,
        [semver.name, semver.version],
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
              subcommand = subject.defaultCommand
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        semver,
        [copy.version],
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
              subcommand = subject.defaultCommand
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        semver,
        ['--loose', chars.space + semver.subcommands.parse.version],
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
              subcommand = subject.defaultCommand
              return void ok(subcommand, 'expected `subcommand`')
            }
          }
        }
      ],
      [
        semver,
        ['parse', semver.subcommands.satisfies.subcommands.max.version],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        semver,
        [semver.name, 'satisfies', '1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
        semver,
        [
          'satisfies',
          'max',
          '>=3.0.0',
          copy.version,
          grease.version,
          semver.subcommands.satisfies.subcommands.max.version,
          semver.subcommands.parse.version
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  The command-line arguments
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
              ok(subcommand, 'expected `subcommand`')
              subcommand = subcommand.commands().get(argv[1]!)!
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
      const { async: isAsync, ...rest } = info

      // Arrange
      const action: MockInstance<Action> = vi.fn().mockName('action')
      const done: MockInstance<Action> = vi.fn().mockName('done')
      const subject: TestSubject = new TestSubject(rest)
      let command: TestSubject
      let opts: OptionValues
      let optsWithGlobals: OptionValues
      let result: TestSubject

      // Act
      before?.(subject)
      command = subcommand ?? subject
      command.action(action as unknown as Action)
      command.done(done as unknown as Action)
      result = await subject[isAsync ? 'parseAsync' : 'parse'](argv, options)
      opts = result.opts()
      optsWithGlobals = result.optsWithGlobals()

      // Expect
      expect(action).toHaveBeenCalledOnce()
      expect(action.mock.contexts[0]).to.eq(result)
      expect(action.mock.lastCall).to.eql([opts, ...result.args])
      expect(done).toHaveBeenCalledAfter(action)
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
