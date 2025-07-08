/**
 * @file Integration Tests - initialCommand
 * @module kronk/constructs/tests/integration/initialCommand
 */

import testSubject from '#constructs/initial-command'
import chars from '#enums/chars'
import average from '#fixtures/commands/average'
import bun from '#fixtures/commands/bun'
import clamp from '#fixtures/commands/clamp'
import grease from '#fixtures/commands/grease'
import mlly from '#fixtures/commands/mlly'
import smallestNum from '#fixtures/commands/smallest-num'
import stringUtil from '#fixtures/commands/string-util'
import tribonacci from '#fixtures/commands/tribonacci'
import process from '#fixtures/process'
import kCommand from '#internal/k-command'
import Command from '#lib/command'
import snapshot from '#tests/utils/snapshot-events'
import { tokenize, type TokenizeContext } from '@flex-development/fsm-tokenizer'
import type { CommandInfo } from '@flex-development/kronk'
import pathe from '@flex-development/pathe'

describe('integration:constructs/initialCommand', () => {
  it.each<[CommandInfo, string[]]>([
    [average, []],
    [average, [average.name, chars.digit0, chars.digit1, chars.digit2]],
    [bun, [bun.name, 'run', '--watch', './src/main.mts']],
    [bun, [bun.name, '--tsconfig-override=tsconfig.prod.json', 'src/main.mts']],
    [clamp, ['-M3', '-m-1', chars.delimiter, '-13']],
    [clamp, ['-M=26', chars.digit9]],
    [clamp, [chars.digit1, '--max', '26', '--min=13']],
    [clamp, [clamp.name, chars.digit3, '--max', '13', '--min=']],
    [grease, ['--version']],
    [grease, ['-ju', 'bump', '--preid=alpha', 'recommend']],
    [grease, ['ch', '-wr=0', '-t$(jq .version package.json -r)']],
    [grease, ['changelog', '-wo$NOTES_FILE']],
    [grease, [grease.name, 'pack', '-o', '%s-%v.tgz']],
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
      ]
    ],
    [mlly, ['resolve', '#internal/tokenize', `--parent=${chars.dot}`]],
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
      ]
    ],
    [smallestNum, ['sn', chars.digit1, chars.digit2, chars.digit3]],
    [
      stringUtil,
      [
        'join',
        '-s' + chars.ellipsis,
        chars.lowercaseA + chars.ellipsis + chars.lowercaseZ
      ]
    ],
    [tribonacci, [chars.digit2, chars.digit2, '-n13', chars.digit3]]
  ])('should tokenize command-line arguments (%#)', (info, chunks) => {
    // Act
    const result = tokenize(chunks, {
      breaks: true,
      debug: pathe.basename(import.meta.url),
      /**
       * @this {void}
       *
       * @param {TokenizeContext} context
       *  Base tokenize context
       * @return {undefined}
       */
      finalizeContext(this: void, context: TokenizeContext): undefined {
        context[kCommand] = true
        context.command = new Command({ ...info, process })
        return void context
      },
      initial: testSubject,
      moveOnBreak: true
    })

    // Expect (conditional)
    if (chunks.length) {
      expect(result).to.be.an('array').with.property('length').gte(2)
    } else {
      expect(result).to.be.an('array').with.property('length', chunks.length)
    }

    // Expect
    expect(snapshot(result)).toMatchSnapshot()
  })
})
