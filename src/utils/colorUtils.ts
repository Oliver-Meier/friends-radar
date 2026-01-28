export type ContactColor = 'green' | 'yellow' | 'red'

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
const GREEN_THRESHOLD_DAYS = 7
const YELLOW_THRESHOLD_DAYS = 21

/**
 * Determines the traffic light color based on how long ago a friend was last contacted
 * @param lastContact - Unix timestamp (milliseconds) of last contact
 * @returns 'green' if within 7 days, 'yellow' if 7-21 days, 'red' if 21+ days
 */
export function getContactColor(lastContact: number): ContactColor {
  const now = Date.now()
  const daysSinceContact = (now - lastContact) / MILLISECONDS_PER_DAY

  if (daysSinceContact <= GREEN_THRESHOLD_DAYS) {
    return 'green'
  } else if (daysSinceContact <= YELLOW_THRESHOLD_DAYS) {
    return 'yellow'
  } else {
    return 'red'
  }
}
