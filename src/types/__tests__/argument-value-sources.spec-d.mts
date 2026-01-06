/**
 * @file Type Tests - ArgumentValueSources
 * @module kronk/types/tests/unit-d/ArgumentValueSources
 */

import type TestSubject from '#types/argument-value-sources'
import type { ArgumentValueSource } from '@flex-development/kronk'

describe('unit-d:types/ArgumentValueSources', () => {
  it('should equal (ArgumentValueSource | undefined)[]', () => {
    // Arrange
    type Expect = (ArgumentValueSource | undefined)[]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
