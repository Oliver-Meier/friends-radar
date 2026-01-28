import { ref } from 'vue'
import type { Friend } from '../types/Friend'

const friends = ref<Friend[]>([])

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
