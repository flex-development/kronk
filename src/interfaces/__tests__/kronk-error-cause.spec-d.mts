/**
 * @file Type Tests - KronkErrorCause
 * @module kronk/interfaces/tests/unit-d/KronkErrorCause
 */

import type TestSubject from '#interfaces/kronk-error-cause'

describe('unit-d:interfaces/KronkErrorCause', () => {
  it('should match [[Symbol.hasInstance]?: never]', () => {
    // Arrange
    type Expect = { [Symbol.hasInstance]?: never }

    // Expect
    expectTypeOf<TestSubject>().toMatchTypeOf<Expect>()
  })

  it('should match [[Symbol.unscopables]?: never]', () => {
    // Arrange
    type Expect = { [Symbol.unscopables]?: never }

    // Expect
    expectTypeOf<TestSubject>().toMatchTypeOf<Expect>()
  })

  it('should match Record<string, any>', () => {
    expectTypeOf<TestSubject[string]>().toEqualTypeOf<any>()
  })
})
