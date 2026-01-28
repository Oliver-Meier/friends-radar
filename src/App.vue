<script setup lang="ts">
import { onMounted } from 'vue'
import FriendsGrid from './components/FriendsGrid.vue'
import AddFriendForm from './components/AddFriendForm.vue'
import { useFriends } from './composables/useFriends'

const { friends, addFriend, updateLastContact } = useFriends()

// Initialize demo friends if none exist
onMounted(() => {
  if (friends.value.length === 0) {
    const now = Date.now()
    
    // 25 friends with various names
    const friendNames = [
      'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
      'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
      'Kate', 'Liam', 'Mia', 'Noah', 'Olivia',
      'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina',
      'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara'
    ]
    
    // Add all friends
    friendNames.forEach(name => addFriend(name))
    
    // Set different lastContact times (using seconds for testing)
    // Mix of green (0-7s), yellow (7-21s), and red (21+s)
    const timings = [
      0,    // Green - just now
      2,    // Green - 2 seconds ago
      5,    // Green - 5 seconds ago
      7,    // Green/Yellow boundary
      8,    // Yellow - 8 seconds ago
      10,   // Yellow - 10 seconds ago
      12,   // Yellow - 12 seconds ago
      15,   // Yellow - 15 seconds ago
      18,   // Yellow - 18 seconds ago
      20,   // Yellow - 20 seconds ago
      21,   // Yellow/Red boundary
      25,   // Red - 25 seconds ago
      30,   // Red - 30 seconds ago
      40,   // Red - 40 seconds ago
      50,   // Red - 50 seconds ago
      60,   // Red - 1 minute ago
      90,   // Red - 1.5 minutes ago
      120,  // Red - 2 minutes ago
      180,  // Red - 3 minutes ago
      300,  // Red - 5 minutes ago
      600,  // Red - 10 minutes ago
      1,    // Green - 1 second ago
      4,    // Green - 4 seconds ago
      9,    // Yellow - 9 seconds ago
      35    // Red - 35 seconds ago
    ]
    
    friends.value.forEach((friend, index) => {
      if (timings[index] !== undefined) {
        friend.lastContact = now - (timings[index] * 1000)
      }
    })
  }
})

const handleContact = (id: string) => {
  updateLastContact(id)
  console.log('Updated contact time for friend:', id)
}

const handleAddFriend = (name: string) => {
  addFriend(name)
  console.log('Added friend:', name)
}

const resetDemo = () => {
  localStorage.clear()
  location.reload()
}
</script>

<template>
  <div class="app">
    <h1>Friends Radar - Demo</h1>
    <p class="subtitle">Click on a friend to record contact</p>
    
    <button @click="resetDemo" class="reset-btn">Reset Demo (25 friends)</button>
    
    <AddFriendForm @add="handleAddFriend" />
    
    <FriendsGrid :friends="friends" @contact="handleContact" />

    <div class="legend">
      <div class="legend-item">
        <span class="legend-color green"></span>
        <span>Green: 0-7 seconds (TESTING)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color yellow"></span>
        <span>Yellow: 7-21 seconds (TESTING)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color red"></span>
        <span>Red: 21+ seconds (TESTING)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 8px;
  user-select: none;
  -webkit-user-select: none;
}

.subtitle {
  color: #666;
  margin-bottom: 20px;
  user-select: none;
  -webkit-user-select: none;
}

.reset-btn {
  padding: 10px 20px;
  margin-bottom: 30px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
}

.reset-btn:hover {
  background: #d32f2f;
}

.reset-btn:active {
  transform: scale(0.98);
}

:deep(.friends-grid-container) {
  margin-bottom: 40px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  user-select: none;
  -webkit-user-select: none;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
}

.legend-color.green {
  background-color: #4caf50;
}

.legend-color.yellow {
  background-color: #ffc107;
}

.legend-color.red {
  background-color: #f44336;
}
</style>
