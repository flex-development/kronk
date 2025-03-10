/**
 * @file Type Tests - OptionValueSourceMap
 * @module kronk/interfaces/tests/unit-d/OptionValueSourceMap
 */

import type TestSubject from '#interfaces/option-value-source-map'

describe('unit-d:interfaces/OptionValueSourceMap', () => {
  it('should match [cli: "cli"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cli').toEqualTypeOf<'cli'>()
  })

  it('should match [config: "config"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('config')
      .toEqualTypeOf<'config'>()
  })

  it('should match [default: "default"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('default')
      .toEqualTypeOf<'default'>()
  })

  it('should match [env: "env"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('env').toEqualTypeOf<'env'>()
  })
})
