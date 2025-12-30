/**
 * @file Unit Tests - OptionEvent
 * @module kronk/events/tests/unit/OptionEvent
 */

import optionValueSource from '#enums/option-value-source'
import KronkEvent from '#events/kronk.event'
import TestSubject from '#events/option.event'
import Option from '#lib/option'
import isOptionEvent from '#utils/is-option-event'
import type {
  Flags,
  OptionValueSource,
  RawOptionValue
} from '@flex-development/kronk'
import { ok } from 'devlop'

describe('unit:events/OptionEvent', () => {
  let flag: Flags
  let option: Option
  let source: OptionValueSource
  let subject: TestSubject
  let value: RawOptionValue

  beforeAll(() => {
    option = new Option('-d | --debug')
    ok(typeof option.long === 'string', 'expected `option.long`')

    flag = option.long
    source = optionValueSource.config
    value = true

    subject = new TestSubject(option, value, source, flag)
  })

  describe('constructor', () => {
    it('should be instanceof `KronkEvent`', () => {
      expect(subject).to.be.instanceof(KronkEvent)
    })

    it('should pass event guard', () => {
      expect(subject).to.satisfy(isOptionEvent)
    })

    it('should set #flag', () => {
      expect(subject).to.have.property('flag', flag)
    })

    it('should set #id', () => {
      expect(subject).to.have.property('id', option.event)
    })

    it('should set #option', () => {
      expect(subject).to.have.property('option', option)
    })

    it('should set #source', () => {
      expect(subject).to.have.property('source', source)
    })

    it('should set #value', () => {
      expect(subject).to.have.property('value', value)
    })
  })
})
