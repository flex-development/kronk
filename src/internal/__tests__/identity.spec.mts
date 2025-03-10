/**
 * @file Unit Tests - identity
 * @module kronk/internal/tests/unit/identity
 */

import tt from '#enums/tt'
import testSubject from '#internal/identity'
import type { Token } from '@flex-development/vfile-tokenizer'

describe('unit:internal/identity', () => {
  let value: Token

  beforeAll(() => {
    value = {
      end: { _index: 65, column: 66, line: 1, offset: 65 },
      start: { _index: 62, column: 63, line: 1, offset: 62 },
      type: tt.id,
      value: 'debug'
    }
  })

  it('should return `value`', () => {
    expect(testSubject(value)).to.eq(value)
  })
})
