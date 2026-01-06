/**
 * @file Type Tests - OptionValueSources
 * @module kronk/types/tests/unit-d/OptionValueSources
 */

import type TestSubject from '#types/option-value-sources'
import type { Option, OptionValueSource } from '@flex-development/kronk'

describe('unit-d:types/OptionValueSources', () => {
  it('should match Record<Option["key"], OptionValueSource>', () => {
    // Arrange
    type Expect = Record<Option['key'], OptionValueSource>

    // Expect
    expectTypeOf<TestSubject>().toMatchObjectType<Expect>()
  })
})
