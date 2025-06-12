/**
 * @file Functional  Tests - Command
 * @module kronk/lib/tests/functional/Command
 */

import chars from '#enums/chars'
import average from '#fixtures/commands/average'
import clamp from '#fixtures/commands/clamp'
import dateformat from '#fixtures/commands/dateformat'
import mlly from '#fixtures/commands/mlly'
import smallest from '#fixtures/commands/smallest-num'
import stringUtil from '#fixtures/commands/string-util'
import tribonacci from '#fixtures/commands/tribonacci'
import date from '#fixtures/date'
import process from '#fixtures/process'
import isList from '#internal/is-list'
import TestSubject from '#lib/command'
import findCommand from '#tests/utils/find-command'
import isCommandError from '#utils/is-command-error'
import type {
  Action,
  CommandInfo,
  List,
  OptionValues
} from '@flex-development/kronk'
import type { InputLogObject } from '@flex-development/log'
import { defaultConditions as mConditions } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import { omit, shake, type Fn } from '@flex-development/tutils'
import { masks } from 'dateformat'
import { ok } from 'devlop'
import type { MockInstance } from 'vitest'

describe('functional:lib/Command', () => {
  type CreateActionSpy = Fn<[TestSubject], MockInstance<Action>>
  type Fatal = MockInstance<TestSubject['logger']['fatal']>
  type FatalCase = [info: CommandInfo, argv: string[]]
  type FatalSnapshot = Fn<[unknown], unknown>

  type ParseCase = [
    info: CommandInfo,
    argv: string[],
    hooks: Fn<[argv: ParseCase[1]], ParseCaseHooks>
  ]

  type ParseCaseHooks = {
    after: Fn<[
      subject: TestSubject,
      result: TestSubject,
      opts: OptionValues,
      optsWithGlobals: OptionValues
    ], undefined>
    before: Fn<[subject: TestSubject], undefined>
  }

  let act: CreateActionSpy
  let dn: CreateActionSpy
  let fatalSnapshot: FatalSnapshot
  let nodeArgv: List<string>

  beforeAll(() => {
    nodeArgv = ['node', pathe.fileURLToPath(import.meta.url)]

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
      return vi.spyOn(command.info, 'done')
    }

    /**
     * @this {void}
     *
     * @param {unknown} value
     *  First argument of the last call to `logger.fatal`
     * @return {unknown}
     *  `value`
     */
    fatalSnapshot = function snapshot(this: void, value: unknown): unknown {
      return Object.defineProperties(value, { toJSON: { value: toJSON } })

      /**
       * @this {InputLogObject}
       *
       * @return {Record<string, any>}
       *  JSON representation of `value`
       */
      function toJSON(this: InputLogObject): Record<string, any> {
        ok(isCommandError(this.message), 'expected command error `message`')
        ok(!this.stack, 'expected no `stack`')

        return shake({
          additional: this.additional,
          args: this.args,
          color: this.color,
          date: this.date,
          format: this.format,
          icon: this.icon,
          level: this.level,
          message: omit(this.message.toJSON(), ['stack']),
          tag: this.tag,
          type: this.type
        })
      }
    }
  })

  describe('#checkChoices', () => {
    let argv: string[]
    let choice: string
    let error: unknown
    let fatal: Fatal
    let id: string
    let subject: TestSubject

    afterEach(() => {
      error = undefined
    })

    beforeAll(() => {
      subject = new TestSubject({ ...tribonacci, process })

      choice = chars.digit1 + chars.digit3
      id = 'kronk/invalid-argument'

      argv = [...nodeArgv, chars.digit1, chars.digit3, choice,
        '-n' + chars.digit1]
    })

    beforeEach(() => {
      fatal = vi.spyOn(subject.logger, 'fatal')
    })

    it('should error on invalid command-argument choice', () => {
      // Act
      try {
        subject.parse(argv)
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', id)
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })

    it('should error on invalid option-argument choice', () => {
      // Act
      try {
        subject.parse([...argv, '-n', choice])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', id)
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })
  })

  describe('#checkCommandArguments', () => {
    let error: unknown
    let fatal: Fatal
    let subject: TestSubject

    afterEach(() => {
      error = undefined
    })

    it.each<FatalCase>([
      [clamp, [chars.digit0, chars.digit1]],
      [stringUtil, ['split', chars.lowercaseA, chars.comma, chars.lowercaseB]]
    ])('should error on excess arguments (%#)', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        subject.parse([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', 'kronk/excess-arguments')
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })

    it.each<FatalCase>([
      [clamp, []],
      [tribonacci, ['-n', chars.digit3, chars.digit0, chars.digit0]]
    ])('should error on missing required argument', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        subject.parse([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', 'kronk/missing-required-argument')
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })
  })

  describe('#checkForMissingMandatoryOptions', () => {
    let error: unknown
    let fatal: Fatal
    let subject: TestSubject

    afterEach(() => {
      error = undefined
    })

    it.each<FatalCase>([
      [mlly, ['resolve', chars.dot]],
      [tribonacci, [chars.digit1, chars.digit3, chars.digit9]]
    ])('should error on missing mandatory option (%#)', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        await subject.parseAsync([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', 'kronk/missing-mandatory-option')
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })
  })

  describe('#checkForUnknownOptions', () => {
    let error: unknown
    let fatal: Fatal
    let subject: TestSubject

    afterEach(() => {
      error = undefined
    })

    it.each<FatalCase>([
      [mlly, ['--parent', import.meta.url, '-c=kronk', 'resolve', chars.dot]],
      [mlly, ['-p' + import.meta.url, 'resolve', chars.dot, '--verbose']]
    ])('should error on unknown option (%#)', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        await subject.parseAsync([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', 'kronk/unknown-option')
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })
  })

  describe('#parse', () => {
    let action: MockInstance<Action<any, any>>
    let done: MockInstance<Action<any, any>>

    ok(average.name, 'expected `average.name`')
    ok(clamp.name, 'expected `clamp.name`')

    it.each<ParseCase>([
      [
        average,
        [],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv)

              expect(opts).to.eql({})

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        average,
        [average.name, chars.digit0, chars.digit1, chars.digit2],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(1))

              expect(opts).to.eql({})
              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        clamp,
        [clamp.name, chars.digit3],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.be.of.length(1).and.each.be.a('number')
              expect(result.argv).to.eql(argv.slice(-1))

              expect(opts).to.have.keys(['debug', 'max', 'min'])
              expect(opts).to.have.property('debug', false)
              expect(opts).to.have.property('max', Number.MAX_SAFE_INTEGER)
              expect(opts).to.have.property('min', +chars.digit0)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        clamp,
        [clamp.name, '--debug', chars.digit3],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.be.of.length(1).and.each.be.a('number')
              expect(result.argv).to.eql(argv.slice(-1))

              expect(opts).to.have.keys(['debug', 'max', 'min'])
              expect(opts).to.have.property('debug', true)
              expect(opts).to.have.property('max', Number.MAX_SAFE_INTEGER)
              expect(opts).to.have.property('min', +chars.digit0)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        clamp,
        [chars.digit3, '--max', chars.digit3],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.be.of.length(1).and.each.be.a('number')
              expect(result.argv).to.eql([argv[0]])

              expect(opts).to.have.keys(['debug', 'max', 'min'])
              expect(opts).to.have.property('debug', false)
              expect(opts).to.have.property('max', +chars.digit3)
              expect(opts).to.have.property('min', +chars.digit0)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        clamp,
        ['39', '-M=26'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.be.of.length(1).and.each.be.a('number')
              expect(result.argv).to.eql([argv[0]])

              expect(opts).to.have.keys(['debug', 'max', 'min'])
              expect(opts).to.have.property('debug', false)
              expect(opts).to.have.property('max', 26)
              expect(opts).to.have.property('min', +chars.digit0)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        clamp,
        ['-M3', '-m-1', chars.delimiter, '-13'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.be.of.length(1).and.each.be.a('number')
              expect(result.argv).to.eql(argv.slice(-1))

              expect(opts).to.have.keys(['debug', 'max', 'min'])
              expect(opts).to.have.property('debug', false)
              expect(opts).to.have.property('max', +chars.digit3)
              expect(opts).to.have.property('min', -1)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        stringUtil,
        [],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv)

              expect(opts).to.have.keys(['separator'])
              expect(opts).to.have.property('separator', chars.comma)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        stringUtil,
        ['join', chars.digit1, chars.digit3],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          ok(argv.length, 'expected command-line arguments')

          /**
           * Subcommand name.
           *
           * @const {string} subcmd
           */
          const subcmd: string = argv[0]!

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(1))
              expect(result.id()).to.eq(subcmd)

              expect(opts).to.eql({})

              expect(optsWithGlobals).to.have.keys(['separator'])
              expect(optsWithGlobals).to.have.property('separator', chars.comma)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, subcmd)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        tribonacci,
        ['-n', chars.digit3, chars.digit0, chars.digit0, chars.digit1],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(2))
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['debug', 'n'])
              expect(opts).to.have.property('debug', undefined)
              expect(opts).to.have.property('n', chars.digit3)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, null)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        tribonacci,
        ['-n=' + chars.digit3, chars.digit1, chars.digit1, chars.digit2],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(1))
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['debug', 'n'])
              expect(opts).to.have.property('debug', undefined)
              expect(opts).to.have.property('n', chars.digit3)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, null)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        tribonacci,
        ['-dn' + chars.digit3, chars.digit2, chars.digit2, chars.digit3],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(1))
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['debug', 'n'])
              expect(opts).to.have.property('debug', true)
              expect(opts).to.have.property('n', chars.digit3)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, null)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ]
    ])('should run command (%#)', (info, argv, hooks) => {
      const { after, before } = hooks(argv)

      // Arrange
      const subject: TestSubject = new TestSubject({ ...info, process })
      let opts: OptionValues
      let optsWithGlobals: OptionValues
      let result: TestSubject

      // Act
      before(subject)
      result = subject.parse(argv, { from: 'user' })
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
      expect.hasAssertions(), after(subject, result, opts, optsWithGlobals)
    })
  })

  describe('#parseAsync', () => {
    let action: MockInstance<Action<any, any>>
    let cwd: URL
    let done: MockInstance<Action<any, any>>
    let parent: URL

    ok(mlly.name, 'expected `mlly.name`')
    ok(Array.isArray(smallest.aliases), 'expected `smallest.aliases`')

    ok(!dateformat.name, 'expected no `dateformat.name`')
    ok(dateformat.subcommands, 'expected `dateformat.subcommands`')
    ok(!TestSubject.isCommand(dateformat.subcommands))
    ok(!isList(dateformat.subcommands))
    ok(typeof dateformat.subcommands === 'object')
    ok(typeof dateformat.subcommands.aliases === 'string')

    beforeAll(() => {
      cwd = pathe.pathToFileURL(pathe.cwd())
      parent = new URL(import.meta.url)
    })

    it.each<ParseCase>([
      [
        dateformat,
        [],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv)
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['gmt', 'mask', 'utc'])
              expect(opts).to.have.property('gmt', false)
              expect(opts).to.have.property('mask', masks.default)
              expect(opts).to.have.property('utc', false)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        dateformat,
        ['--mask', 'isoDate'],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql([])
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['gmt', 'mask', 'utc'])
              expect(opts).to.have.property('gmt', false)
              expect(opts).to.have.property('mask', masks.isoDate)
              expect(opts).to.have.property('utc', false)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        dateformat,
        ['-gm' + 'isoDate', date.toString()],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql([argv[1]])
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['gmt', 'mask', 'utc'])
              expect(opts).to.have.property('gmt', true)
              expect(opts).to.have.property('mask', masks.isoDate)
              expect(opts).to.have.property('utc', false)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        dateformat,
        ['-um' + chars.equal + 'isoTime', date.toString()],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql([argv[1]])
              expect(result.id()).to.be.null

              expect(opts).to.have.keys(['gmt', 'mask', 'utc'])
              expect(opts).to.have.property('gmt', false)
              expect(opts).to.have.property('mask', masks.isoTime)
              expect(opts).to.have.property('utc', true)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        dateformat,
        [dateformat.subcommands.aliases, date.toString()],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              ok(dateformat.subcommands, 'expected `dateformat.subcommands`')
              ok(!TestSubject.isCommand(dateformat.subcommands))
              ok(!isList(dateformat.subcommands))
              ok(typeof dateformat.subcommands === 'object')

              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(1))
              expect(result.id()).to.eq(dateformat.subcommands.name)

              expect(opts).to.eql({})

              expect(optsWithGlobals).to.have.keys(['gmt', 'mask', 'utc'])
              expect(optsWithGlobals).to.have.property('gmt', false)
              expect(optsWithGlobals).to.have.property('mask', masks.default)
              expect(optsWithGlobals).to.have.property('utc', false)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, argv[0]!)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        mlly,
        ['--parent' + chars.equal + import.meta.url],
        /**
         * @this {void}
         *
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void): ParseCaseHooks {
          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql([])

              expect(opts).to.have.keys(['cwd', 'debug', 'parent'])
              expect(opts).to.have.property('cwd').eql(cwd)
              expect(opts).to.have.property('debug', false)
              expect(opts).to.have.property('parent').eql(parent)

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void this
            }
          }
        }
      ],
      [
        mlly,
        [mlly.name, '-p' + import.meta.url, 'resolve', chars.dot],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          /**
           * Expected option keys.
           *
           * @const {string[]} keys
           */
          const keys: string[] = ['conditions', 'preserveSymlinks']

          /**
           * Expected global option keys.
           *
           * @const {string[]} keysWithGlobals
           */
          const keysWithGlobals: string[] = [...keys, 'cwd', 'debug', 'parent']

          /**
           * Subcommand name.
           *
           * @const {string} subcmd
           */
          const subcmd: string = argv.at(-2)!

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(-1))
              expect(result.id()).to.eq(subcmd)

              expect(opts).to.have.keys(keys)
              expect(opts).to.have.property('conditions').eql(mConditions)
              expect(opts).to.have.property('preserveSymlinks', false)

              expect(optsWithGlobals).to.have.keys(keysWithGlobals)
              expect(optsWithGlobals).to.have.property('cwd').eql(cwd)
              expect(optsWithGlobals).to.have.property('debug', false)
              expect(optsWithGlobals).to.have.property('parent').eql(parent)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, subcmd)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        mlly,
        ['resolve', '--parent', import.meta.url, '#lib/command'],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          /**
           * Expected option keys.
           *
           * @const {string[]} keys
           */
          const keys: string[] = ['conditions', 'preserveSymlinks']

          /**
           * Expected global option keys.
           *
           * @const {string[]} keysWithGlobals
           */
          const keysWithGlobals: string[] = [...keys, 'cwd', 'debug', 'parent']

          /**
           * Subcommand name.
           *
           * @const {string} subcmd
           */
          const subcmd: string = argv[0]!

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(-1))
              expect(result.id()).to.eq(subcmd)

              expect(opts).to.have.keys(keys)
              expect(opts).to.have.property('conditions').eql(mConditions)
              expect(opts).to.have.property('preserveSymlinks', false)

              expect(optsWithGlobals).to.have.keys(keysWithGlobals)
              expect(optsWithGlobals).to.have.property('cwd').eql(cwd)
              expect(optsWithGlobals).to.have.property('debug', false)
              expect(optsWithGlobals).to.have.property('parent').eql(parent)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, subcmd)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        mlly,
        [
          '-p' + import.meta.url,
          'resolve',
          '#lib/option',
          '--conditions=kronk',
          '-c=development',
          '--ps'
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          /**
           * Expected list of export/import conditions.
           *
           * @const {Set<string>} conditions
           */
          const conditions: Set<string> = new Set(['kronk', 'development'])

          /**
           * Expected option keys.
           *
           * @const {string[]} keys
           */
          const keys: string[] = ['conditions', 'preserveSymlinks']

          /**
           * Expected global option keys.
           *
           * @const {string[]} keysWithGlobals
           */
          const keysWithGlobals: string[] = [...keys, 'cwd', 'debug', 'parent']

          /**
           * Subcommand name.
           *
           * @const {string} subcmd
           */
          const subcmd: string = argv[1]!

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql([argv[2]])
              expect(result.id()).to.eq(subcmd)

              expect(opts).to.have.keys(keys)
              expect(opts).to.have.property('conditions').eql(conditions)
              expect(opts).to.have.property('preserveSymlinks', true)

              expect(optsWithGlobals).to.have.keys(keysWithGlobals)
              expect(optsWithGlobals).to.have.property('cwd').eql(cwd)
              expect(optsWithGlobals).to.have.property('debug', false)
              expect(optsWithGlobals).to.have.property('parent').eql(parent)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, subcmd)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        smallest,
        [smallest.aliases[0]!, chars.digit1, chars.digit3],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          /**
           * Expected parsed command-argument.
           *
           * @const {Set<number>} arg
           */
          const arg: Set<number> = new Set([+chars.digit1, +chars.digit3])

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.eq(subject)
              expect(result.args).to.eql([arg])
              expect(result.argv).to.eql(argv.slice(1))
              expect(result.id()).to.eq(smallest.name)

              expect(opts).to.eql({})

              expect(optsWithGlobals).to.eql(opts)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              return action = act(subject), done = dn(subject), void subject
            }
          }
        }
      ],
      [
        stringUtil,
        ['split', chars.lowercaseA + chars.slash + chars.lowercaseB],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          /**
           * Subcommand name.
           *
           * @const {string} subcmd
           */
          const subcmd: string = argv[0]!

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWithGlobals
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWithGlobals: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql(argv.slice(1))
              expect(result.id()).to.eq(subcmd)

              expect(opts).to.have.keys(['limit'])
              expect(opts).to.have.property('limit', undefined)

              expect(optsWithGlobals).to.have.keys(['limit', 'separator'])
              expect(optsWithGlobals).to.have.property('limit', undefined)
              expect(optsWithGlobals).to.have.property('separator', chars.comma)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, subcmd)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ],
      [
        stringUtil,
        [
          'split',
          chars.lowercaseA + chars.ellipsis + chars.lowercaseZ,
          chars.hyphen + chars.lowercaseS + chars.ellipsis,
          '--limit' + chars.equal + chars.digit1
        ],
        /**
         * @this {void}
         *
         * @param {string[]} argv
         *  Command-line arguments
         * @return {ParseCaseHooks}
         *  Parse test case hooks
         */
        function context(this: void, argv: string[]): ParseCaseHooks {
          /**
           * Subcommand name.
           *
           * @const {string} subcmd
           */
          const subcmd: string = argv[0]!

          return {
            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @param {TestSubject} result
             *  The command that was run
             * @param {OptionValues} opts
             *  Parsed command options
             * @param {OptionValues} optsWG
             *  Parsed command options (with globals)
             * @return {undefined}
             */
            after(
              this: void,
              subject: TestSubject,
              result: TestSubject,
              opts: OptionValues,
              optsWG: OptionValues
            ): undefined {
              expect(result).to.not.eq(subject)
              expect(result.args).to.eql(result.argv).and.eql([argv[1]])
              expect(result.id()).to.eq(subcmd)

              expect(opts).to.have.keys(['limit'])
              expect(opts).to.have.property('limit', chars.digit1)

              expect(optsWG).to.have.keys(['limit', 'separator'])
              expect(optsWG).to.have.property('limit', chars.digit1)
              expect(optsWG).to.have.property('separator', chars.ellipsis)

              return void this
            },

            /**
             * @this {void}
             *
             * @param {TestSubject} subject
             *  The command under test
             * @return {undefined}
             */
            before(this: void, subject: TestSubject): undefined {
              /**
               * The subcommand under test.
               *
               * @const {TestSubject} subcommand
               */
              const subcommand: TestSubject = findCommand(subject, subcmd)!

              ok(subcommand, 'expected `subcommand`')
              action = act(subcommand)
              done = dn(subcommand)

              return void subcommand
            }
          }
        }
      ]
    ])('should run command (%#)', async (info, argv, hooks) => {
      const { after, before } = hooks(argv)

      // Arrange
      const subject: TestSubject = new TestSubject({ ...info, process })
      let opts: OptionValues
      let optsWithGlobals: OptionValues
      let result: TestSubject

      // Act
      before(subject)
      result = await subject.parseAsync(argv, { from: 'user' })
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
      expect.hasAssertions(), after(subject, result, opts, optsWithGlobals)
    })
  })

  describe('#prepareCommand', () => {
    let error: unknown
    let fatal: Fatal
    let id: string
    let subject: TestSubject

    afterEach(() => {
      error = undefined
    })

    beforeAll(() => {
      id = 'kronk/invalid-argument'
    })

    it.each<FatalCase>([
      [mlly, ['--parent', import.meta.url, '--debug', chars.digit1]],
      [mlly, ['--parent', import.meta.url, '-d', chars.digit2]]
    ])('should error on extra option-argument (%#)', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        await subject.parseAsync([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', id)
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })

    it.each<FatalCase>([
      [mlly, ['--parent', import.meta.url, '--debug', chars.digit1]],
      [mlly, ['-p', import.meta.url, '-d', chars.digit2]]
    ])('should error on extra option-argument (%#)', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        await subject.parseAsync([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', id)
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })

    it.each<FatalCase>([
      [dateformat, ['--gmt' + chars.equal + chars.digit1]],
      [dateformat, ['-u' + chars.equal]],
      [mlly, ['--parent', import.meta.url, '--debug' + chars.equal]],
      [mlly, ['-p', import.meta.url, '-d' + chars.equal + chars.digit1]]
    ])('should error on extra option-argument (attached) (%#)', async (
      info,
      argv
    ) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        await subject.parseAsync([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', id)
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })

    it.each<FatalCase>([
      [dateformat, ['--mask']],
      [mlly, ['resolve', '-p' + import.meta.url, '-c']]
    ])('should error on missing option-argument (%#)', async (info, argv) => {
      // Arrange
      subject = new TestSubject({ ...info, process })
      fatal = vi.spyOn(subject.logger, 'fatal')

      // Act
      try {
        await subject.parseAsync([...nodeArgv, ...argv])
      } catch (e: unknown) {
        error = e
      }

      // Expect
      expect(error).to.satisfy(isCommandError)
      expect(error).to.have.property('id', id)
      expect(fatal).toHaveBeenCalledOnce()
      expect(fatal.mock.lastCall).to.have.property('length', 1)
      expect(fatalSnapshot(fatal.mock.lastCall![0])).toMatchSnapshot()
    })
  })
})
