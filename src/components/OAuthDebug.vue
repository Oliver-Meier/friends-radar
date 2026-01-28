<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentOrigin = ref('')
const clientId = ref('')
const isConfigured = ref(false)

onMounted(() => {
  currentOrigin.value = window.location.origin
  clientId.value = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'NOT CONFIGURED'
  isConfigured.value = clientId.value !== 'NOT CONFIGURED' && clientId.value !== 'YOUR_GOOGLE_CLIENT_ID_HERE'
})

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert(`Copied to clipboard: ${text}`)
}
</script>

<template>
  <div class="debug-panel">
    <h3>🔍 OAuth Debug Info</h3>
    
    <div class="debug-section">
      <label>Current Origin (copy this!):</label>
      <div class="value-box" @click="copyToClipboard(currentOrigin)">
        <code>{{ currentOrigin }}</code>
        <button class="copy-btn">📋 Copy</button>
      </div>
      <p class="hint">👆 Click to copy. Add this EXACT URL to Google Cloud Console</p>
    </div>

    <div class="debug-section">
      <label>Client ID Status:</label>
      <div class="value-box" :class="isConfigured ? 'success' : 'error'">
        <span v-if="isConfigured">✅ Configured</span>
        <span v-else>❌ Not configured</span>
      </div>
    </div>

    <div class="debug-section">
      <label>Client ID:</label>
      <div class="value-box">
        <code class="small">{{ clientId }}</code>
      </div>
    </div>

    <div class="instructions">
      <h4>📝 Steps to Fix:</h4>
      <ol>
        <li>Copy the "Current Origin" above (click on it)</li>
        <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a></li>
        <li>Click your OAuth 2.0 Client ID</li>
        <li>Under "Authorized JavaScript origins", click "+ ADD URI"</li>
        <li>Paste the copied origin (NO trailing slash!)</li>
        <li>Click SAVE and wait 5 minutes</li>
        <li>Hard refresh this page (Cmd+Shift+R or Ctrl+Shift+R)</li>
      </ol>
    </div>

    <div class="example">
      <h4>✅ Correct Format Examples:</h4>
      <ul>
        <li><code>http://localhost:5173</code></li>
        <li><code>http://localhost:3000</code></li>
        <li><code>https://friends-radar.onrender.com</code></li>
        <li><code>https://yourdomain.com</code></li>
      </ul>
      
      <h4>❌ Wrong Format Examples:</h4>
      <ul>
        <li><code>http://localhost:5173/</code> (no trailing slash)</li>
        <li><code>localhost:5173</code> (need http://)</li>
        <li><code>http://127.0.0.1:5173</code> (use localhost)</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.debug-panel {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 20px auto;
  text-align: left;
}

h3 {
  margin-top: 0;
  color: #1a1a1a;
  text-align: center;
}

.debug-section {
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  color: #2a2a2a;
  margin-bottom: 8px;
  font-size: 14px;
}

.value-box {
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.value-box:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.value-box.success {
  background: #e8f5e9;
  border-color: #4caf50;
}

.value-box.error {
  background: #ffebee;
  border-color: #f44336;
}

code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #667eea;
  word-break: break-all;
}

code.small {
  font-size: 12px;
}

.copy-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666;
  font-style: italic;
}

.instructions {
  background: #fff3e0;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
  margin: 24px 0;
}

.instructions h4 {
  margin-top: 0;
  color: #e65100;
}

.instructions ol {
  margin: 12px 0 0;
  padding-left: 24px;
}

.instructions li {
  margin-bottom: 8px;
  color: #424242;
  line-height: 1.6;
}

.instructions a {
  color: #667eea;
  font-weight: 600;
}

.example {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
}

.example h4 {
  margin-top: 16px;
  color: #2a2a2a;
  font-size: 14px;
}

.example h4:first-child {
  margin-top: 0;
}

.example ul {
  margin: 8px 0 0;
  padding-left: 24px;
}

.example li {
  margin-bottom: 6px;
  color: #424242;
  line-height: 1.6;
}

.example code {
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
</style>
