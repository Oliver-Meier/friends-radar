<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import OAuthDebug from './OAuthDebug.vue'

const { login, isInitialized } = useAuth()
const buttonContainer = ref<HTMLElement | null>(null)
const showDebug = ref(false)

onMounted(() => {
  // Wait for Google to initialize
  const renderButton = () => {
    if (isInitialized.value && buttonContainer.value) {
      login(buttonContainer.value)
    } else {
      // Retry after a short delay
      setTimeout(renderButton, 100)
    }
  }
  
  renderButton()
})

const toggleDebug = () => {
  showDebug.value = !showDebug.value
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Friends Radar</h1>
      <p class="subtitle">Never lose touch with the people who matter</p>
      
      <div class="login-content">
        <p class="login-message">Sign in with Google to get started</p>
        <div ref="buttonContainer" class="google-button-container"></div>
        <p class="privacy-note">Your friends list will be stored locally on your device</p>
        
        <button @click="toggleDebug" class="debug-toggle">
          {{ showDebug ? '🔼 Hide' : '🔽 Show' }} OAuth Setup Help
        </button>
      </div>
    </div>
    
    <OAuthDebug v-if="showDebug" />
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h1 {
  color: #1a1a1a;
  margin-bottom: 12px;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #4a4a4a;
  margin-bottom: 40px;
  font-size: 1.1rem;
  font-weight: 400;
}

.login-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.login-message {
  color: #2a2a2a;
  font-size: 1rem;
  font-weight: 500;
}

.google-button-container {
  display: flex;
  justify-content: center;
  min-height: 44px;
}

.privacy-note {
  color: #6a6a6a;
  font-size: 0.875rem;
  margin-top: 8px;
}

.debug-toggle {
  margin-top: 24px;
  background: #f5f5f5;
  color: #667eea;
  border: 2px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.debug-toggle:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.debug-toggle:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
