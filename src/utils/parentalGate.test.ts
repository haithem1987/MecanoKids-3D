import { describe, it, expect } from 'vitest'
import { parseAdultNumericAnswer, generateParentalGateChallenge } from './parentalGate'

describe('parseAdultNumericAnswer', () => {
  it('parses standard Western digits', () => {
    expect(parseAdultNumericAnswer('42')).toBe(42)
    expect(parseAdultNumericAnswer('0')).toBe(0)
    expect(parseAdultNumericAnswer('-5')).toBe(-5)
  })

  it('trims surrounding whitespace', () => {
    expect(parseAdultNumericAnswer('  7  ')).toBe(7)
  })

  it('parses Eastern Arabic-Indic digits (٠-٩)', () => {
    // ٤٢ = 42
    expect(parseAdultNumericAnswer('٤٢')).toBe(42)
    expect(parseAdultNumericAnswer('٠')).toBe(0)
    expect(parseAdultNumericAnswer('٩')).toBe(9)
  })

  it('parses Persian digits (۰-۹)', () => {
    // ۴۲ = 42
    expect(parseAdultNumericAnswer('۴۲')).toBe(42)
    expect(parseAdultNumericAnswer('۰')).toBe(0)
  })

  it('returns null for empty string', () => {
    expect(parseAdultNumericAnswer('')).toBeNull()
    expect(parseAdultNumericAnswer('   ')).toBeNull()
  })

  it('returns null for non-numeric text', () => {
    expect(parseAdultNumericAnswer('abc')).toBeNull()
    expect(parseAdultNumericAnswer('12.5')).toBeNull()
    expect(parseAdultNumericAnswer('3 4')).toBeNull()
  })
})

describe('generateParentalGateChallenge – deterministic', () => {
  it('add: answer equals a*b+c', () => {
    const c = generateParentalGateChallenge('fr', { a: 4, b: 5, c: 3, op: 'add' })
    expect(c.expectedAnswer).toBe(4 * 5 + 3) // 23
  })

  it('sub: answer equals a*b-c', () => {
    const c = generateParentalGateChallenge('fr', { a: 6, b: 7, c: 2, op: 'sub' })
    expect(c.expectedAnswer).toBe(6 * 7 - 2) // 40
  })

  it('generates english question text', () => {
    const c = generateParentalGateChallenge('en', { a: 4, b: 5, c: 3, op: 'add' })
    expect(c.questionText).toMatch(/four.*five.*three/i)
  })

  it('generates arabic question text', () => {
    const c = generateParentalGateChallenge('ar', { a: 4, b: 5, c: 3, op: 'add' })
    expect(c.questionText).toContain('أربعة')
  })

  it('sub question mentions minus', () => {
    const fr = generateParentalGateChallenge('fr', { a: 5, b: 5, c: 5, op: 'sub' })
    expect(fr.questionText).toContain('moins')
    const en = generateParentalGateChallenge('en', { a: 5, b: 5, c: 5, op: 'sub' })
    expect(en.questionText).toContain('minus')
  })
})
