import { ref } from 'vue'
import type { Friend } from '../types/Friend'

export function useCloudflareSync(userId: string | undefined, idToken: string | undefined) {
  const isSyncing = ref(false)
  const syncError = ref<string | null>(null)
  const isOnline = ref(navigator.onLine)
  
  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

  // Monitor online status
  window.addEventListener('online', () => { isOnline.value = true })
  window.addEventListener('offline', () => { isOnline.value = false })

  // Get auth headers
  const getHeaders = () => {
    if (!idToken) {
      throw new Error('No authentication token available')
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  }

  // Sync a single friend to Cloudflare
  const syncFriendToCloudflare = async (friend: Friend): Promise<void> => {
    if (!userId) return

    try {
      isSyncing.value = true
      syncError.value = null

      const response = await fetch(`${API_BASE_URL}/api/friends/${friend.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          name: friend.name,
          lastContact: friend.lastContact
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to sync friend: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error syncing friend to Cloudflare:', error)
      syncError.value = 'Failed to sync friend'
      throw error
    } finally {
      isSyncing.value = false
    }
  }

  // Delete friend from Cloudflare
  const deleteFriendFromCloudflare = async (friendId: string): Promise<void> => {
    if (!userId) return

    try {
      isSyncing.value = true
      syncError.value = null

      const response = await fetch(`${API_BASE_URL}/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to delete friend: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting friend from Cloudflare:', error)
      syncError.value = 'Failed to delete friend'
      throw error
    } finally {
      isSyncing.value = false
    }
  }

  // Load all friends from Cloudflare
  const loadFriendsFromCloudflare = async (): Promise<Friend[]> => {
    if (!userId) return []

    try {
      isSyncing.value = true
      syncError.value = null

      const response = await fetch(`${API_BASE_URL}/api/friends`, {
        method: 'GET',
        headers: getHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to load friends: ${response.statusText}`)
      }

      const data = await response.json()
      return data.friends || []
    } catch (error) {
      console.error('Error loading friends from Cloudflare:', error)
      syncError.value = 'Failed to load friends'
      return []
    } finally {
      isSyncing.value = false
    }
  }

  // Sync all friends to Cloudflare (batch)
  const syncAllFriendsToCloudflare = async (friends: Friend[]): Promise<void> => {
    if (!userId) return

    try {
      isSyncing.value = true
      syncError.value = null

      const response = await fetch(`${API_BASE_URL}/api/friends/batch`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ friends })
      })

      if (!response.ok) {
        throw new Error(`Failed to sync all friends: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error syncing all friends to Cloudflare:', error)
      syncError.value = 'Failed to sync all friends'
      throw error
    } finally {
      isSyncing.value = false
    }
  }

  // Poll for updates (since we don't have WebSockets)
  let pollInterval: number | null = null

  const startPolling = (callback: (friends: Friend[]) => void, intervalMs = 5000) => {
    if (pollInterval) return // Already polling

    pollInterval = window.setInterval(async () => {
      if (isOnline.value && userId) {
        try {
          const friends = await loadFriendsFromCloudflare()
          callback(friends)
        } catch (error) {
          console.error('Polling error:', error)
        }
      }
    }, intervalMs)
  }

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  return {
    isSyncing,
    syncError,
    isOnline,
    syncFriendToCloudflare,
    deleteFriendFromCloudflare,
    loadFriendsFromCloudflare,
    syncAllFriendsToCloudflare,
    startPolling,
    stopPolling
  }
}
