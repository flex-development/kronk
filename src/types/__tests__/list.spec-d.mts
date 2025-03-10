/**
 * @file Type Tests - List
 * @module kronk/types/tests/unit-d/List
 */

import type TestSubject from '#types/list'

describe('unit-d:types/List', () => {
  type T = string
  type Subject = TestSubject<T>

  it('should extract Set<T>', () => {
    expectTypeOf<Subject>().extract<Set<T>>().not.toBeNever()
  })

  it('should extract readonly T[]', () => {
    expectTypeOf<Subject>().extract<readonly T[]>().not.toBeNever()
  })
})
