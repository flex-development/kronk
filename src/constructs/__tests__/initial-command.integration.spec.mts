/**
 * @file Integration Tests - initialCommand
 * @module kronk/constructs/tests/integration/initialCommand
 */

import testSubject from '#constructs/initial-command'
import chars from '#enums/chars'
import clamp from '#fixtures/commands/clamp'
import dateformat from '#fixtures/commands/dateformat'
import mlly from '#fixtures/commands/mlly'
import smallestNum from '#fixtures/commands/smallest-num'
import stringUtil from '#fixtures/commands/string-util'
import tribonacci from '#fixtures/commands/tribonacci'
import date from '#fixtures/date'
import process from '#fixtures/process'
import kCommand from '#internal/k-command'
import Command from '#lib/command'
import snapshot from '#tests/utils/snapshot-events'
import type { CommandInfo } from '@flex-development/kronk'
import pathe from '@flex-development/pathe'
import {
  createTokenizer,
  tokenize,
  type List,
  type TokenizeContext
} from '@flex-development/vfile-tokenizer'
import { ok } from 'devlop'

describe('integration:constructs/initialCommand', () => {
  ok(clamp.name, 'expected `clamp.name`')

  it.each<[CommandInfo, List<string>]>([
    [clamp, [chars.digit1, '--max', '26', '--min=13']],
    [clamp, [chars.digit9, '-M=26']],
    [clamp, [clamp.name, chars.digit3, '--max', '13', '--min=']],
    [clamp, ['-M3', '-m-1', chars.delimiter, '-13']],
    [dateformat, ['--mask', 'isoDate']],
    [dateformat, ['-gm' + 'isoDate', date.toString()]],
    [dateformat, ['-gum']],
    [dateformat, ['-um' + chars.equal + 'isoTime', date.toString()]],
    [mlly, ['resolve', '#internal/tokenize', `--parent=${chars.dot}`]],
    [
      mlly,
      [
        'resolve',
        '#lib/command',
        '--conditions=kronk',
        '-p' + chars.dot,
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
    // Act
    const result = tokenize(chunks, createTokenizer({
      debug: pathe.basename(import.meta.url),
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
        const command: Command = new Command({ ...info, process })

        // @ts-expect-error [2445] testing.
        context.findCommand = command.findCommand.bind(command)
        // @ts-expect-error [2445] testing.
        context.findOption = command.findOption.bind(command)
        // @ts-expect-error [2445] testing.
        context.findSubOption = command.findSubOption.bind(command)

        return context.breaks = true, context[kCommand] = true, void context
      },
      initial: testSubject
    }))

    // Expect
    expect(result).to.be.an('array').with.property('length').gte(2)
    expect(snapshot(result)).toMatchSnapshot()
  })
})
