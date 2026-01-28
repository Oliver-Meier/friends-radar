export type ContactColor = 'green' | 'yellow' | 'red'

// TEMP: Using seconds instead of days for testing
const MILLISECONDS_PER_SECOND = 1000
const GREEN_THRESHOLD_SECONDS = 7
const YELLOW_THRESHOLD_SECONDS = 21

/**
 * Determines the traffic light color based on how long ago a friend was last contacted
 * TEMP: Using seconds for testing (will be days in production)
 * @param lastContact - Unix timestamp (milliseconds) of last contact
 * @returns 'green' if within 7 seconds, 'yellow' if 7-21 seconds, 'red' if 21+ seconds
 */
export function getContactColor(lastContact: number): ContactColor {
  const now = Date.now()
  const secondsSinceContact = (now - lastContact) / MILLISECONDS_PER_SECOND

  if (secondsSinceContact <= GREEN_THRESHOLD_SECONDS) {
    return 'green'
  } else if (secondsSinceContact <= YELLOW_THRESHOLD_SECONDS) {
    return 'yellow'
  } else {
    return 'red'
  }
}
