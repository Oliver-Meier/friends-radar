import { ref, watch } from 'vue'
import type { Friend } from '../types/Friend'

const STORAGE_KEY = 'friends-radar-data'

// Load friends from localStorage on init
const loadFriends = (): Friend[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
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
const saveFriends = (friendsList: Friend[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(friendsList))
  } catch (error) {
    console.warn('Failed to save friends to localStorage:', error)
  }
}

const friends = ref<Friend[]>(loadFriends())

// Watch for changes and save to localStorage
watch(friends, (newFriends) => {
  saveFriends(newFriends)
}, { deep: true })

export function useFriends() {
  const addFriend = (name: string): void => {
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name,
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
