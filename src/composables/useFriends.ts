import { ref, watch, onUnmounted, computed, type Ref } from 'vue'
import type { Friend } from '../types/Friend'
import { useCloudflareSync } from './useCloudflareSync'
import { useAuth } from './useAuth'

const BASE_STORAGE_KEY = 'friends-radar-data'

// Get storage key for specific user
const getStorageKey = (userId?: string): string => {
  return userId ? `${BASE_STORAGE_KEY}-${userId}` : BASE_STORAGE_KEY
}

// Load friends from localStorage on init
const loadFriends = (userId?: string): Friend[] => {
  try {
    const storageKey = getStorageKey(userId)
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.warn('Failed to load friends from localStorage:', error)
  }
  return []
}

// Save friends to localStorage
const saveFriends = (friendsList: Friend[], userId?: string): void => {
  try {
    const storageKey = getStorageKey(userId)
    localStorage.setItem(storageKey, JSON.stringify(friendsList))
  } catch (error) {
    console.warn('Failed to save friends to localStorage:', error)
  }
}

// Store per-user composable instances to maintain singleton per user
const userInstances = new Map<string | undefined, ReturnType<typeof createUserInstance>>()

function createUserInstance(userIdRef: Ref<string | undefined>) {
  const { currentUser } = useAuth()
  
  // Create instance-specific friends ref (not shared!)
  const friends = ref<Friend[]>([])
  let currentUserId: string | undefined = undefined
  let currentStopPolling: (() => void) | null = null
  let currentSyncFns: ReturnType<typeof useCloudflareSync> | null = null
  
  // Get ID token from Google authentication
  const idToken = computed(() => {
    // Note: In a real implementation, you'd get the actual ID token from Google
    // For now, we'll use a placeholder that the worker can validate
    return currentUser.value?.id
  })

  // Initialize or update sync functions
  const initializeSyncForUser = (userId: string | undefined) => {
    // Stop any existing polling
    if (currentStopPolling) {
      currentStopPolling()
      currentStopPolling = null
    }

    // Initialize Cloudflare sync for this user
    currentSyncFns = useCloudflareSync(userId, idToken.value)

    // Load from localStorage first (instant)
    friends.value = loadFriends(userId)
    currentUserId = userId

    // Then load from Cloudflare (for cross-device sync)
    if (userId) {
      currentSyncFns.loadFriendsFromCloudflare().then(cloudflareFriends => {
        // Only merge if we're still on the same user
        if (currentUserId === userId) {
          if (cloudflareFriends.length > 0) {
            // Merge with local data, preferring newer timestamps
            const mergedFriends = mergeFriends(friends.value, cloudflareFriends)
            friends.value = mergedFriends
            saveFriends(mergedFriends, userId)
          } else if (friends.value.length > 0) {
            // If Cloudflare is empty but we have local data, sync it up
            currentSyncFns?.syncAllFriendsToCloudflare(friends.value).catch(console.error)
          }
        }
      })

      // Start polling for updates every 5 seconds
      currentSyncFns.startPolling((cloudflareFriends) => {
        // Only merge if we're still on the same user
        if (currentUserId === userId) {
          const mergedFriends = mergeFriends(friends.value, cloudflareFriends)
          friends.value = mergedFriends
          saveFriends(mergedFriends, userId)
        }
      }, 5000)
      
      currentStopPolling = currentSyncFns.stopPolling
    }
  }

  // Initialize for current user
  initializeSyncForUser(userIdRef.value)

  // Watch for userId changes and reinitialize
  watch(userIdRef, (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
      console.log(`[useFriends] User changed from ${oldUserId} to ${newUserId}, reinitializing...`)
      initializeSyncForUser(newUserId)
    }
  })

  // Merge two friend lists, preferring newer lastContact times
  const mergeFriends = (local: Friend[], remote: Friend[]): Friend[] => {
    const friendsMap = new Map<string, Friend>()

    // Add all local friends
    local.forEach(friend => friendsMap.set(friend.id, friend))

    // Merge with remote, keeping newer lastContact
    remote.forEach(remoteFriend => {
      const localFriend = friendsMap.get(remoteFriend.id)
      if (!localFriend || remoteFriend.lastContact > localFriend.lastContact) {
        friendsMap.set(remoteFriend.id, remoteFriend)
      }
    })

    return Array.from(friendsMap.values())
  }

  // Watch for changes and save to localStorage
  watch(friends, (newFriends) => {
    saveFriends(newFriends, currentUserId)
  }, { deep: true })

  const addFriend = async (name: string): Promise<void> => {
    // Capitalize first letter, keep rest as entered
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name: capitalizedName,
      lastContact: Date.now()
    }
    friends.value.push(newFriend)

    // Sync to Cloudflare if user is logged in and online
    if (currentUserId && currentSyncFns?.isOnline.value) {
      try {
        await currentSyncFns.syncFriendToCloudflare(newFriend)
      } catch (error) {
        console.error('Failed to sync new friend to Cloudflare:', error)
        // Keep in local state even if sync fails
      }
    }
  }

  const removeFriend = async (id: string): Promise<void> => {
    friends.value = friends.value.filter(friend => friend.id !== id)

    // Delete from Cloudflare if user is logged in and online
    if (currentUserId && currentSyncFns?.isOnline.value) {
      try {
        await currentSyncFns.deleteFriendFromCloudflare(id)
      } catch (error) {
        console.error('Failed to delete friend from Cloudflare:', error)
        // Keep deleted locally even if Cloudflare deletion fails
      }
    }
  }

  const updateLastContact = async (id: string): Promise<void> => {
    const friend = friends.value.find(f => f.id === id)
    if (friend) {
      friend.lastContact = Date.now()

      // Sync to Cloudflare if user is logged in and online
      if (currentUserId && currentSyncFns?.isOnline.value) {
        try {
          await currentSyncFns.syncFriendToCloudflare(friend)
        } catch (error) {
          console.error('Failed to sync updated friend to Cloudflare:', error)
          // Keep updated locally even if sync fails
        }
      }
    }
  }

  // Clean up polling when component unmounts
  onUnmounted(() => {
    if (currentStopPolling) {
      currentStopPolling()
    }
  })

  return {
    friends,
    addFriend,
    removeFriend,
    updateLastContact,
    isSyncing: computed(() => currentSyncFns?.isSyncing.value ?? false),
    syncError: computed(() => currentSyncFns?.syncError.value ?? null),
    isOnline: computed(() => currentSyncFns?.isOnline.value ?? true)
  }
}

export function useFriends(userIdRef: Ref<string | undefined>) {
  // In App.vue, we want a singleton per user
  // But in tests, each invocation should be independent
  // Check if we're in test mode
  const isTestMode = import.meta.env.MODE === 'test'
  
  if (isTestMode) {
    // In tests, always create a new instance (no caching)
    return createUserInstance(userIdRef)
  }
  
  // In production, maintain one instance per app (singleton)
  // This ensures that all components see the same friends ref
  const cacheKey = 'app-singleton'
  if (!userInstances.has(cacheKey)) {
    userInstances.set(cacheKey, createUserInstance(userIdRef))
  }
  return userInstances.get(cacheKey)!
}
