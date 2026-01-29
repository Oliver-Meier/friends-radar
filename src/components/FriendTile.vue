<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Friend } from '../types/Friend'
import { getContactColor } from '../utils/colorUtils'

const { t } = useI18n()

const props = defineProps<{
  friend: Friend
}>()

const emit = defineEmits<{
  contact: [id: string]
  delete: [id: string]
}>()

// Reactive time reference that updates every second
const currentTime = ref(Date.now())
let intervalId: number | undefined

onMounted(() => {
  // Update currentTime every second to trigger color recalculation
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId)
  }
})

// Now the computed property will re-evaluate when currentTime changes
const indicatorColor = computed(() => {
  // Use currentTime to make this reactive to time changes
  currentTime.value
  return getContactColor(props.friend.lastContact)
})

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
      :aria-label="t('friend.delete')"
      :title="t('friend.delete')"
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
  gap: 14px;
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  position: relative;
  touch-action: manipulation;
  border-radius: 12px;
  background: #fafafa;
}

.friend-tile:hover {
  transform: scale(1.05);
  background: #f5f5f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.friend-tile:active {
  transform: scale(0.98);
  background: #f0f0f0;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(244, 67, 54, 0.95);
  color: white;
  border: none;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  padding: 0;
  touch-action: manipulation;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

@media (max-width: 768px) {
  .delete-btn {
    opacity: 0.9;
    top: 4px;
    right: 4px;
  }
}

.friend-tile:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #f44336;
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.delete-btn:active {
  transform: scale(0.9);
}

.indicator {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 5px solid #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.indicator.green {
  background-color: #4caf50;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1), 0 0 24px rgba(76, 175, 80, 0.6);
}

.indicator.yellow {
  background-color: #ffc107;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1), 0 0 24px rgba(255, 193, 7, 0.6);
}

.indicator.red {
  background-color: #f44336;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1), 0 0 24px rgba(244, 67, 54, 0.6);
}

.name {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  pointer-events: none;
  letter-spacing: -0.01em;
}
</style>
