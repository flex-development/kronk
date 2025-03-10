/**
 * @file Type Tests - ArgumentMetadata
 * @module kronk/interfaces/tests/unit-d/ArgumentMetadata
 */

import type TestSubject from '#interfaces/metadata-argument'
import type { ArgumentInfo } from '@flex-development/kronk'

describe('unit-d:interfaces/ArgumentMetadata', () => {
  it('should extend ArgumentInfo', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ArgumentInfo>()
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
