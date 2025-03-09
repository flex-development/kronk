/**
 * @file Type Tests - UnknownStrategy
 * @module kronk/types/tests/unit-d/UnknownStrategy
 */

import type TestSubject from '#types/unknown-strategy'

describe('unit-d:types/UnknownStrategy', () => {
  it('should extract "arguments"', () => {
    expectTypeOf<TestSubject>().extract<'arguments'>().not.toBeNever()
  })

  it('should extract "options"', () => {
    expectTypeOf<TestSubject>().extract<'options'>().not.toBeNever()
  })

  it('should extract boolean', () => {
    expectTypeOf<TestSubject>().extract<boolean>().not.toBeNever()
  })
})
