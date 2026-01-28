<script setup lang="ts">
import FriendTile from './components/FriendTile.vue'

// Demo friends with different contact times
const now = Date.now()
const demoFriends = [
  { id: '1', name: 'Alice', lastContact: now }, // Green (today)
  { id: '2', name: 'Bob', lastContact: now - (3 * 24 * 60 * 60 * 1000) }, // Green (3 days)
  { id: '3', name: 'Charlie', lastContact: now - (10 * 24 * 60 * 60 * 1000) }, // Yellow (10 days)
  { id: '4', name: 'Diana', lastContact: now - (30 * 24 * 60 * 60 * 1000) }, // Red (30 days)
]

const handleContact = (id: string) => {
  console.log('Contacted friend with ID:', id)
  alert(`You contacted friend ${id}! In the full app, this would update their lastContact time.`)
}
</script>

<template>
  <div class="app">
    <h1>Friends Radar - Demo</h1>
    <p class="subtitle">Click on a friend to record contact</p>
    
    <div class="demo-grid">
      <FriendTile 
        v-for="friend in demoFriends" 
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
