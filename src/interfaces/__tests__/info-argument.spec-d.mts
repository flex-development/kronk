/**
 * @file Type Tests - ArgumentInfo
 * @module kronk/interfaces/tests/unit-d/ArgumentInfo
 */

import type TestSubject from '#interfaces/info-argument'
import type { ArgumentData } from '@flex-development/kronk'

describe('unit-d:interfaces/ArgumentInfo', () => {
  it('should extend ArgumentData', () => {
    expectTypeOf<TestSubject>().toExtend<ArgumentData>()
  })

  it('should match [syntax: ArgumentSyntax]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('syntax').toEqualTypeOf<string>()
  })
})
