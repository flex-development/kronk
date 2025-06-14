/**
 * @file Type Tests - CommandErrorInfo
 * @module kronk/interfaces/tests/unit-d/CommandErrorInfo
 */

import type TestSubject from '#interfaces/command-error.info'
import type { KronkErrorInfo } from '@flex-development/kronk'

describe('unit-d:interfaces/CommandErrorInfo', () => {
  it('should extend KronkErrorInfo', () => {
    expectTypeOf<TestSubject>().toExtend<KronkErrorInfo>()
  })

  it('should match [id: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('id').toEqualTypeOf<string>()
  })
})
