/**
 * @file Type Tests - ArgvSource
 * @module kronk/types/tests/unit-d/ArgvSource
 */

import type TestSubject from '#types/argv-source'
import type { ArgvSourceMap } from '@flex-development/kronk'

describe('unit-d:types/ArgvSource', () => {
  it('should equal ArgvSourceMap[keyof ArgvSourceMap]', () => {
    // Arrange
    type Expect = ArgvSourceMap[keyof ArgvSourceMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
