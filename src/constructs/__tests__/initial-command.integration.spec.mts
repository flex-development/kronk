/**
 * @file Integration Tests - initialCommand
 * @module kronk/constructs/tests/integration/initialCommand
 */

import testSubject from '#constructs/initial-command'
import chars from '#enums/chars'
import clamp from '#fixtures/commands/clamp'
import grease from '#fixtures/commands/grease'
import mlly from '#fixtures/commands/mlly'
import semver from '#fixtures/commands/semver'
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
    [clamp, ['-M=26', chars.digit9]],
    [clamp, ['-M3', '-m-1', chars.delimiter, '-13']],
    [clamp, [chars.digit1, '--max', '26', '--min=13']],
    [clamp, [clamp.name, chars.digit3, '--max', '13', '--min=']],
    [grease, []],
    [grease, [grease.name]],
    [grease, [grease.name, 'bump', 'recommend']],
    [grease, ['bump', 'major', 'package.json', 'versions.json']],
    [grease, [grease.name, 'changelog', '-wo$NOTES_FILE']],
    [grease, ['changelog', '-nsw']],
    [grease, ['changelog', '-nsw1']],
    [grease, ['changelog', '-wr=0', '-t$(jq .version package.json -r)']],
    [grease, ['dist-tag', 'grease@3.0.0-alpha.10', '--tag-prefix=grease@']],
    [grease, ['info']],
    [grease, ['manifest', 'get', 'name']],
    [
      grease,
      [
        'manifest',
        'set',
        'version=3.0.0-alpha.10',
        'git.build=3b5ceacd4ea35b4cebefa1b9b8aca93b9cccaae4'
      ]
    ],
    [grease, [grease.name, '-n', 'pack', '-o', '%s-%v.tgz']],
    [grease, ['tag', 'create', '-ps', '-m=release: {tag}', grease.version]],
    [grease, ['version', '1.0.0-alpha.1']],
    [
      mlly,
      [
        '--parent',
        chars.dot,
        'resolve',
        '--conditions',
        'development',
        '--conditions',
        'kronk',
        './scratch.mts'
      ]
    ],
    [
      mlly,
      [
        mlly.name,
        '-p' + chars.dot,
        'resolve',
        '#lib/command',
        '-c' + 'node',
        '-c=kronk',
        '--ps',
        '--conditions',
        'development'
      ]
    ],
    [
      mlly,
      [
        'resolve',
        '#internal/flag-resolve',
        '--parent' + chars.equal + chars.dot
      ]
    ],
    [semver, ['satisfies', '1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3']],
    [
      semver,
      [
        'satisfies',
        'max',
        '1.x || 2.0.0 - 4.x',
        '1.22.0',
        '3.13.98',
        '4.27.73'
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
