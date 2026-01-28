<script setup lang="ts">
import FriendsGrid from './components/FriendsGrid.vue'
import AddFriendForm from './components/AddFriendForm.vue'
import { useFriends } from './composables/useFriends'

const { friends, addFriend, updateLastContact, removeFriend } = useFriends()

const handleContact = (id: string) => {
  updateLastContact(id)
}

const handleAddFriend = (name: string) => {
  addFriend(name)
}

const handleDeleteFriend = (id: string) => {
  removeFriend(id)
}
</script>

<template>
  <div class="app">
    <h1>Friends Radar</h1>
    <p class="subtitle">Never lose touch with the people who matter</p>
    
    <AddFriendForm @add="handleAddFriend" />
    
    <FriendsGrid :friends="friends" @contact="handleContact" @delete="handleDeleteFriend" />

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
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
  text-align: center;
  min-height: 100vh;
}

h1 {
  color: #1a1a1a;
  margin-bottom: 12px;
  user-select: none;
  -webkit-user-select: none;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #4a4a4a;
  margin-bottom: 56px;
  user-select: none;
  -webkit-user-select: none;
  font-size: 1.15rem;
  font-weight: 400;
  letter-spacing: -0.01em;
}

:deep(.friends-grid-container) {
  margin-bottom: 56px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  border-radius: 12px;
  user-select: none;
  -webkit-user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2a2a2a;
  font-weight: 500;
  font-size: 15px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
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

@media (max-width: 768px) {
  .app {
    padding: 32px 16px;
  }
  
  h1 {
    font-size: 2.25rem;
  }
  
  .subtitle {
    font-size: 1rem;
    margin-bottom: 40px;
  }
  
  .legend {
    gap: 20px;
    padding: 20px;
  }
  
  .legend-item {
    font-size: 14px;
  }
}
</style>
