/**
 * @file Type Tests - OptionValueSources
 * @module kronk/types/tests/unit-d/OptionValueSources
 */

import type TestSubject from '#types/option-value-sources'
import type { Option, OptionValueSource } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:types/OptionValueSources', () => {
  it('should match Record<Option["key"], OptionValueSource | null | undefined>', () => {
    // Arrange
    type Expect = Record<Option['key'], Nilable<OptionValueSource>>

    // Expect
    expectTypeOf<TestSubject>().toMatchTypeOf<Expect>()
  })
})
