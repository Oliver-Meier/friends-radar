export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
}

export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

export interface GooglePayload {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture?: string
  given_name: string
  family_name?: string
  iat: number
  exp: number
}

// Declare google global for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitConfig) => void
          prompt: () => void
          renderButton: (parent: HTMLElement, options: GoogleButtonConfig) => void
          disableAutoSelect: () => void
          revoke: (email: string, callback: () => void) => void
        }
      }
    }
  }
}

export interface GoogleInitConfig {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

export interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  type?: 'standard' | 'icon'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  logo_alignment?: 'left' | 'center'
  width?: string
  locale?: string
}
