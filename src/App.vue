<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FriendsGrid from './components/FriendsGrid.vue'
import AddFriendForm from './components/AddFriendForm.vue'
import LoginScreen from './components/LoginScreen.vue'
import UserProfile from './components/UserProfile.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import TelegramSetup from './components/TelegramSetup.vue'
import { useFriends } from './composables/useFriends'
import { useNotifications } from './composables/useNotifications'
import { useAuth } from './composables/useAuth'

const { t } = useI18n()
const { currentUser, isGuest, continueAsGuest, exitGuestMode } = useAuth()

// Show app if user is logged in OR in guest mode
const showApp = computed(() => currentUser.value !== null || isGuest.value)

// Pass userId to useFriends to scope data per user
// null = guest mode (local storage only)
const userId = computed(() => currentUser.value?.id)
const { friends, addFriend, updateLastContact, removeFriend, isSyncing, syncError, isOnline } = useFriends(userId)
const { notificationsEnabled, requestPermission, isNotificationSupported, overdueFriends, isSafari, isIOS } = useNotifications(friends)

const handleContact = (id: string) => {
  updateLastContact(id)
}

const handleAddFriend = (name: string) => {
  addFriend(name)
}

const handleDeleteFriend = (id: string) => {
  removeFriend(id)
}

const handleEnableNotifications = () => {
  requestPermission()
}

const handleContinueAsGuest = () => {
  continueAsGuest()
}

const handleSignIn = () => {
  exitGuestMode()
}
</script>

<template>
  <!-- Show login screen if not authenticated and not in guest mode -->
  <LoginScreen v-if="!showApp" @continue-as-guest="handleContinueAsGuest" />
  
  <!-- Show main app if authenticated or in guest mode -->
  <div v-else class="app">
    <!-- Language switcher (top-left) -->
    <div class="lang-switcher-fixed">
      <LanguageSwitcher />
    </div>
    <!-- User profile fixed in top-right corner (only if logged in) -->
    <UserProfile 
      v-if="currentUser"
      :isSyncing="isSyncing" 
      :isOnline="isOnline" 
      :syncError="syncError" 
    />
    
    <!-- Guest mode indicator with Sign In option -->
    <div v-else class="guest-banner">
      <span>📱 {{ t('guest.banner') }}</span>
      <button @click="handleSignIn" class="sign-in-btn">{{ t('app.signIn') }}</button>
    </div>
    
    <h1>{{ t('app.title') }}</h1>
    <p class="subtitle">{{ t('app.subtitle') }}</p>
    
    <!-- Notification banner for supported browsers -->
    <div v-if="isNotificationSupported && !notificationsEnabled" class="notification-banner">
      <p>{{ t('notifications.enablePrompt') }}</p>
      <button @click="handleEnableNotifications" class="enable-btn">{{ t('notifications.enableButton') }}</button>
    </div>
    
    <!-- Safari/iOS info banner -->
    <div v-if="!isNotificationSupported" class="info-banner">
      <p v-if="isIOS">📱 <strong>{{ t('notifications.iosNote') }}</strong></p>
      <p v-else-if="isSafari">🍎 <strong>{{ t('notifications.safariNote') }}</strong></p>
      <p v-else>ℹ️ {{ t('notifications.unsupported') }}</p>
    </div>
    
    <!-- Visual indicator for overdue friends -->
    <div v-if="overdueFriends.length > 0 && !notificationsEnabled" class="overdue-banner">
      <p>
        ⚠️ <strong>{{ overdueFriends.length === 1 ? t('overdue.oneFriend') : t('overdue.manyFriends', { count: overdueFriends.length }) }}</strong>
      </p>
    </div>
    
    <!-- Telegram setup for mobile push notifications (only for logged-in users) -->
    <TelegramSetup v-if="currentUser && !isNotificationSupported" />
    
    <AddFriendForm @add="handleAddFriend" />
    
    <FriendsGrid :friends="friends" @contact="handleContact" @delete="handleDeleteFriend" />

    <div class="legend">
      <div class="legend-item">
        <span class="legend-color green"></span>
        <span>{{ t('legend.green') }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color yellow"></span>
        <span>{{ t('legend.yellow') }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color red"></span>
        <span>{{ t('legend.red') }}</span>
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
  position: relative;
}

.lang-switcher-fixed {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 1000;
}

.guest-banner {
  position: fixed;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sign-in-btn {
  background: white;
  color: #f57c00;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sign-in-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  margin-bottom: 32px;
  user-select: none;
  -webkit-user-select: none;
  font-size: 1.15rem;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.notification-banner {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.notification-banner p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}

.enable-btn {
  background: white;
  color: #4caf50;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.enable-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.enable-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.info-banner {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.info-banner p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
}

.info-banner strong {
  font-weight: 700;
}

.overdue-banner {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.overdue-banner p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4);
  }
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
