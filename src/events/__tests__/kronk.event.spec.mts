/**
 * @file Unit Tests - KronkEvent
 * @module kronk/events/tests/unit/KronkEvent
 */

import TestSubject from '#events/kronk.event'
import isKronkEvent from '#utils/is-kronk-event'
import type { KronkEventName } from '@flex-development/kronk'

describe('unit:events/KronkEvent', () => {
  let id: KronkEventName
  let subject: TestSubject

  beforeAll(() => {
    subject = new TestSubject(id = 'option:')
  })

  describe('constructor', () => {
    it('should pass kronk event guard', () => {
      expect(subject).to.satisfy(isKronkEvent)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', id)
    })
  })

  describe('#toString', () => {
    it('should return event as human-readable string', () => {
      expect(subject.toString()).to.eq(id).and.eq(String(subject))
    })
  })
})
