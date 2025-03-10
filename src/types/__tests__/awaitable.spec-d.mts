/**
 * @file Type Tests - Awaitable
 * @module kronk/types/tests/unit-d/Awaitable
 */

import type TestSubject from '#types/awaitable'

describe('unit-d:types/Awaitable', () => {
  type T = string | null
  type Subject = TestSubject<T>

  it('should extract Promise<T>', () => {
    expectTypeOf<Subject>().extract<Promise<T>>().not.toBeNever()
  })

  it('should extract T', () => {
    expectTypeOf<Subject>().extract<T>().not.toBeNever()
  })
})
