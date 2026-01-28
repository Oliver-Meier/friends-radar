<script setup lang="ts">
import FriendTile from './FriendTile.vue'
import type { Friend } from '../types/Friend'

defineProps<{
  friends: Friend[]
}>()

const emit = defineEmits<{
  contact: [id: string]
}>()

const handleContact = (id: string) => {
  emit('contact', id)
}
</script>

<template>
  <div class="friends-grid-container">
    <div v-if="friends.length === 0" class="empty-state">
      <p>No friends yet! Add some friends to get started.</p>
    </div>
    
    <div v-else class="friends-grid">
      <FriendTile 
        v-for="friend in friends" 
        :key="friend.id"
        :friend="friend"
        @contact="handleContact"
      />
    </div>
  </div>
</template>

<style scoped>
.friends-grid-container {
  width: 100%;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  user-select: none;
  -webkit-user-select: none;
}
</style>
