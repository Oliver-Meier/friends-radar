<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const setLocale = (lang: 'en' | 'de') => {
  locale.value = lang
}
</script>

<template>
  <div class="lang-switcher">
    <button
      type="button"
      class="lang-btn"
      :class="{ active: locale === 'en' }"
      @click="setLocale('en')"
      aria-label="English"
    >
      EN
    </button>
    <span class="lang-sep">|</span>
    <button
      type="button"
      class="lang-btn"
      :class="{ active: locale === 'de' }"
      @click="setLocale('de')"
      aria-label="Deutsch"
    >
      DE
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  padding: 6px 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lang-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  color: #1a1a1a;
  background: #f0f0f0;
}

.lang-btn.active {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.12);
}

.lang-sep {
  color: #ccc;
  font-weight: 300;
  user-select: none;
}
</style>
