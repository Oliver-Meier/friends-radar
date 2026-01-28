<script setup lang="ts">
import { onMounted } from 'vue'
import FriendTile from './components/FriendTile.vue'
import { useFriends } from './composables/useFriends'

const { friends, addFriend, updateLastContact } = useFriends()

// Initialize demo friends if none exist
onMounted(() => {
  if (friends.value.length === 0) {
    const now = Date.now()
    addFriend('Alice')
    addFriend('Bob')
    addFriend('Charlie')
    addFriend('Diana')
    
    // Manually set their lastContact times for demo
    if (friends.value[0]) friends.value[0].lastContact = now // Green (today)
    if (friends.value[1]) friends.value[1].lastContact = now - (3 * 24 * 60 * 60 * 1000) // Green (3 days)
    if (friends.value[2]) friends.value[2].lastContact = now - (10 * 24 * 60 * 60 * 1000) // Yellow (10 days)
    if (friends.value[3]) friends.value[3].lastContact = now - (30 * 24 * 60 * 60 * 1000) // Red (30 days)
  }
})

const handleContact = (id: string) => {
  updateLastContact(id)
  console.log('Updated contact time for friend:', id)
}
</script>

<template>
  <div class="app">
    <h1>Friends Radar - Demo</h1>
    <p class="subtitle">Click on a friend to record contact</p>
    
    <div class="demo-grid">
      <FriendTile 
        v-for="friend in friends" 
        :key="friend.id"
        :friend="friend"
        @contact="handleContact"
      />
    </div>

    <div class="legend">
      <div class="legend-item">
        <span class="legend-color green"></span>
        <span>Green: 0-7 days</span>
      </div>
      <div class="legend-item">
        <span class="legend-color yellow"></span>
        <span>Yellow: 7-21 days</span>
      </div>
      <div class="legend-item">
        <span class="legend-color red"></span>
        <span>Red: 21+ days</span>
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
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
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
