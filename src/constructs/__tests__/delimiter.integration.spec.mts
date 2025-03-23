/**
 * @file Integration Tests - delimiter
 * @module kronk/constructs/tests/integration/delimiter
 */

import testSubject from '#constructs/delimiter'
import chars from '#enums/chars'
import tt from '#enums/tt'
import snapshot from '#tests/utils/snapshot-events'
import pathe from '@flex-development/pathe'
import {
  codes,
  createTokenizer,
  initialize,
  tokenize,
  type FinalizeContext,
  type List,
  type TokenizeContext
} from '@flex-development/vfile-tokenizer'

describe('integration:constructs/delimiter', () => {
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
      return context.breaks = true, void context
    }
  })

  beforeEach(() => {
    context = createTokenizer({
      debug: pathe.basename(import.meta.url),
      finalizeContext,
      initial: initialize({ [codes.hyphen]: testSubject })
    })
  })

  it.each<[List<string> | null | undefined]>([
    [[chars.empty]],
    [[chars.delimiter + chars.dot]],
    [[chars.hyphen, chars.hyphen.repeat(3)]],
    [['--assets-dir', '-A']],
    [null],
    [undefined]
  ])('should produce no events without delimiters (%#)', chunks => {
    expect(tokenize(chunks, context)).to.be.an('array').that.is.empty
  })

  it.each<[List<string>]>([
    [[chars.delimiter]],
    [['-M13', '-m0', chars.delimiter, '-13']]
  ])('should tokenize delimiter (%#)', chunks => {
    // Act
    const result = tokenize(chunks, context)

    // Expect
    expect(context).to.have.property('delimiter', true)
    expect(result).to.be.an('array').with.property('length', 2)
    expect(result).to.each.have.nested.property('1.type', tt.delimiter)
    expect(result).to.each.not.have.nested.property('1.value')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
