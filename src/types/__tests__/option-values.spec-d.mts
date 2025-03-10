/**
 * @file Type Tests - OptionValues
 * @module kronk/types/tests/unit-d/OptionValues
 */

import type TestSubject from '#types/option-values'
import type { Option } from '@flex-development/kronk'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:types/OptionValues', () => {
  it('should match Record<Option["key"], T>', () => {
    // Arrange
    type T = Nilable<boolean | string | string[]>

    // Expect
    expectTypeOf<TestSubject<T>>().toMatchTypeOf<Record<Option['key'], T>>()
  })
})
