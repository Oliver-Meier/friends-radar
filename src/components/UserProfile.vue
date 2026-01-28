<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

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
    <button @click="handleLogout" class="logout-button">Sign Out</button>
  </div>
</template>

<style scoped>
.user-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-name {
  color: #2a2a2a;
  font-weight: 600;
  font-size: 1rem;
}

.logout-button {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logout-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

@media (max-width: 768px) {
  .user-profile {
    padding: 12px 16px;
    flex-direction: column;
    gap: 16px;
  }
  
  .logout-button {
    width: 100%;
  }
}
</style>
