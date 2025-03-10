/**
 * @file Type Tests - ProcessEnv
 * @module kronk/interfaces/tests/unit-d/ProcessEnv
 */

import type TestSubject from '#interfaces/process-env'
import type { Optional } from '@flex-development/tutils'

describe('unit-d:interfaces/ProcessEnv', () => {
  it('should match Record<string, string | undefined>', () => {
    expectTypeOf<TestSubject[string]>().toEqualTypeOf<Optional<string>>()
  })
})
