<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  isSyncing: boolean
  isOnline: boolean
  syncError: string | null
}>()

const statusText = computed(() => {
  if (!props.isOnline) return t('sync.offline')
  if (props.syncError) return t('sync.error')
  if (props.isSyncing) return t('sync.syncing')
  return t('sync.synced')
})

const statusClass = computed(() => {
  if (!props.isOnline) return 'offline'
  if (props.syncError) return 'error'
  if (props.isSyncing) return 'syncing'
  return 'synced'
})

const statusIcon = computed(() => {
  if (!props.isOnline) return '⚠️'
  if (props.syncError) return '❌'
  if (props.isSyncing) return '🔄'
  return '✓'
})
</script>

<template>
  <div class="sync-indicator" :class="statusClass" :title="syncError || statusText">
    <span class="icon">{{ statusIcon }}</span>
    <span class="text">{{ statusText }}</span>
  </div>
</template>

<style scoped>
.sync-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;
}

.icon {
  font-size: 0.9rem;
  line-height: 1;
}

.text {
  line-height: 1;
}

.synced {
  background: #e8f5e9;
  color: #2e7d32;
}

.syncing {
  background: #fff3e0;
  color: #e65100;
  animation: pulse 1.5s ease-in-out infinite;
}

.offline {
  background: #fff3e0;
  color: #e65100;
}

.error {
  background: #ffebee;
  color: #c62828;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .text {
    display: none;
  }
  
  .sync-indicator {
    padding: 6px;
  }
}
</style>
