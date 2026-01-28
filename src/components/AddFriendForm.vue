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
  margin-bottom: 48px;
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}

.friend-input {
  flex: 1;
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  background: #ffffff;
  color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.friend-input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.friend-input::placeholder {
  color: #999;
}

.add-button {
  padding: 14px 28px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.add-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.35);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(76, 175, 80, 0.2);
}

.add-button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

@media (max-width: 768px) {
  .add-friend-form {
    flex-direction: column;
    gap: 14px;
  }
  
  .add-button {
    width: 100%;
    padding: 16px 28px;
  }
}
</style>
