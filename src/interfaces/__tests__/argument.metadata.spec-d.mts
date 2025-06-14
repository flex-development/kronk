/**
 * @file Type Tests - ArgumentMetadata
 * @module kronk/interfaces/tests/unit-d/ArgumentMetadata
 */

import type TestSubject from '#interfaces/argument.metadata'
import type { ArgumentInfo } from '@flex-development/kronk'

describe('unit-d:interfaces/ArgumentMetadata', () => {
  it('should extend ArgumentInfo', () => {
    expectTypeOf<TestSubject>().toExtend<ArgumentInfo>()
  })

  it('should match [id: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('id').toEqualTypeOf<string>()
  })

  it('should match [required: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('required')
      .toEqualTypeOf<boolean>()
  })

  it('should match [variadic: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('variadic')
      .toEqualTypeOf<boolean>()
  })
})
