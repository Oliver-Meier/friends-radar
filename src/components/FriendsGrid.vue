<script setup lang="ts">
import FriendTile from './FriendTile.vue'
import type { Friend } from '../types/Friend'

defineProps<{
  friends: Friend[]
}>()

const emit = defineEmits<{
  contact: [id: string]
  delete: [id: string]
}>()

const handleContact = (id: string) => {
  emit('contact', id)
}

const handleDelete = (id: string) => {
  emit('delete', id)
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
        @delete="handleDelete"
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
  gap: 24px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #888;
  font-size: 18px;
  font-weight: 500;
  animation: fadeIn 0.5s ease-out;
}

.empty-state p {
  margin: 0;
  user-select: none;
  -webkit-user-select: none;
}
</style>
