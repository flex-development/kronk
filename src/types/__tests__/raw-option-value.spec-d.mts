/**
 * @file Type Tests - RawOptionValue
 * @module kronk/types/tests/unit-d/RawOptionValue
 */

import type TestSubject from '#types/raw-option-value'

describe('unit-d:types/RawOptionValue', () => {
  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })

  it('should extract null', () => {
    expectTypeOf<TestSubject>().extract<null>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })

  it('should extract string[]', () => {
    expectTypeOf<TestSubject>().extract<string[]>().not.toBeNever()
  })
})
