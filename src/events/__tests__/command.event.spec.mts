/**
 * @file Unit Tests - CommandEvent
 * @module kronk/events/tests/unit/CommandEvent
 */

import chars from '#enums/chars'
import TestSubject from '#events/command.event'
import KronkEvent from '#events/kronk.event'
import type Command from '#lib/command'
import isCommandEvent from '#utils/is-command-event'
import type { CommandEventName } from '@flex-development/kronk'

describe('unit:events/CommandEvent', () => {
  let command: Command
  let event: CommandEventName
  let subject: TestSubject

  beforeAll(() => {
    event = `command:${chars.colon}:${chars.dollar}`
    command = { event } as Command
    subject = new TestSubject(command)
  })

  describe('constructor', () => {
    it('should be instanceof `KronkEvent`', () => {
      expect(subject).to.be.instanceof(KronkEvent)
    })

    it('should pass event guard', () => {
      expect(subject).to.satisfy(isCommandEvent)
    })

    it('should set #command', () => {
      expect(subject).to.have.property('command', command)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', command.event)
    })
  })
})
