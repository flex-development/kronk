/**
 * @file Type Tests - WriteStream
 * @module kronk/interfaces/tests/unit-d/WriteStream
 */

import type TestSubject from '#interfaces/write-stream'
import type { Write } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/WriteStream', () => {
  it('should match [columns?: number | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('columns')
      .toEqualTypeOf<Nilable<number>>()
  })

  it('should match [write: Write]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('write').toEqualTypeOf<Write>()
  })
})
