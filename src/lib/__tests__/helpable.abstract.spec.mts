/**
 * @file Unit Tests - Helpable
 * @module kronk/lib/tests/unit/Helpable
 */

import chars from '#enums/chars'
import TestSubject from '#lib/helpable.abstract'
import type { HelpableInfo } from '@flex-development/kronk'

describe('unit:lib/Helpable', () => {
  let Subject: new (info?: HelpableInfo | null | undefined) => TestSubject

  beforeAll(() => {
    Subject = class Subject extends TestSubject {}
  })

  describe('constructor', () => {
    let info: HelpableInfo
    let subject: TestSubject

    beforeAll(() => {
      info = {}
    })

    beforeEach(() => {
      subject = new Subject(info)
    })

    it('should set candidate metadata', () => {
      // Arrange
      const keys: string[] = ['description', 'hidden']
      const property: string = 'info'

      // Expect
      expect(subject).to.have.property(property).not.eq(info)
      expect(subject).to.have.property(property).not.eql(info)
      expect(subject).to.have.property(property).with.keys(keys)
    })
  })

  describe('#description', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new Subject()
    })

    it('should return candidate description', () => {
      expect(subject.description()).to.eq(chars.empty)
    })

    it.each<[URL | string | null | undefined]>([
      [null],
      [undefined],
      [chars.empty],
      [new URL('https://esbuild.github.io/api/#target')],
      ['release workflow tool\n  https://github.com/flex-development/grease']
    ])('should set candidate description and return `this` (%#)', desc => {
      // Arrange
      const property: string = 'info.description'

      // Act
      const result = subject.description(desc)

      // Expect
      expect(result).to.eq(subject)

      // Expect (conditional)
      if (desc === chars.empty) {
        expect(result).to.have.nested.property(property).be.null
      } else {
        expect(result).to.have.nested.property(property, desc)
      }
    })
  })

  describe('#hidden', () => {
    it.each<[(HelpableInfo | null | undefined)?]>([
      [],
      [null],
      [undefined],
      [{ hidden: false }]
    ])('should be `false` if candidate not hidden in help text (%#)', info => {
      expect(new Subject(info)).to.have.property('hidden', false)
    })

    it('should be `true` if candidate hidden in help text', () => {
      // Arrange
      const subject: TestSubject = new Subject({ hidden: true })

      // Expect
      expect(subject).to.have.property('hidden').be.true
    })
  })

  describe('#hide', () => {
    it.each<Parameters<TestSubject['hide']>>([
      [],
      [null],
      [undefined],
      [true]
    ])('should remove candidate from help and return `this` (%#)', hidden => {
      // Arrange
      const subject: TestSubject = new Subject()

      // Act
      const result = subject.hide(hidden)

      // Expect
      expect(result).to.eq(subject)
      expect(subject).to.have.nested.property('info.hidden', true)
    })

    it('should show candidate in help and return `this`', () => {
      // Arrange
      const subject: TestSubject = new Subject({ hidden: true })

      // Act
      const result = subject.hide(false)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.hidden').be.false
    })
  })
})
