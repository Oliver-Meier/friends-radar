<script setup lang="ts">
import { ref } from 'vue'

const friendName = ref('')

const emit = defineEmits<{
  add: [name: string]
}>()

const handleSubmit = () => {
  const trimmedName = friendName.value.trim()
  
  if (trimmedName === '') {
    return // Don't submit if empty
  }
  
  emit('add', trimmedName)
  friendName.value = '' // Clear input after submission
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="add-friend-form">
    <input 
      v-model="friendName"
      type="text"
      placeholder="Enter friend's name"
      class="friend-input"
      maxlength="50"
    />
    <button 
      type="submit" 
      class="add-button"
      :disabled="friendName.trim() === ''"
    >
      Add Friend
    </button>
  </form>
</template>

<style scoped>
.add-friend-form {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.friend-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.friend-input:focus {
  border-color: #4caf50;
}

.friend-input::placeholder {
  color: #999;
}

.add-button {
  padding: 12px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .add-friend-form {
    flex-direction: column;
  }
  
  .add-button {
    width: 100%;
  }
}
</style>
