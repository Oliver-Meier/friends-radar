import { ref, onMounted } from 'vue'
import type { GoogleUser, GoogleCredentialResponse, GooglePayload } from '../types/GoogleAuth'

const STORAGE_KEY = 'friends-radar-user'

// IMPORTANT: You'll need to replace this with your actual Google OAuth Client ID
// Get it from: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

// Decode JWT token to extract user info
const decodeJWT = (token: string): GooglePayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

// Load user from localStorage
const loadUser = (): GoogleUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load user from localStorage:', error)
  }
  return null
}

// Save user to localStorage
const saveUser = (user: GoogleUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.warn('Failed to save user to localStorage:', error)
  }
}

const currentUser = ref<GoogleUser | null>(loadUser())
const isInitialized = ref(false)

export function useAuth() {
  const handleCredentialResponse = (response: GoogleCredentialResponse) => {
    const payload = decodeJWT(response.credential)
    
    if (payload) {
      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
      
      currentUser.value = user
      saveUser(user)
    }
  }

  const initializeGoogleAuth = () => {
    if (isInitialized.value) return

    // Wait for google script to load
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle)
        
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })
        
        isInitialized.value = true
      }
    }, 100)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkGoogle)
      if (!isInitialized.value) {
        console.error('Failed to load Google Sign-In')
      }
    }, 10000)
  }

  const login = (element: HTMLElement) => {
    if (!isInitialized.value) {
      console.error('Google Sign-In not initialized')
      return
    }

    window.google?.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      shape: 'rectangular',
      width: '300'
    })
  }

  const logout = () => {
    currentUser.value = null
    saveUser(null)
    window.google?.accounts.id.disableAutoSelect()
  }

  onMounted(() => {
    initializeGoogleAuth()
  })

  return {
    currentUser,
    isInitialized,
    login,
    logout,
    initializeGoogleAuth
  }
}
