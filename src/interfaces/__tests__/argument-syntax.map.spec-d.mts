/**
 * @file Type Tests - ArgumentSyntaxMap
 * @module kronk/interfaces/tests/unit-d/ArgumentSyntaxMap
 */

import type TestSubject from '#interfaces/argument-syntax.map'

describe('unit-d:interfaces/ArgumentSyntaxMap', () => {
  it('should match [optional: `[${string}]`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optional')
      .toEqualTypeOf<`[${string}]`>()
  })

  it('should match [optionalMandatory: `[${string}!]`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optionalMandatory')
      .toEqualTypeOf<`[${string}!]`>()
  })

  it('should match [optionalMandatoryVariadic: `[${string}!...]`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optionalMandatoryVariadic')
      .toEqualTypeOf<`[${string}!...]`>()
  })

  it('should match [optionalVariadic: `[${string}...]`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('optionalVariadic')
      .toEqualTypeOf<`[${string}...]`>()
  })

  it('should match [required: `<${string}>`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('required')
      .toEqualTypeOf<`<${string}>`>()
  })

  it('should match [requiredMandatory: `<${string}!>`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('requiredMandatory')
      .toEqualTypeOf<`<${string}!>`>()
  })

  it('should match [requiredMandatoryVariadic: `<${string}!...>`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('requiredMandatoryVariadic')
      .toEqualTypeOf<`<${string}!...>`>()
  })

  it('should match [requiredVariadic: `<${string}...>`]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('requiredVariadic')
      .toEqualTypeOf<`<${string}...>`>()
  })
})
