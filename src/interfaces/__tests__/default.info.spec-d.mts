/**
 * @file Type Tests - DefaultInfo
 * @module kronk/interfaces/tests/unit-d/DefaultInfo
 */

import type TestSubject from '#interfaces/default.info'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/DefaultInfo', () => {
  it('should match [description?: URL | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('description')
      .toEqualTypeOf<Nilable<URL | string>>()
  })

  it('should match [value: T]', () => {
    // Arrange
    type T = number

    // Expect
    expectTypeOf<TestSubject<T>>().toHaveProperty('value').toEqualTypeOf<T>()
  })
})
