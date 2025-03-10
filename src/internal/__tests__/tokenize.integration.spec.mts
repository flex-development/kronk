/**
 * @file Integration Tests - tokenize
 * @module kronk/internal/tests/integration/tokenize
 */

import argumentSyntax from '#constructs/argument-syntax'
import delimiter from '#constructs/delimiter'
import longFlag from '#constructs/flag-long'
import shortFlag from '#constructs/flag-short'
import operand from '#constructs/operand'
import chars from '#enums/chars'
import codes from '#enums/codes'
import tt from '#enums/tt'
import clamp from '#fixtures/commands/clamp'
import dateformat from '#fixtures/commands/dateformat'
import mlly from '#fixtures/commands/mlly'
import smallestNum from '#fixtures/commands/smallest-num'
import stringUtil from '#fixtures/commands/string-util'
import tribonacci from '#fixtures/commands/tribonacci'
import date from '#fixtures/date'
import kArgument from '#internal/k-argument'
import kCommand from '#internal/k-command'
import kOption from '#internal/k-option'
import toChunks from '#internal/to-chunks'
import testSubject from '#internal/tokenize'
import Command from '#lib/command'
import sfmt from '#tests/utils/sfmt'
import type {
  ArgumentSyntax,
  CommandInfo,
  Flags,
  List
} from '@flex-development/kronk'
import pathe from '@flex-development/pathe'
import {
  ksort,
  shake,
  type Fn
} from '@flex-development/tutils'
import {
  createTokenizer,
  initialize,
  type Event,
  type EventType,
  type InitialConstruct,
  type Token,
  type TokenizeContext
} from '@flex-development/vfile-tokenizer'
import { ok } from 'devlop'

describe('integration:internal/tokenize', () => {
  let debug: string
  let snapshot: Fn<[Event[]], [EventType, Token][]>

  beforeAll(() => {
    debug = pathe.basename(import.meta.url)

    /**
     * @this {void}
     *
     * @param {Event[]} events
     *  List of events
     * @return {[EventType, Token][]}
     *  List of event types and tokens
     */
    snapshot = function snapshot(
      this: void,
      events: Event[]
    ): [EventType, Token][] {
      return events.map(event => [
        event[0],
        Object.defineProperties(event[1], { toJSON: { value: toJSON } })
      ])

      /**
       * @this {Token}
       *
       * @return {Record<string, any>}
       *  JSON-ish representation of `this` token
       */
      function toJSON(this: Token): Record<string, any> {
        return ksort({
          chunk: this.chunk,
          ...shake({
            attached: this.attached,
            combined: this.combined,
            command: this.command ? String(this.command) : this.command,
            end: this.end,
            id: this.id,
            long: this.long,
            mandatory: this.mandatory,
            next: this.next ? toJSON.call(this.next) : undefined,
            option: this.option ? String(this.option) : this.option,
            previous: this.previous ? toJSON.call(this.previous) : undefined,
            required: this.required,
            short: this.short,
            start: this.start,
            type: this.type,
            value: this.value,
            variadic: this.variadic
          })
        })
      }
    }
  })

  describe('command-arguments', () => {
    let context: TokenizeContext

    beforeEach(() => {
      context = createTokenizer({
        debug,
        /**
         * @this {void}
         *
         * @param {TokenizeContext} context
         *  Base tokenize context
         * @return {undefined}
         */
        finalizeContext: (context: TokenizeContext): undefined => {
          return context[kArgument] = true, void context
        },
        initialize: initialize({
          [codes.leftBracket]: argumentSyntax,
          [codes.lt]: argumentSyntax
        })
      })
    })

    it.each<string>([
      chars.ellipsis,
      chars.lt,
      chars.lt + chars.space + chars.gt,
      chars.lt + chars.lowercaseN + chars.rightBracket,
      chars.leftBracket,
      sfmt.optional({ id: chars.crlf })
    ])('should not tokenize invalid command-argument syntax (%j)', syntax => {
      // Act
      const result = testSubject(toChunks(syntax, kArgument), context)

      // Expect
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').that.is.empty
    })

    it.each<ArgumentSyntax>([
      sfmt.optional({ variadic: true }),
      sfmt.optional(),
      sfmt.optional({ id: chars.lowercaseN }),
      sfmt.optional({ id: 'value', variadic: true })
    ])('should tokenize optional command-argument syntax (%j)', syntax => {
      // Arrange
      const chunks: string[] = toChunks(syntax, kArgument)

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').with.property('length', 2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(result).to.each.have.nested.property('1.required', false)
      expect(result).to.each.have.nested.property('1.type', tt.argtax)
      expect(result).to.each.have.nested.property('1.value', syntax)
      expect(result).to.each.not.have.nested.property('1.mandatory')
      expect(snapshot(result)).toMatchSnapshot()
    })

    it.each<ArgumentSyntax>([
      sfmt.required({ variadic: true }),
      sfmt.required(),
      sfmt.required({ id: chars.lowercaseN }),
      sfmt.required({ id: 'value', variadic: true })
    ])('should tokenize required command-argument syntax (%j)', syntax => {
      // Arrange
      const chunks: string[] = toChunks(syntax, kArgument)

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').with.property('length', 2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(result).to.each.have.nested.property('1.required', true)
      expect(result).to.each.have.nested.property('1.type', tt.argtax)
      expect(result).to.each.have.nested.property('1.value', syntax)
      expect(result).to.each.not.have.nested.property('1.mandatory')
      expect(snapshot(result)).toMatchSnapshot()
    })
  })

  describe('command-line arguments', () => {
    let initial: InitialConstruct

    ok(clamp.name, 'expected `clamp.name`')

    beforeAll(() => {
      initial = initialize({
        [codes.hyphen]: [longFlag, shortFlag, delimiter],
        null: operand
      })
    })

    it.each<List<string> | null | undefined>([
      [],
      new Set([chars.empty]),
      null,
      undefined
    ])('should produce no events without arguments (%#)', chunks => {
      // Arrange
      const context: TokenizeContext = createTokenizer({ initialize: initial })

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(result).to.be.an('array').that.is.empty
    })

    it.each<[CommandInfo, List<string>]>([
      [clamp, ['-M3', '-m-1', '--', '-13']],
      [clamp, [chars.digit1, '--max', '26', '--min=13']],
      [clamp, [chars.digit9, '-M=26']],
      [clamp, [clamp.name, chars.digit3, '--max', '13', '--min=']],
      [dateformat, ['--mask', 'isoDate']],
      [dateformat, ['-gm' + 'isoDate', date.toString()]],
      [dateformat, ['-gum']],
      [dateformat, ['-um' + chars.equal + 'isoTime', date.toString()]],
      [mlly, ['resolve', '#internal/tokenize', `--parent=${pathe.dot}`]],
      [
        mlly,
        [
          'resolve',
          '#lib/command',
          '--conditions=kronk',
          '-p' + pathe.dot,
          '-c=development',
          '--ps',
          '-c' + 'node'
        ]
      ],
      [smallestNum, ['sn', chars.digit1, chars.digit3]],
      [
        stringUtil,
        [
          'join',
          chars.hyphen + chars.lowercaseS + chars.ellipsis,
          chars.lowercaseA + chars.ellipsis + chars.lowercaseZ
        ]
      ],
      [tribonacci, [chars.digit2, chars.digit2, '-dn13', chars.digit3]]
    ])('should tokenize command-line arguments (%#)', (info, chunks) => {
      // Arrange
      const context: TokenizeContext = createTokenizer({
        debug,
        /**
         * @this {void}
         *
         * @param {TokenizeContext} context
         *  Base tokenize context
         * @return {undefined}
         */
        finalizeContext: (context: TokenizeContext): undefined => {
          /**
           * Command instance.
           *
           * @const {Command} command
           */
          const command: Command = new Command(info)

          // @ts-expect-error [2445] testing.
          context.findCommand = command.findCommand.bind(command)
          // @ts-expect-error [2445] testing.
          context.findOption = command.findOption.bind(command)
          // @ts-expect-error [2445] testing.
          context.findSubOption = command.findSubOption.bind(command)

          return context[kCommand] = true, void context
        },
        initialize: initial
      })

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(result).to.be.an('array').with.property('length').gte(2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(snapshot(result)).toMatchSnapshot()
    })
  })

  describe('delimiters', () => {
    let context: TokenizeContext

    beforeEach(() => {
      context = createTokenizer({
        debug,
        initialize: initialize({ [codes.hyphen]: [delimiter] })
      })
    })

    it.each<List<string> | null | undefined>([
      [chars.empty],
      [chars.hyphen.repeat(2) + chars.dot],
      [chars.hyphen, chars.hyphen.repeat(3)],
      new Set(['--assets-dir', '-A']),
      null,
      undefined
    ])('should produce no events without delimiters (%#)', chunks => {
      expect(testSubject(chunks, context)).to.be.an('array').that.is.empty
    })

    it('should tokenize delimiter', () => {
      // Arrange
      const chunks: [string] = [chars.hyphen.repeat(2)]

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.have.property('delimiter', true)
      expect(result).to.be.an('array').with.property('length', 2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(result).to.each.have.nested.property('1.type', tt.delimiter)
      expect(result).to.each.not.have.nested.property('1.value')
      expect(snapshot(result)).toMatchSnapshot()
    })
  })

  describe('option flags', () => {
    let context: TokenizeContext

    beforeEach(() => {
      context = createTokenizer({
        debug,
        /**
         * @this {void}
         *
         * @param {TokenizeContext} context
         *  Base tokenize context
         * @return {undefined}
         */
        finalizeContext: (context: TokenizeContext): undefined => {
          return context[kOption] = true, void context
        },
        initialize: initialize({
          [codes.hyphen]: [longFlag, shortFlag],
          [codes.leftBracket]: argumentSyntax,
          [codes.lt]: argumentSyntax
        })
      })
    })

    it.each<string>([
      chars.empty,
      chars.hyphen.repeat(3),
      chars.hyphen.repeat(2) + chars.dot,
      chars.hyphen.repeat(2) + 'assets?',
      chars.hyphen.repeat(2),
      chars.hyphen,
      chars.hyphen + chars.hash,
      chars.hyphen + chars.digit1 + chars.digit3,
      chars.hyphen + chars.lowercaseP + import.meta.url,
      chars.hyphen.repeat(2) + chars.dot,
      sfmt.optional({ id: 'feat' })
    ])('should not tokenize invalid flags (%j)', flag => {
      // Act
      const result = testSubject(toChunks(flag, kOption), context)

      // Expect
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').that.is.empty
    })

    it.each<string>([
      '--drink-size <drink-size',
      '--parent <url!]',
      '--token' + chars.space + sfmt.required({ id: chars.lf })
    ])('should not tokenize invalid option-argument syntax (%j)', flag => {
      // Act
      const result = testSubject(toChunks(flag, kOption), context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').with.property('length').gte(2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(result).to.each.not.have.nested.property('1.type', tt.argtax)
    })

    it.each<Flags>([
      '--command [!...]',
      '--letter <...>',
      '--mode <mode>',
      '--number [value...]',
      '--parent <!>',
      '--ps --preserve-symlinks',
      '--resolve.conditions <condition!...>',
      '--sr, --sourceRoot <>',
      '--ws, --workspace []',
      '-T | --token <token>'
    ])('should tokenize flags string (%j)', flags => {
      // Act
      const result = testSubject(toChunks(flags, kOption), context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').with.property('length').gte(2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(snapshot(result)).toMatchSnapshot()
    })

    it.each<string>([
      '-gnu-style-hidden-option',
      '13',
      'TZ',
      'esbuild.jsxDev',
      'force',
      'ps'
    ])('should tokenize long flag ("--%s")', flag => {
      // Arrange
      const chunks: string[] = toChunks(chars.hyphen.repeat(2) + flag, kOption)

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').with.property('length').gte(2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(result).to.each.have.nested.property('1.value').be.a('string')
      expect(result).to.each.not.have.nested.property('1.short')
      expect(snapshot(result)).toMatchSnapshot()
    })

    it.each<string>([
      chars.digit0,
      chars.digit1,
      chars.digit2,
      chars.digit3,
      chars.digit4,
      chars.digit5,
      chars.digit6,
      chars.digit7,
      chars.digit8,
      chars.digit9,
      chars.uppercaseA,
      chars.uppercaseB,
      chars.uppercaseC,
      chars.uppercaseD,
      chars.uppercaseE,
      chars.uppercaseF,
      chars.uppercaseG,
      chars.uppercaseH,
      chars.uppercaseI,
      chars.uppercaseJ,
      chars.uppercaseK,
      chars.uppercaseL,
      chars.uppercaseM,
      chars.uppercaseN,
      chars.uppercaseO,
      chars.uppercaseN,
      chars.uppercaseP,
      chars.uppercaseQ,
      chars.uppercaseR,
      chars.uppercaseS,
      chars.uppercaseT,
      chars.uppercaseU,
      chars.uppercaseV,
      chars.uppercaseW,
      chars.uppercaseX,
      chars.uppercaseY,
      chars.uppercaseZ,
      chars.lowercaseA,
      chars.lowercaseB,
      chars.lowercaseC,
      chars.lowercaseD,
      chars.lowercaseE,
      chars.lowercaseF,
      chars.lowercaseG,
      chars.lowercaseH,
      chars.lowercaseI,
      chars.lowercaseJ,
      chars.lowercaseK,
      chars.lowercaseL,
      chars.lowercaseM,
      chars.lowercaseN,
      chars.lowercaseO,
      chars.lowercaseN,
      chars.lowercaseP,
      chars.lowercaseQ,
      chars.lowercaseR,
      chars.lowercaseS,
      chars.lowercaseT,
      chars.lowercaseU,
      chars.lowercaseV,
      chars.lowercaseW,
      chars.lowercaseX,
      chars.lowercaseY,
      chars.lowercaseZ
    ])('should tokenize short flag ("-%s")', flag => {
      // Arrange
      const chunks: string[] = toChunks(chars.hyphen + flag, kOption)

      // Act
      const result = testSubject(chunks, context)

      // Expect
      expect(context).to.have.property('chunk', null)
      expect(context).to.not.have.property('delimiter')
      expect(result).to.be.an('array').with.property('length', 2)
      expect(result).to.each.have.nested.property('1.chunk').be.a('number')
      expect(result).to.each.have.nested.property('1.value').be.a('string')
      expect(result).to.each.not.have.nested.property('1.long')
      expect(snapshot(result)).toMatchSnapshot()
    })
  })
})
