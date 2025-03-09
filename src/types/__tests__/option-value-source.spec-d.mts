/**
 * @file Type Tests - OptionValueSource
 * @module kronk/types/tests/unit-d/OptionValueSource
 */

import type TestSubject from '#types/option-value-source'
import type { OptionValueSourceMap } from '@flex-development/kronk'

describe('unit-d:types/OptionValueSource', () => {
  it('should equal OptionValueSourceMap[keyof OptionValueSourceMap]', () => {
    // Arrange
    type Expect = OptionValueSourceMap[keyof OptionValueSourceMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
