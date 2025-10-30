/**
 * @file Unit Tests - CommandError
 * @module kronk/errors/tests/unit/CommandError
 */

import eid from '#enums/keid'
import TestSubject from '#errors/command.error'
import KronkError from '#errors/kronk.error'
import isCommandError from '#utils/is-command-error'
import type {
  CommandErrorInfo,
  KronkErrorCause,
  KronkErrorId
} from '@flex-development/kronk'

describe('unit:errors/CommandError', () => {
  let code: number
  let id: KronkErrorId
  let info: CommandErrorInfo
  let reason: string

  afterEach(() => {
    delete info.cause
  })

  beforeAll(() => {
    code = 112
    id = eid.argument_after_variadic
    reason = 'Cannot have argument after variadic argument'

    info = { code, id, reason }
  })

  describe('constructor(info)', () => {
    let cause: KronkErrorCause
    let subject: TestSubject

    beforeEach(() => {
      info.cause = cause = {}
      subject = new TestSubject(info)
    })

    it('should be instanceof `KronkError`', () => {
      expect(subject).to.be.instanceof(KronkError)
    })

    it('should pass command error guard', () => {
      expect(subject).to.satisfy(isCommandError)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', cause)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', code)
    })

    it('should set #command', () => {
      expect(subject).to.have.property('command', null)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', id)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', reason)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', 'CommandError')
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').and.not.empty
    })
  })

  describe('#snapshot', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new TestSubject(info)
    })

    it('should return command snapshot object', () => {
      expect(subject.snapshot()).to.eql({
        additional: subject.additional,
        code: subject.code,
        command: subject.command,
        id: subject.id,
        message: subject.message,
        stack: subject.stack
      })
    })
  })
})
