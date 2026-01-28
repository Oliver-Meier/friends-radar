import { ref, onMounted, watch, computed } from 'vue'
import type { Friend } from '../types/Friend'

const NOTIFICATION_CHECK_INTERVAL = 60000 // Check every minute
const OVERDUE_THRESHOLD = 21 * 1000 // 21 seconds for testing (will be 21 days in production)

const notificationPermission = ref<NotificationPermission>('default')
const notificationsEnabled = ref(false)

// Detect Safari/iOS
const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1
}

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

const isNotificationSupported = computed(() => {
  // Safari on iOS doesn't support Web Notifications API at all
  if (isIOS()) {
    return false
  }
  
  // Safari on macOS has limited support
  // Web Push API is not available in PWA mode
  if (isSafari() && !window.Notification) {
    return false
  }
  
  return 'Notification' in window
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
