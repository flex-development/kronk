/**
 * @file Type Tests - ArgumentValueSource
 * @module kronk/types/tests/unit-d/ArgumentValueSource
 */

import type TestSubject from '#types/argument-value-source'
import type { ArgumentValueSourceMap } from '@flex-development/kronk'

describe('unit-d:types/ArgumentValueSource', () => {
  it('should equal ArgumentValueSourceMap[keyof ArgumentValueSourceMap]', () => {
    // Arrange
    type Expect = ArgumentValueSourceMap[keyof ArgumentValueSourceMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
