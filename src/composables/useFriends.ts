import { ref, watch } from 'vue'
import type { Friend } from '../types/Friend'

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

// Shared friends state - will be reset when user changes
let friends = ref<Friend[]>([])
let currentUserId: string | undefined = undefined

export function useFriends(userId?: string) {
  // If userId changed, reload friends for new user
  if (userId !== currentUserId) {
    currentUserId = userId
    friends.value = loadFriends(userId)
  }

  // Watch for changes and save to localStorage
  watch(friends, (newFriends) => {
    saveFriends(newFriends, currentUserId)
  }, { deep: true })

  const addFriend = (name: string): void => {
    // Capitalize first letter, keep rest as entered
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name: capitalizedName,
      lastContact: Date.now()
    }
    friends.value.push(newFriend)
  }

  const removeFriend = (id: string): void => {
    friends.value = friends.value.filter(friend => friend.id !== id)
  }

  const updateLastContact = (id: string): void => {
    const friend = friends.value.find(f => f.id === id)
    if (friend) {
      friend.lastContact = Date.now()
    }
  }

  return {
    friends,
    addFriend,
    removeFriend,
    updateLastContact
  }
}
