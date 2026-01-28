import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getContactColor } from '../utils/colorUtils'

describe('colorUtils', () => {
  beforeEach(() => {
    // Reset time mocking before each test
    vi.useRealTimers()
  })

  describe('getContactColor', () => {
    it('returns green for contact within 7 seconds', () => {
      const now = Date.now()
      
      // Just contacted (0 seconds ago)
      expect(getContactColor(now)).toBe('green')
      
      // 3 seconds ago
      expect(getContactColor(now - 3000)).toBe('green')
      
      // 7 seconds ago (boundary)
      expect(getContactColor(now - 7000)).toBe('green')
    })

    it('returns yellow for contact between 7 and 21 seconds', () => {
      const now = Date.now()
      
      // 7.1 seconds ago (just over green threshold)
      expect(getContactColor(now - 7100)).toBe('yellow')
      
      // 14 seconds ago (middle of yellow range)
      expect(getContactColor(now - 14000)).toBe('yellow')
      
      // 21 seconds ago (boundary)
      expect(getContactColor(now - 21000)).toBe('yellow')
    })

    it('returns red for contact over 21 seconds ago', () => {
      const now = Date.now()
      
      // 21.1 seconds ago (just over yellow threshold)
      expect(getContactColor(now - 21100)).toBe('red')
      
      // 30 seconds ago
      expect(getContactColor(now - 30000)).toBe('red')
      
      // 1 minute ago
      expect(getContactColor(now - 60000)).toBe('red')
      
      // 1 hour ago
      expect(getContactColor(now - 3600000)).toBe('red')
    })

    it('handles boundary conditions correctly', () => {
      // Use fake timers for precise control
      vi.useFakeTimers()
      const now = 1000000000000 // Fixed timestamp
      vi.setSystemTime(now)
      
      // Exactly at green boundary (7000ms = 7 seconds)
      expect(getContactColor(now - 7000)).toBe('green')
      
      // Just over green boundary (7001ms = 7.001 seconds)
      expect(getContactColor(now - 7001)).toBe('yellow')
      
      // Exactly at yellow boundary (21000ms = 21 seconds)
      expect(getContactColor(now - 21000)).toBe('yellow')
      
      // Just over yellow boundary (21001ms = 21.001 seconds)
      expect(getContactColor(now - 21001)).toBe('red')
      
      vi.useRealTimers()
    })

    it('handles future timestamps gracefully', () => {
      const now = Date.now()
      const futureTime = now + 10000
      
      // Future timestamp should be treated as green (0 seconds)
      expect(getContactColor(futureTime)).toBe('green')
    })

    it('works with mocked time', () => {
      const mockNow = 1000000000000 // Fixed timestamp
      vi.useFakeTimers()
      vi.setSystemTime(mockNow)
      
      expect(getContactColor(mockNow)).toBe('green')
      expect(getContactColor(mockNow - 10000)).toBe('yellow')
      expect(getContactColor(mockNow - 25000)).toBe('red')
      
      vi.useRealTimers()
    })
  })
})
