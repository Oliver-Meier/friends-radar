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
  margin-bottom: 40px;
  user-select: none;
  -webkit-user-select: none;
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
