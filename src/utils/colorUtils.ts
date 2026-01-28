export type ContactColor = 'green' | 'yellow' | 'red'

// Use seconds for tests, days for production
const IS_TEST = import.meta.env.MODE === 'test'
const MILLISECONDS_PER_UNIT = IS_TEST ? 1000 : 1000 * 60 * 60 * 24 // seconds in test, days in prod
const GREEN_THRESHOLD = 7  // 7 seconds (test) or 7 days (prod)
const YELLOW_THRESHOLD = 21 // 21 seconds (test) or 21 days (prod)

/**
 * Determines the traffic light color based on how long ago a friend was last contacted
 * Production: Uses days (7 days green, 21 days yellow, 21+ days red)
 * Tests: Uses seconds for fast testing
 * @param lastContact - Unix timestamp (milliseconds) of last contact
 * @returns 'green' if within threshold, 'yellow' if between thresholds, 'red' if beyond
 */
export function getContactColor(lastContact: number): ContactColor {
  const now = Date.now()
  const unitsSinceContact = (now - lastContact) / MILLISECONDS_PER_UNIT

  if (unitsSinceContact <= GREEN_THRESHOLD) {
    return 'green'
  } else if (unitsSinceContact <= YELLOW_THRESHOLD) {
    return 'yellow'
  } else {
    return 'red'
  }
}
