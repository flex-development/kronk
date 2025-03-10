/**
 * @file Type Tests - OptionPriority
 * @module kronk/types/tests/unit-d/OptionPriority
 */

import type TestSubject from '#types/option-priority'

describe('unit-d:types/OptionPriority', () => {
  it('should extract "global"', () => {
    expectTypeOf<TestSubject>().extract<'global'>().not.toBeNever()
  })

  it('should extract "local"', () => {
    expectTypeOf<TestSubject>().extract<'local'>().not.toBeNever()
  })
})
