/**
 * @file Integration Tests - initialOption
 * @module kronk/constructs/tests/integration/initialOption
 */

import testSubject from '#constructs/initial-option'
import chars from '#enums/chars'
import tt from '#enums/tt'
import kOption from '#internal/k-option'
import toChunks from '#internal/to-chunks'
import sfmt from '#tests/utils/sfmt'
import snapshot from '#tests/utils/snapshot-events'
import {
  createTokenizer,
  tokenize,
  type FinalizeContext,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type { Flags } from '@flex-development/kronk'
import pathe from '@flex-development/pathe'

describe('integration:constructs/initialOption', () => {
  let context: TokenizeContext
  let finalizeContext: FinalizeContext

  beforeAll(() => {
    /**
     * @this {void}
     *
     * @param {TokenizeContext} context
     *  Base tokenize context
     * @return {undefined}
     */
    finalizeContext = function finalizeContext(
      this: void,
      context: TokenizeContext
    ): undefined {
      return context[kOption] = true, void context
    }
  })

  beforeEach(() => {
    context = createTokenizer({
      debug: pathe.basename(import.meta.url),
      finalizeContext,
      initial: testSubject
    })
  })

  it.each<string>([
    chars.empty,
    chars.delimiter + chars.hyphen,
    chars.delimiter + chars.dot,
    chars.delimiter + 'assets?',
    chars.delimiter,
    chars.hyphen,
    chars.hyphen + chars.hash,
    chars.hyphen + chars.digit1 + chars.digit3,
    chars.hyphen + chars.lowercaseP + import.meta.url,
    chars.hyphen + chars.lowercaseW + chars.lowercaseS,
    sfmt.optional({ id: 'feat' })
  ])('should not tokenize invalid flags (%j)', flag => {
    // Act
    const result = tokenize(toChunks(flag, kOption), context)

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<string>([
    '--drink-size <drink-size',
    '--parent <url!]',
    '--token' + chars.space + sfmt.required({ id: chars.space })
  ])('should not tokenize invalid option-argument syntax (%j)', flag => {
    // Act
    const result = tokenize(toChunks(flag, kOption), context)

    // Expect
    expect(result).to.be.an('array').with.property('length', 2)
    expect(result).to.each.have.nested.property('1.type', tt.flag)
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
    const result = tokenize(toChunks(flags, kOption), context)

    // Expect
    expect(result).to.be.an('array').with.property('length').gte(4)
    expect(snapshot(result)).toMatchSnapshot()
  })

  it.each<string>([
    '-gnu-style-hidden-option',
    '13',
    'TZ',
    'esbuild.jsxDev',
    'force',
    'ps'
  ])('should tokenize long flag ("--%s")', id => {
    // Arrange
    const flag: string = chars.hyphen.repeat(2) + id
    const chunks: string[] = toChunks(flag, kOption)

    // Act
    const result = tokenize(chunks, context)

    // Expect
    expect(result).to.be.an('array').with.property('length', 2)
    expect(result).to.each.have.nested.property('1.long', true)
    expect(result).to.each.have.nested.property('1.type', tt.flag)
    expect(result).to.each.have.nested.property('1.value', flag)
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
  ])('should tokenize short flag ("-%s")', id => {
    // Arrange
    const flag: string = chars.hyphen + id
    const chunks: string[] = toChunks(flag, kOption)

    // Act
    const result = tokenize(chunks, context)

    // Expect
    expect(result).to.be.an('array').with.property('length', 2)
    expect(result).to.each.have.nested.property('1.short', true)
    expect(result).to.each.have.nested.property('1.type', tt.flag)
    expect(result).to.each.have.nested.property('1.value', flag)
    expect(result).to.each.not.have.nested.property('1.long')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
