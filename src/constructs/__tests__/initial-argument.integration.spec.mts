/**
 * @file Integration Tests - initialArgument
 * @module kronk/constructs/tests/integration/initialArgument
 */

import testSubject from '#constructs/initial-argument'
import chars from '#enums/chars'
import tt from '#enums/tt'
import kArgument from '#internal/k-argument'
import sfmt from '#tests/utils/sfmt'
import snapshot from '#tests/utils/snapshot-events'
import {
  createTokenizer,
  tokenize,
  type FinalizeContext,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type { ArgumentSyntax } from '@flex-development/kronk'
import pathe from '@flex-development/pathe'

describe('integration:constructs/initialArgument', () => {
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
      return context[kArgument] = true, void context
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
    chars.ellipsis,
    chars.leftAngleBracket,
    chars.leftAngleBracket + chars.space + chars.rightAngleBracket,
    chars.leftAngleBracket + chars.lowercaseN + chars.rightBracket,
    sfmt.required() + chars.space + sfmt.optional(),
    chars.leftBracket,
    chars.leftBracket + chars.crlf + chars.rightBracket,
    sfmt.optional() + chars.ht + sfmt.required()
  ])('should not tokenize invalid command-argument syntax (%j)', syntax => {
    // Act
    const result = tokenize(syntax, context)

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<ArgumentSyntax>([
    sfmt.optional({ variadic: true }),
    sfmt.optional(),
    sfmt.optional({ id: chars.lowercaseN }),
    sfmt.optional({ id: 'value', variadic: true })
  ])('should tokenize optional command-argument syntax (%j)', syntax => {
    // Act
    const result = tokenize(syntax, context)

    // Expect
    expect(result).to.be.an('array').with.property('length', 2)
    expect(result).to.each.have.nested.property('1.required', false)
    expect(result).to.each.have.nested.property('1.type', tt.argtax)
    expect(result).to.each.have.nested.property('1.value', syntax)
    expect(result).to.each.not.have.nested.property('1.mandatory')
    expect(snapshot(result)).toMatchSnapshot()
  })

  it.each<ArgumentSyntax>([
    sfmt.required({ variadic: true }),
    sfmt.required(),
    sfmt.required({ id: chars.lowercaseX, mandatory: true }),
    sfmt.required({ id: 'value', variadic: true })
  ])('should tokenize required command-argument syntax (%j)', syntax => {
    // Act
    const result = tokenize(syntax, context)

    // Expect
    expect(result).to.be.an('array').with.property('length', 2)
    expect(result).to.each.have.nested.property('1.required', true)
    expect(result).to.each.have.nested.property('1.type', tt.argtax)
    expect(result).to.each.have.nested.property('1.value', syntax)
    expect(result).to.each.not.have.nested.property('1.mandatory')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
