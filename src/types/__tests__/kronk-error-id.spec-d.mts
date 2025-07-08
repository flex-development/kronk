/**
 * @file Type Tests - KronkErrorId
 * @module kronk/types/tests/unit-d/KronkErrorId
 */

import type TestSubject from '#types/kronk-error-id'
import type { KronkErrorMap } from '@flex-development/kronk'

describe('unit-d:types/KronkErrorId', () => {
  it('should equal `kronk/${keyof KronkErrorMap}`', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<`kronk/${keyof KronkErrorMap}`>()
  })
})
