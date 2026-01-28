<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { currentUser } = useAuth()
const isExpanded = ref(false)
const isCopied = ref(false)

// The link code is just the userId for simplicity
const linkCode = computed(() => currentUser.value?.id || '')

const telegramBotUrl = 'https://t.me/FriendsRadarBot'

const copyLinkCode = async () => {
  if (!linkCode.value) return
  
  try {
    await navigator.clipboard.writeText(linkCode.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const openTelegramBot = () => {
  window.open(telegramBotUrl, '_blank')
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="telegram-setup">
    <button @click="toggleExpanded" class="telegram-header">
      <span class="telegram-icon">📱</span>
      <span class="telegram-title">Get Telegram Notifications</span>
      <span class="expand-icon">{{ isExpanded ? '▲' : '▼' }}</span>
    </button>
    
    <div v-if="isExpanded" class="telegram-content">
      <p class="description">
        Since iOS doesn't support web push notifications, you can get daily reminders via Telegram instead!
      </p>
      
      <div class="steps">
        <div class="step">
          <span class="step-number">1</span>
          <div class="step-content">
            <p>Open our Telegram bot</p>
            <button @click="openTelegramBot" class="telegram-button">
              <span>🤖</span> Open @FriendsRadarBot
            </button>
          </div>
        </div>
        
        <div class="step">
          <span class="step-number">2</span>
          <div class="step-content">
            <p>Send <code>/start</code> to subscribe</p>
          </div>
        </div>
        
        <div class="step">
          <span class="step-number">3</span>
          <div class="step-content">
            <p>Link your account with this code:</p>
            <div class="code-container">
              <code class="link-code">{{ linkCode || 'Sign in first' }}</code>
              <button 
                @click="copyLinkCode" 
                class="copy-button"
                :disabled="!linkCode"
              >
                {{ isCopied ? '✓ Copied!' : '📋 Copy' }}
              </button>
            </div>
            <p class="hint">Send: <code>/link {{ linkCode ? linkCode.substring(0, 8) + '...' : 'YOUR_CODE' }}</code></p>
          </div>
        </div>
      </div>
      
      <p class="footer-note">
        You'll receive a daily message at 9:00 AM if any friends are overdue!
      </p>
    </div>
  </div>
</template>

<style scoped>
.telegram-setup {
  background: linear-gradient(135deg, #0088cc 0%, #0077b5 100%);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3);
}

.telegram-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;
}

.telegram-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.telegram-icon {
  font-size: 1.5rem;
}

.telegram-title {
  flex: 1;
}

.expand-icon {
  font-size: 0.875rem;
  opacity: 0.8;
}

.telegram-content {
  padding: 0 20px 20px;
  color: white;
}

.description {
  margin-bottom: 20px;
  line-height: 1.5;
  opacity: 0.95;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content p {
  margin: 0 0 8px;
  line-height: 1.4;
}

.telegram-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #0088cc;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.telegram-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.code-container {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.link-code {
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.copy-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.copy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 8px;
}

.hint code {
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.footer-note {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.875rem;
  opacity: 0.9;
  text-align: center;
}

code {
  font-family: 'Courier New', monospace;
}

@media (max-width: 480px) {
  .telegram-header {
    padding: 14px 16px;
  }
  
  .telegram-content {
    padding: 0 16px 16px;
  }
  
  .code-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .link-code {
    max-width: 100%;
  }
}
</style>
