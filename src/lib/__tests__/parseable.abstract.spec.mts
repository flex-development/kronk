/**
 * @file Unit Tests - Parseable
 * @module kronk/lib/tests/unit/Parseable
 */

import chars from '#enums/chars'
import digits from '#fixtures/digits'
import identity from '#internal/identity'
import Helpable from '#lib/helpable.abstract'
import TestSubject from '#lib/parseable.abstract'
import type {
  DefaultInfo,
  List,
  ParseableInfo,
  ParseArg
} from '@flex-development/kronk'

describe('unit:lib/Parseable', () => {
  let Subject: new (info?: ParseableInfo | null | undefined) => TestSubject

  beforeAll(() => {
    Subject = class Subject extends TestSubject {
      /**
       * The unique id for the parse candidate.
       *
       * @public
       * @instance
       * @member {string} id
       */
      public id: string = chars.nul

      /**
       * Get the candidate as a human-readable string.
       *
       * @public
       * @instance
       * @member {() => string} toString
       */
      public toString: () => string = vi.fn(() => chars.nul)
    }
  })

  describe('constructor', () => {
    let info: ParseableInfo
    let subject: TestSubject

    beforeAll(() => {
      info = { choices: null, default: null, parser: null }
    })

    beforeEach(() => {
      subject = new Subject(info)
    })

    it('should be help text candidate', () => {
      expect(subject).to.be.instanceof(Helpable)
    })

    it('should set candidate metadata', () => {
      expect(subject).to.have.nested.property('info.choices').be.null
      expect(subject).to.have.nested.property('info.default').be.null
      expect(subject).to.have.nested.property('info.parser').be.null
    })
  })

  describe('#choices', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new Subject()
    })

    it('should return list of candidate choices', () => {
      // Act
      const result = subject.choices()

      // Expect
      expect(result).to.be.instanceof(Set).and.empty
      expect(result).to.not.be.frozen
    })

    it.each<[List<string>]>([
      [digits],
      [new Set(digits)]
    ])('should set candidate choices and return `this` (%#)', choices => {
      // Act
      const result = subject.choices(choices)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.choices', choices)
    })
  })

  describe('#default', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new Subject()
    })

    it.each<[ParseableInfo | null | undefined]>([
      [null],
      [undefined],
      [{ default: { value: null } }]
    ])('should return default value info (%#)', info => {
      expect(new Subject(info).default()).to.eq(info?.default)
    })

    it.each<[DefaultInfo | null | undefined]>([
      [null],
      [undefined],
      [{ value: 0 }]
    ])('should set default value info and return `this` (%#)', info => {
      // Act
      const result = subject.default(info)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.default', info)
    })
  })

  describe('#parser', () => {
    let subject: TestSubject

    beforeEach(() => {
      subject = new Subject()
    })

    it('should return argument parser', () => {
      // Act
      const result = subject.parser()

      // Expect
      expect(result).to.be.a('function').with.property('name', identity.name)
    })

    it.each<[ParseArg<any, any> | null | undefined]>([
      [null],
      [undefined],
      [vi.fn(Number.parseInt).mockName('parser')]
    ])('should set argument parser and return `this` (%#)', parser => {
      // Act
      const result = subject.parser(parser)

      // Expect
      expect(result).to.eq(subject)
      expect(result).to.have.nested.property('info.parser', parser)
    })
  })
})
