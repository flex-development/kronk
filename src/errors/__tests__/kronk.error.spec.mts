/**
 * @file Unit Tests - KronkError
 * @module kronk/errors/tests/unit/KronkError
 */

import chars from '#enums/chars'
import TestSubject from '#errors/kronk.error'
import formatList from '#internal/format-list'
import isKronkError from '#utils/is-kronk-error'
import type { KronkErrorInfo } from '@flex-development/kronk'
import { masks } from 'dateformat'
import { ok } from 'devlop'

describe('unit:errors/KronkError', () => {
  let choice: string
  let choices: string[]
  let info: KronkErrorInfo
  let reason: string

  beforeAll(() => {
    choice = chars.lowercaseH
    choices = Object.keys(masks).sort((a, b) => a.localeCompare(b))

    info = {
      additional: [`Choices: ${formatList(choices.map(ch => `'${ch}'`))}`],
      cause: { choice, choices },
      code: '1',
      id: 'kronk/invalid-argument',
      reason: `\`Option(-m --mask <mask>)\` does not allow \`${choice}\``
    }

    reason = 'Option(-ws, --workspace) failed due to \'-ws\''

    ok(info.additional, 'expected `info.additional`')
    ok(info.code, 'expected `info.code`')
  })

  describe('constructor(info)', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(info)
    })

    it('should pass kronk error guard', () => {
      expect(subject).to.satisfy(isKronkError)
    })

    it('should set #additional', () => {
      expect(subject).to.have.property('additional').eql(info.additional)
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', info.cause)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', +info.code!)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', info.id)
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', info.reason)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', 'KronkError')
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })

  describe('constructor(reason, id, code)', () => {
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject(reason)
    })

    it('should pass kronk error guard', () => {
      expect(subject).to.satisfy(isKronkError)
    })

    it('should set #additional', () => {
      expect(subject).to.have.property('additional').eql([])
    })

    it('should set #cause', () => {
      expect(subject).to.have.property('cause', undefined)
    })

    it('should set #code', () => {
      expect(subject).to.have.property('code', 1)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', 'kronk/error')
    })

    it('should set #message', () => {
      expect(subject).to.have.property('message', reason)
    })

    it('should set #name', () => {
      expect(subject).to.have.property('name', 'KronkError')
    })

    it('should set #stack', () => {
      expect(subject).to.have.property('stack').be.a('string').that.is.not.empty
    })
  })

  describe('#toJSON', () => {
    it('should return error as json object', () => {
      expect(new TestSubject(info).toJSON()).toMatchSnapshot()
    })
  })

  describe('#toString', () => {
    it('should return error as human-readable string', () => {
      // Arrange
      const subject: TestSubject = new TestSubject(reason, 'kronk/invalid-flag')

      // Act
      const result = subject.toString()

      // Expect
      expect(result).to.eq(String(subject))
      expect(result).toMatchSnapshot()
    })
  })
})
