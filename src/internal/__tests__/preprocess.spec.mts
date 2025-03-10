/**
 * @file Unit Tests - preprocess
 * @module kronk/internal/tests/unit/preprocess
 */

import chars from '#enums/chars'
import codes from '#enums/codes'
import testSubject from '#internal/preprocess'
import type { FileLike, Value } from '@flex-development/vfile-tokenizer'
import { readSync as read } from 'to-vfile'

describe('unit:internal/preprocess', () => {
  it.each<[FileLike | Value | null | undefined]>([
    [chars.break],
    [chars.ht],
    [chars.lf + chars.cr + chars.crlf],
    [read('__fixtures__/long-flags.txt')]
  ])('should return character code chunk list (%#)', value => {
    // Act
    const result = testSubject(value, null, true)

    // Expect
    expect(result).to.be.an('array').that.is.not.empty
    expect(result).to.have.property('length').be.gte(1)
    expect(result).to.have.property(String(result.length - 1)).to.eq(codes.eof)
    expect(result).toMatchSnapshot()
  })
})
