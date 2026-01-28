import { ref, onMounted, watch, computed } from 'vue'
import type { Friend } from '../types/Friend'

const NOTIFICATION_CHECK_INTERVAL = 60000 // Check every minute

// Use seconds for tests, days for production (same as colorUtils)
const IS_TEST = import.meta.env.MODE === 'test'
const MILLISECONDS_PER_UNIT = IS_TEST ? 1000 : 1000 * 60 * 60 * 24 // seconds in test, days in prod
const OVERDUE_THRESHOLD = 21 * MILLISECONDS_PER_UNIT // 21 seconds (test) or 21 days (prod)

const notificationPermission = ref<NotificationPermission>('default')
const notificationsEnabled = ref(false)

// Detect Safari/iOS
const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isSafariBrowser = ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1
  console.log('[useNotifications] Safari detection:', isSafariBrowser, 'UA:', ua)
  return isSafariBrowser
}

const isIOS = () => {
  const isiOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  console.log('[useNotifications] iOS detection:', isiOSDevice, 'UA:', navigator.userAgent, 'Platform:', navigator.platform)
  return isiOSDevice
}

const isNotificationSupported = computed(() => {
  // Safari on iOS doesn't support Web Notifications API at all
  if (isIOS()) {
    console.log('[useNotifications] iOS detected - notifications NOT supported')
    return false
  }
  
  // Safari on macOS has limited support
  // Web Push API is not available in PWA mode
  if (isSafari() && !window.Notification) {
    console.log('[useNotifications] Safari without Notification API - NOT supported')
    return false
  }
  
  const supported = 'Notification' in window
  console.log('[useNotifications] Notification support:', supported)
  return supported
})

export function useNotifications(friends: any) {
  const overdueFriends = computed(() => {
    const now = Date.now()
    return friends.value.filter((friend: Friend) => {
      const timeSinceContact = now - friend.lastContact
      return timeSinceContact > OVERDUE_THRESHOLD
    })
  })

  const requestPermission = async () => {
    if (!isNotificationSupported.value) {
      console.warn('Notifications are not supported on this platform')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      notificationPermission.value = permission
      notificationsEnabled.value = permission === 'granted'
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Friends Radar', {
          body: 'Notifications enabled! You\'ll be notified when friends need contact.',
          icon: '/pwa-192x192.png',
          tag: 'welcome'
        })
      }
      
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const checkOverdueFriends = () => {
    if (!notificationsEnabled.value || !isNotificationSupported.value) {
      return
    }

    if (overdueFriends.value.length > 0) {
      // Group notification for multiple overdue friends
      if (overdueFriends.value.length === 1) {
        const friend = overdueFriends.value[0]
        if (friend) {
          new Notification('Time to reach out!', {
            body: `You haven't contacted ${friend.name} in a while.`,
            icon: '/pwa-192x192.png',
            tag: `overdue-${friend.id}`,
            badge: '/pwa-192x192.png'
          })
        }
      } else {
        new Notification('Time to reach out!', {
          body: `${overdueFriends.value.length} friends are waiting to hear from you.`,
          icon: '/pwa-192x192.png',
          tag: 'overdue-multiple',
          badge: '/pwa-192x192.png'
        })
      }
    }
  }

  onMounted(() => {
    // Check current permission status
    if (isNotificationSupported.value) {
      notificationPermission.value = Notification.permission
      notificationsEnabled.value = Notification.permission === 'granted'
    }

    // Set up periodic checks for overdue friends
    const interval = setInterval(checkOverdueFriends, NOTIFICATION_CHECK_INTERVAL)

    // Initial check after 5 seconds
    setTimeout(checkOverdueFriends, 5000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  })

  // Watch for changes in friends and check notifications
  watch(friends, () => {
    // Optional: Check immediately when friends list changes
    // This could be useful if you want immediate notifications
  }, { deep: true })

  return {
    notificationPermission,
    notificationsEnabled,
    requestPermission,
    checkOverdueFriends,
    isNotificationSupported,
    overdueFriends,
    isSafari: isSafari(),
    isIOS: isIOS()
  }
}
