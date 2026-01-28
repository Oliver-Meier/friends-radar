<script setup lang="ts">
import { computed } from 'vue'
import type { Friend } from '../types/Friend'
import { getContactColor } from '../utils/colorUtils'

const props = defineProps<{
  friend: Friend
}>()

const emit = defineEmits<{
  contact: [id: string]
  delete: [id: string]
}>()

const indicatorColor = computed(() => getContactColor(props.friend.lastContact))

const handleClick = () => {
  emit('contact', props.friend.id)
}

const handleDelete = (event: Event) => {
  event.stopPropagation() // Prevent triggering contact event
  emit('delete', props.friend.id)
}
</script>

<template>
  <div class="friend-tile" @click="handleClick">
    <button 
      class="delete-btn" 
      @click="handleDelete"
      aria-label="Delete friend"
      title="Delete friend"
    >
      ×
    </button>
    <div class="indicator" :class="indicatorColor"></div>
    <div class="name">{{ friend.name }}</div>
  </div>
</template>

<style scoped>
.friend-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  position: relative;
  touch-action: manipulation;
}

.friend-tile:hover {
  transform: scale(1.05);
}

.friend-tile:active {
  transform: scale(0.95);
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  padding: 0;
  touch-action: manipulation;
}

@media (max-width: 768px) {
  .delete-btn {
    opacity: 1;
  }
}

.friend-tile:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #f44336;
  transform: scale(1.1);
}

.delete-btn:active {
  transform: scale(0.95);
}

.indicator {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #e0e0e0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.indicator.green {
  background-color: #4caf50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.indicator.yellow {
  background-color: #ffc107;
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
}

.indicator.red {
  background-color: #f44336;
  box-shadow: 0 0 20px rgba(244, 67, 54, 0.5);
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  pointer-events: none;
}
</style>
