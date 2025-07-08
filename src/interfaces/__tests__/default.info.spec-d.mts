/**
 * @file Type Tests - DefaultInfo
 * @module kronk/interfaces/tests/unit-d/DefaultInfo
 */

import type TestSubject from '#interfaces/default.info'
import type { Nilable, Optional } from '@flex-development/tutils'

describe('unit-d:interfaces/DefaultInfo', () => {
  type T = number
  type Subject = TestSubject<T>

  it('should match [description?: URL | string | null | undefined]', () => {
    expectTypeOf<Subject>()
      .toHaveProperty('description')
      .toEqualTypeOf<Nilable<URL | string>>()
  })

  it('should match [value?: T]', () => {
    expectTypeOf<Subject>()
      .toHaveProperty('value')
      .toEqualTypeOf<Optional<T>>()
  })
})
