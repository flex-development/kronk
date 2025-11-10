/**
 * @file Type Tests - ArgumentData
 * @module kronk/interfaces/tests/unit-d/ArgumentData
 */

import type TestSubject from '#interfaces/argument.data'
import type { ParseableInfo } from '@flex-development/kronk'
import type { OptionalKeys } from '@flex-development/tutils'

describe('unit-d:interfaces/ArgumentData', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should extend ParseableInfo', () => {
    expectTypeOf<TestSubject>().toExtend<ParseableInfo>()
  })
})
