<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import SyncIndicator from './SyncIndicator.vue'

defineProps<{
  isSyncing?: boolean
  isOnline?: boolean
  syncError?: string | null
}>()

const { currentUser, logout } = useAuth()

const handleLogout = () => {
  if (confirm('Are you sure you want to sign out?')) {
    logout()
  }
}
</script>

<template>
  <div v-if="currentUser" class="user-profile">
    <div class="user-info">
      <img v-if="currentUser.picture" :src="currentUser.picture" :alt="currentUser.name" class="user-avatar" />
      <div v-else class="user-avatar-placeholder">{{ currentUser.name.charAt(0) }}</div>
      <span class="user-name">{{ currentUser.name }}</span>
    </div>
    <div class="actions">
      <SyncIndicator 
        :isSyncing="isSyncing || false" 
        :isOnline="isOnline !== undefined ? isOnline : true"
        :syncError="syncError || null"
      />
      <button @click="handleLogout" class="logout-button">Sign Out</button>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.user-profile:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.user-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.user-name {
  color: #2a2a2a;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logout-button {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.logout-button:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

.logout-button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .user-profile {
    top: 16px;
    right: 16px;
    padding: 10px 16px;
    gap: 12px;
  }
  
  .user-name {
    display: none;
  }
  
  .user-avatar,
  .user-avatar-placeholder {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  .logout-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
