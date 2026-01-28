import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFriends } from '../composables/useFriends'

// Mock Cloudflare sync to avoid API dependencies in tests
vi.mock('../composables/useCloudflareSync', () => ({
  useCloudflareSync: () => ({
    isSyncing: ref(false),
    syncError: ref(null),
    isOnline: ref(true),
    syncFriendToCloudflare: vi.fn().mockResolvedValue(undefined),
    deleteFriendFromCloudflare: vi.fn().mockResolvedValue(undefined),
    loadFriendsFromCloudflare: vi.fn().mockResolvedValue([]),
    syncAllFriendsToCloudflare: vi.fn().mockResolvedValue(undefined),
    startPolling: vi.fn(),
    stopPolling: vi.fn()
  })
}))

// Mock useAuth to avoid Google Auth dependencies in tests
vi.mock('../composables/useAuth', () => ({
  useAuth: () => ({
    currentUser: ref(null)
  })
}))

describe('useFriends', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('initializes with empty friends array when localStorage is empty', () => {
    const userIdRef = ref<string | undefined>(undefined)
    const { friends } = useFriends(userIdRef)
    expect(friends.value).toEqual([])
  })

  it('loads friends from localStorage on initialization', async () => {
    const mockFriends = [
      { id: '1', name: 'Alice', lastContact: Date.now() },
      { id: '2', name: 'Bob', lastContact: Date.now() }
    ]
    localStorage.setItem('friends-radar-data', JSON.stringify(mockFriends))

    const userIdRef = ref<string | undefined>(undefined)
    const { friends } = useFriends(userIdRef)
    
    expect(friends.value).toHaveLength(2)
    expect(friends.value[0]?.name).toBe('Alice')
    expect(friends.value[1]?.name).toBe('Bob')
  })

  it('handles corrupted localStorage data gracefully', () => {
    localStorage.setItem('friends-radar-data', 'invalid json{')

    const userIdRef = ref<string | undefined>(undefined)
    const { friends } = useFriends(userIdRef)
    expect(friends.value).toEqual([])
  })

  it('handles non-array data in localStorage', () => {
    localStorage.setItem('friends-radar-data', JSON.stringify({ not: 'array' }))

    const userIdRef = ref<string | undefined>(undefined)
    const { friends } = useFriends(userIdRef)
    expect(friends.value).toEqual([])
  })

  describe('addFriend', () => {
    it('adds a new friend with generated UUID', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('Charlie')
      
      expect(friends.value).toHaveLength(1)
      expect(friends.value[0]?.name).toBe('Charlie')
      expect(friends.value[0]?.id).toBeDefined()
      expect(typeof friends.value[0]?.id).toBe('string')
      expect(friends.value[0]?.lastContact).toBeDefined()
    })

    it('capitalizes first letter of friend name', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('alice')
      
      expect(friends.value[0]?.name).toBe('Alice')
    })

    it('converts rest of name to lowercase', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('DAVID')
      
      expect(friends.value[0]?.name).toBe('David')
    })

    it('handles mixed case names correctly', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('bOb')
      await addFriend('JoHn')
      
      expect(friends.value[0]?.name).toBe('Bob')
      expect(friends.value[1]?.name).toBe('John')
    })

    it('preserves already properly capitalized names', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('Sarah')
      
      expect(friends.value[0]?.name).toBe('Sarah')
    })

    it('sets lastContact to current time', async () => {
      const now = Date.now()
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('David')
      
      expect(friends.value[0]?.lastContact).toBeGreaterThanOrEqual(now - 10)
      expect(friends.value[0]?.lastContact).toBeLessThanOrEqual(Date.now())
    })

    it('saves to localStorage after adding', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { addFriend } = useFriends(userIdRef)
      
      await addFriend('Eve')
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const stored = localStorage.getItem('friends-radar-data')
      expect(stored).toBeDefined()
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed).toHaveLength(1)
        expect(parsed[0]?.name).toBe('Eve')
      }
    })

    it('can add multiple friends', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend } = useFriends(userIdRef)
      
      await addFriend('Alice')
      await addFriend('Bob')
      await addFriend('Charlie')
      
      expect(friends.value).toHaveLength(3)
      expect(friends.value.map(f => f.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })
  })

  describe('removeFriend', () => {
    it('removes a friend by id', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend, removeFriend } = useFriends(userIdRef)
      
      await addFriend('Alice')
      const aliceId = friends.value[0]?.id ?? ''
      await addFriend('Bob')
      
      await removeFriend(aliceId)
      
      expect(friends.value).toHaveLength(1)
      expect(friends.value[0]?.name).toBe('Bob')
    })

    it('does nothing if friend id does not exist', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend, removeFriend } = useFriends(userIdRef)
      
      await addFriend('Alice')
      await removeFriend('non-existent-id')
      
      expect(friends.value).toHaveLength(1)
      expect(friends.value[0]?.name).toBe('Alice')
    })

    it('saves to localStorage after removing', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend, removeFriend } = useFriends(userIdRef)
      
      await addFriend('Alice')
      await addFriend('Bob')
      const aliceId = friends.value[0]?.id ?? ''
      
      await removeFriend(aliceId)
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const stored = localStorage.getItem('friends-radar-data')
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed).toHaveLength(1)
        expect(parsed[0]?.name).toBe('Bob')
      }
    })
  })

  describe('updateLastContact', () => {
    it('updates lastContact timestamp for a friend', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend, updateLastContact } = useFriends(userIdRef)
      
      await addFriend('Alice')
      const aliceId = friends.value[0]?.id ?? ''
      const originalTime = friends.value[0]?.lastContact ?? 0
      
      // Wait a bit to ensure timestamp changes
      vi.useFakeTimers()
      vi.advanceTimersByTime(5000)
      
      await updateLastContact(aliceId)
      
      expect(friends.value[0]?.lastContact).toBeGreaterThan(originalTime)
      
      vi.useRealTimers()
    })

    it('does nothing if friend id does not exist', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend, updateLastContact } = useFriends(userIdRef)
      
      await addFriend('Alice')
      const originalTime = friends.value[0]?.lastContact ?? 0
      
      await updateLastContact('non-existent-id')
      
      expect(friends.value[0]?.lastContact).toBe(originalTime)
    })

    it('saves to localStorage after updating', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { friends, addFriend, updateLastContact } = useFriends(userIdRef)
      
      await addFriend('Alice')
      const aliceId = friends.value[0]?.id ?? ''
      
      // Wait a bit before updating
      await new Promise(resolve => setTimeout(resolve, 10))
      
      await updateLastContact(aliceId)
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const stored = localStorage.getItem('friends-radar-data')
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed[0]?.lastContact).toBe(friends.value[0]?.lastContact)
      }
    })
  })

  describe('persistence', () => {
    it('persists changes across multiple composable instances', async () => {
      const userIdRef1 = ref<string | undefined>(undefined)
      const { addFriend } = useFriends(userIdRef1)
      
      await addFriend('Alice')
      await addFriend('Bob')
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Create new instance (simulating page refresh)
      const userIdRef2 = ref<string | undefined>(undefined)
      const { friends: newFriends } = useFriends(userIdRef2)
      
      expect(newFriends.value).toHaveLength(2)
      expect(newFriends.value.map(f => f.name)).toEqual(['Alice', 'Bob'])
    })
  })

  describe('user-scoped data', () => {
    it('stores data in user-specific localStorage key when userId is provided', async () => {
      const userIdRef = ref<string | undefined>('user123')
      const { addFriend } = useFriends(userIdRef)
      
      await addFriend('Alice')
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const stored = localStorage.getItem('friends-radar-data-user123')
      expect(stored).toBeDefined()
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed).toHaveLength(1)
        expect(parsed[0]?.name).toBe('Alice')
      }
    })

    it('isolates data between different users', async () => {
      // User 1 adds Alice
      const userIdRef1 = ref<string | undefined>('user1')
      const { addFriend: addFriend1 } = useFriends(userIdRef1)
      await addFriend1('Alice')
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // User 2 adds Bob
      const userIdRef2 = ref<string | undefined>('user2')
      const { addFriend: addFriend2 } = useFriends(userIdRef2)
      await addFriend2('Bob')
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Verify each user has their own data
      const user1Data = localStorage.getItem('friends-radar-data-user1')
      const user2Data = localStorage.getItem('friends-radar-data-user2')
      
      expect(user1Data).toBeDefined()
      expect(user2Data).toBeDefined()
      
      if (user1Data) {
        const user1Friends = JSON.parse(user1Data)
        expect(user1Friends).toHaveLength(1)
        expect(user1Friends[0]?.name).toBe('Alice')
      }
      
      if (user2Data) {
        const user2Friends = JSON.parse(user2Data)
        expect(user2Friends).toHaveLength(1)
        expect(user2Friends[0]?.name).toBe('Bob')
      }
    })

    it('CRITICAL: switches data when userId changes reactively', async () => {
      localStorage.clear()
      
      // Set up pre-existing data for two users
      localStorage.setItem('friends-radar-data-user1', JSON.stringify([
        { id: '1', name: 'Alice', lastContact: Date.now() }
      ]))
      localStorage.setItem('friends-radar-data-user2', JSON.stringify([
        { id: '2', name: 'Bob', lastContact: Date.now() },
        { id: '3', name: 'Charlie', lastContact: Date.now() }
      ]))
      
      // Create reactive userId ref
      const userIdRef = ref<string | undefined>('user1')
      const { friends } = useFriends(userIdRef)
      
      // Should load user1's data (Alice)
      expect(friends.value).toHaveLength(1)
      expect(friends.value[0]?.name).toBe('Alice')
      
      // Switch to user2
      userIdRef.value = 'user2'
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should now show user2's data (Bob, Charlie)
      expect(friends.value).toHaveLength(2)
      expect(friends.value[0]?.name).toBe('Bob')
      expect(friends.value[1]?.name).toBe('Charlie')
      
      // Switch back to user1
      userIdRef.value = 'user1'
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should show user1's data again (Alice)
      expect(friends.value).toHaveLength(1)
      expect(friends.value[0]?.name).toBe('Alice')
    })

    it('CRITICAL: user A cannot see user B data', async () => {
      localStorage.clear()
      
      // User A adds friends
      const userARef = ref<string | undefined>('userA')
      const { friends: friendsA, addFriend: addFriendA } = useFriends(userARef)
      await addFriendA('Alice')
      await addFriendA('Amy')
      await new Promise(resolve => setTimeout(resolve, 10))
      
      expect(friendsA.value).toHaveLength(2)
      
      // User B adds different friends
      const userBRef = ref<string | undefined>('userB')
      const { friends: friendsB, addFriend: addFriendB } = useFriends(userBRef)
      await addFriendB('Bob')
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // User B should only see Bob, not Alice/Amy
      expect(friendsB.value).toHaveLength(1)
      expect(friendsB.value[0]?.name).toBe('Bob')
      expect(friendsB.value.some(f => f.name === 'Alice')).toBe(false)
      expect(friendsB.value.some(f => f.name === 'Amy')).toBe(false)
      
      // User A should still see their own data
      expect(friendsA.value).toHaveLength(2)
      expect(friendsA.value.some(f => f.name === 'Alice')).toBe(true)
      expect(friendsA.value.some(f => f.name === 'Amy')).toBe(true)
      expect(friendsA.value.some(f => f.name === 'Bob')).toBe(false)
    })

    it('uses default storage key when no userId provided', async () => {
      const userIdRef = ref<string | undefined>(undefined)
      const { addFriend } = useFriends(userIdRef)
      
      await addFriend('Alice')
      
      // Wait for watch to trigger
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const stored = localStorage.getItem('friends-radar-data')
      expect(stored).toBeDefined()
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed).toHaveLength(1)
        expect(parsed[0]?.name).toBe('Alice')
      }
    })

    it('CRITICAL: adding friend to one user does not affect other user', async () => {
      localStorage.clear()
      
      // User 1 adds Alice
      const user1Ref = ref<string | undefined>('user1')
      const { friends: friends1, addFriend: addFriend1 } = useFriends(user1Ref)
      await addFriend1('Alice')
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // User 2 starts with empty list
      const user2Ref = ref<string | undefined>('user2')
      const { friends: friends2, addFriend: addFriend2 } = useFriends(user2Ref)
      
      expect(friends2.value).toHaveLength(0)
      
      // User 2 adds Bob
      await addFriend2('Bob')
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // User 1 should still only have Alice
      expect(friends1.value).toHaveLength(1)
      expect(friends1.value[0]?.name).toBe('Alice')
      
      // User 2 should only have Bob
      expect(friends2.value).toHaveLength(1)
      expect(friends2.value[0]?.name).toBe('Bob')
      
      // Verify localStorage isolation
      const user1Storage = localStorage.getItem('friends-radar-data-user1')
      const user2Storage = localStorage.getItem('friends-radar-data-user2')
      
      if (user1Storage && user2Storage) {
        const user1Data = JSON.parse(user1Storage)
        const user2Data = JSON.parse(user2Storage)
        
        expect(user1Data).toHaveLength(1)
        expect(user1Data[0]?.name).toBe('Alice')
        
        expect(user2Data).toHaveLength(1)
        expect(user2Data[0]?.name).toBe('Bob')
      }
    })
  })
})
