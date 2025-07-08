/**
 * @file Type Tests - EmptyString
 * @module kronk/types/tests/unit-d/EmptyString
 */

import type TestSubject from '#types/empty-string'
import type * as pathe from '@flex-development/pathe'

describe('unit-d:types/EmptyString', () => {
  it('should equal pathe.EmptyString', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<pathe.EmptyString>()
  })
})
