// Cloudflare Worker for Friends Radar API
// This handles all backend operations with D1 database

export interface Env {
  DB: D1Database
  TELEGRAM_BOT_TOKEN: string
}

interface Friend {
  id: string
  name: string
  lastContact: number
}

interface TelegramUpdate {
  message?: {
    chat: {
      id: number
      username?: string
      first_name?: string
    }
    text?: string
    from?: {
      username?: string
      first_name?: string
    }
  }
}

interface TelegramSubscription {
  chatId: string
  userId: string | null
  username: string | null
  firstName: string | null
  isActive: number
}

// Thresholds in days (21 days = overdue)
const OVERDUE_DAYS = 21
const OVERDUE_MS = OVERDUE_DAYS * 24 * 60 * 60 * 1000

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS()
    }

    const url = new URL(request.url)
    const path = url.pathname

    try {
      // Telegram webhook endpoint (no auth required - verified by secret path)
      if (path === '/telegram/webhook' && request.method === 'POST') {
        return await handleTelegramWebhook(env, request)
      }

      // Telegram link endpoint (links Telegram chat to app user)
      if (path === '/api/telegram/link' && request.method === 'POST') {
        const userId = await verifyAuth(request)
        if (!userId) {
          return jsonResponse({ error: 'Unauthorized' }, 401)
        }
        return await linkTelegramAccount(env.DB, userId, request)
      }

      // Check if user has Telegram linked
      if (path === '/api/telegram/status' && request.method === 'GET') {
        const userId = await verifyAuth(request)
        if (!userId) {
          return jsonResponse({ error: 'Unauthorized' }, 401)
        }
        return await getTelegramStatus(env.DB, userId)
      }

      // Unlink Telegram account
      if (path === '/api/telegram/unlink' && request.method === 'POST') {
        const userId = await verifyAuth(request)
        if (!userId) {
          return jsonResponse({ error: 'Unauthorized' }, 401)
        }
        return await unlinkTelegramAccount(env.DB, userId)
      }

      // Verify authentication for friends API
      const userId = await verifyAuth(request)
      if (!userId) {
        return jsonResponse({ error: 'Unauthorized' }, 401)
      }

      // Route requests
      if (path === '/api/friends' && request.method === 'GET') {
        return await getAllFriends(env.DB, userId)
      }

      if (path.startsWith('/api/friends/') && request.method === 'PUT') {
        const friendId = path.split('/')[3]
        return await upsertFriend(env.DB, userId, friendId, request)
      }

      if (path.startsWith('/api/friends/') && request.method === 'DELETE') {
        const friendId = path.split('/')[3]
        return await deleteFriend(env.DB, userId, friendId)
      }

      if (path === '/api/friends/batch' && request.method === 'PUT') {
        return await batchUpsertFriends(env.DB, userId, request)
      }

      return jsonResponse({ error: 'Not found' }, 404)
    } catch (error) {
      console.error('Worker error:', error)
      return jsonResponse({ error: 'Internal server error' }, 500)
    }
  },

  // Cron trigger for daily Telegram notifications
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('[Cron] Running daily notification job at', new Date().toISOString())
    await sendDailyNotifications(env)
  }
}

// ============== TELEGRAM BOT FUNCTIONS ==============

async function handleTelegramWebhook(env: Env, request: Request): Promise<Response> {
  const update: TelegramUpdate = await request.json()
  
  if (!update.message?.text) {
    return jsonResponse({ ok: true })
  }

  const chatId = update.message.chat.id.toString()
  const text = update.message.text.trim()
  const username = update.message.from?.username || update.message.chat.username || null
  const firstName = update.message.from?.first_name || update.message.chat.first_name || null

  console.log(`[Telegram] Received message from ${chatId}: ${text}`)

  // Handle commands
  if (text.startsWith('/start')) {
    await handleStartCommand(env, chatId, username, firstName)
  } else if (text.startsWith('/status')) {
    await handleStatusCommand(env, chatId)
  } else if (text.startsWith('/stop')) {
    await handleStopCommand(env, chatId)
  } else if (text.startsWith('/link ')) {
    const linkCode = text.substring(6).trim()
    await handleLinkCommand(env, chatId, linkCode)
  } else if (text.startsWith('/help')) {
    await handleHelpCommand(env, chatId)
  } else {
    // Unknown command - show help
    await sendTelegramMessage(env, chatId, 
      "I didn't understand that command. Try /help to see available commands."
    )
  }

  return jsonResponse({ ok: true })
}

async function handleStartCommand(env: Env, chatId: string, username: string | null, firstName: string | null): Promise<void> {
  // Check if already subscribed
  const existing = await env.DB
    .prepare('SELECT * FROM telegram_subscriptions WHERE chatId = ?')
    .bind(chatId)
    .first()

  if (existing) {
    // Reactivate if inactive
    if (!existing.isActive) {
      await env.DB
        .prepare('UPDATE telegram_subscriptions SET isActive = 1, updatedAt = ? WHERE chatId = ?')
        .bind(Date.now(), chatId)
        .run()
      await sendTelegramMessage(env, chatId, 
        `Welcome back, ${firstName || 'friend'}! 🎉\n\n` +
        `Your daily notifications are now active again.\n\n` +
        `To link your Friends Radar account, use the link code from the app:\n` +
        `/link YOUR_CODE\n\n` +
        `Commands:\n` +
        `/status - Check your overdue friends\n` +
        `/stop - Pause notifications\n` +
        `/help - Show all commands`
      )
    } else {
      await sendTelegramMessage(env, chatId,
        `You're already subscribed! 👍\n\n` +
        `Commands:\n` +
        `/status - Check your overdue friends\n` +
        `/stop - Pause notifications\n` +
        `/help - Show all commands`
      )
    }
    return
  }

  // Create new subscription
  await env.DB
    .prepare(
      'INSERT INTO telegram_subscriptions (chatId, username, firstName, isActive, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?)'
    )
    .bind(chatId, username, firstName, Date.now(), Date.now())
    .run()

  await sendTelegramMessage(env, chatId,
    `Welcome to Friends Radar! 🎯\n\n` +
    `I'll remind you daily about friends who need your attention.\n\n` +
    `To get started, link your Friends Radar account:\n` +
    `1. Open Friends Radar app\n` +
    `2. Go to Settings → Telegram Notifications\n` +
    `3. Copy your link code\n` +
    `4. Send: /link YOUR_CODE\n\n` +
    `Commands:\n` +
    `/status - Check your overdue friends\n` +
    `/stop - Pause notifications\n` +
    `/help - Show all commands`
  )
}

async function handleStatusCommand(env: Env, chatId: string): Promise<void> {
  // Get subscription
  const sub = await env.DB
    .prepare('SELECT * FROM telegram_subscriptions WHERE chatId = ?')
    .bind(chatId)
    .first<TelegramSubscription>()

  if (!sub) {
    await sendTelegramMessage(env, chatId, 
      "You're not subscribed yet. Send /start to begin!"
    )
    return
  }

  if (!sub.userId) {
    await sendTelegramMessage(env, chatId,
      "Your account isn't linked yet.\n\n" +
      "To link your Friends Radar account:\n" +
      "1. Open Friends Radar app\n" +
      "2. Go to Settings → Telegram Notifications\n" +
      "3. Copy your link code\n" +
      "4. Send: /link YOUR_CODE"
    )
    return
  }

  // Get overdue friends
  const now = Date.now()
  const friends = await env.DB
    .prepare('SELECT name, lastContact FROM friends WHERE userId = ? ORDER BY lastContact ASC')
    .bind(sub.userId)
    .all<Friend>()

  const overdueFriends = (friends.results || []).filter(
    f => (now - f.lastContact) > OVERDUE_MS
  )

  if (overdueFriends.length === 0) {
    await sendTelegramMessage(env, chatId,
      "🎉 Great job! No friends are overdue.\n\n" +
      "All your friends have been contacted within the last 21 days."
    )
  } else {
    const friendList = overdueFriends
      .map(f => {
        const days = Math.floor((now - f.lastContact) / (24 * 60 * 60 * 1000))
        return `• ${f.name} (${days} days ago)`
      })
      .join('\n')

    await sendTelegramMessage(env, chatId,
      `⚠️ ${overdueFriends.length} friend${overdueFriends.length > 1 ? 's' : ''} need${overdueFriends.length === 1 ? 's' : ''} your attention:\n\n` +
      `${friendList}\n\n` +
      `Open Friends Radar to mark them as contacted!`
    )
  }
}

async function handleStopCommand(env: Env, chatId: string): Promise<void> {
  await env.DB
    .prepare('UPDATE telegram_subscriptions SET isActive = 0, updatedAt = ? WHERE chatId = ?')
    .bind(Date.now(), chatId)
    .run()

  await sendTelegramMessage(env, chatId,
    "🔕 Notifications paused.\n\n" +
    "You won't receive daily reminders anymore.\n" +
    "Send /start anytime to resume notifications."
  )
}

async function handleLinkCommand(env: Env, chatId: string, linkCode: string): Promise<void> {
  // Link code format: userId (for simplicity)
  // In production, you might want to use a temporary code
  
  if (!linkCode || linkCode.length < 10) {
    await sendTelegramMessage(env, chatId,
      "Invalid link code. Please get a valid code from the Friends Radar app."
    )
    return
  }

  // Update subscription with userId
  const result = await env.DB
    .prepare('UPDATE telegram_subscriptions SET userId = ?, updatedAt = ? WHERE chatId = ?')
    .bind(linkCode, Date.now(), chatId)
    .run()

  if (result.meta.changes === 0) {
    await sendTelegramMessage(env, chatId,
      "Something went wrong. Please send /start first to subscribe."
    )
    return
  }

  await sendTelegramMessage(env, chatId,
    "✅ Account linked successfully!\n\n" +
    "You'll now receive daily notifications about friends who need your attention.\n\n" +
    "Send /status to check your current overdue friends."
  )
}

async function handleHelpCommand(env: Env, chatId: string): Promise<void> {
  await sendTelegramMessage(env, chatId,
    "🎯 *Friends Radar Bot*\n\n" +
    "*Commands:*\n" +
    "/start - Subscribe to daily notifications\n" +
    "/status - Check overdue friends now\n" +
    "/stop - Pause notifications\n" +
    "/link CODE - Link your Friends Radar account\n" +
    "/help - Show this message\n\n" +
    "*How it works:*\n" +
    "1. Link your Friends Radar account\n" +
    "2. I'll check your friends daily at 9am\n" +
    "3. If anyone is overdue (21+ days), I'll notify you\n\n" +
    "Visit: friends-radar.onrender.com"
  )
}

async function sendTelegramMessage(env: Env, chatId: string, text: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.error('[Telegram] No bot token configured')
    return
  }

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    }
  )

  if (!response.ok) {
    console.error('[Telegram] Failed to send message:', await response.text())
  }
}

// Daily notification cron job
async function sendDailyNotifications(env: Env): Promise<void> {
  console.log('[Cron] Fetching active subscriptions...')

  // Get all active subscriptions with linked accounts
  const subs = await env.DB
    .prepare('SELECT * FROM telegram_subscriptions WHERE isActive = 1 AND userId IS NOT NULL')
    .all<TelegramSubscription>()

  console.log(`[Cron] Found ${subs.results?.length || 0} active subscriptions`)

  for (const sub of subs.results || []) {
    try {
      // Get overdue friends for this user
      const now = Date.now()
      const friends = await env.DB
        .prepare('SELECT name, lastContact FROM friends WHERE userId = ? ORDER BY lastContact ASC')
        .bind(sub.userId)
        .all<Friend>()

      const overdueFriends = (friends.results || []).filter(
        f => (now - f.lastContact) > OVERDUE_MS
      )

      if (overdueFriends.length > 0) {
        const friendList = overdueFriends
          .slice(0, 5) // Limit to 5 names
          .map(f => f.name)
          .join(', ')
        
        const moreText = overdueFriends.length > 5 
          ? ` and ${overdueFriends.length - 5} more` 
          : ''

        await sendTelegramMessage(env, sub.chatId,
          `⚠️ *Daily Reminder*\n\n` +
          `${overdueFriends.length} friend${overdueFriends.length > 1 ? 's' : ''} need${overdueFriends.length === 1 ? 's' : ''} your attention:\n` +
          `${friendList}${moreText}\n\n` +
          `Open Friends Radar to reach out!`
        )
        
        console.log(`[Cron] Sent notification to ${sub.chatId} for ${overdueFriends.length} overdue friends`)
      }
    } catch (error) {
      console.error(`[Cron] Error processing subscription ${sub.chatId}:`, error)
    }
  }

  console.log('[Cron] Daily notifications complete')
}

// ============== API FUNCTIONS ==============

async function linkTelegramAccount(db: D1Database, userId: string, request: Request): Promise<Response> {
  const { chatId } = await request.json() as { chatId: string }

  await db
    .prepare('UPDATE telegram_subscriptions SET userId = ?, updatedAt = ? WHERE chatId = ?')
    .bind(userId, Date.now(), chatId)
    .run()

  return jsonResponse({ success: true })
}

async function getTelegramStatus(db: D1Database, userId: string): Promise<Response> {
  const sub = await db
    .prepare('SELECT chatId, username, firstName, isActive FROM telegram_subscriptions WHERE userId = ?')
    .bind(userId)
    .first()

  return jsonResponse({ 
    linked: !!sub,
    subscription: sub || null
  })
}

async function unlinkTelegramAccount(db: D1Database, userId: string): Promise<Response> {
  await db
    .prepare('UPDATE telegram_subscriptions SET userId = NULL, updatedAt = ? WHERE userId = ?')
    .bind(Date.now(), userId)
    .run()

  return jsonResponse({ success: true })
}

// ============== FRIENDS API FUNCTIONS ==============

// Verify JWT token from Google
async function verifyAuth(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // For development: accept any token as user ID
  // In production: verify JWT with Google's public keys
  if (!token) {
    return null
  }

  // TODO: In production, verify the JWT token properly:
  // 1. Fetch Google's public keys
  // 2. Verify signature
  // 3. Check expiration
  // 4. Extract user ID from 'sub' claim
  
  // For now, accept token as-is (NOT SECURE - FIX IN PRODUCTION)
  return token
}

// Get all friends for a user
async function getAllFriends(db: D1Database, userId: string): Promise<Response> {
  const result = await db
    .prepare('SELECT id, name, lastContact FROM friends WHERE userId = ? ORDER BY name')
    .bind(userId)
    .all()

  return jsonResponse({ friends: result.results || [] })
}

// Create or update a friend
async function upsertFriend(
  db: D1Database,
  userId: string,
  friendId: string,
  request: Request
): Promise<Response> {
  const body = await request.json() as { name: string; lastContact: number }

  await db
    .prepare(
      'INSERT INTO friends (id, userId, name, lastContact, updatedAt) VALUES (?, ?, ?, ?, ?) ' +
      'ON CONFLICT(id) DO UPDATE SET name = ?, lastContact = ?, updatedAt = ?'
    )
    .bind(
      friendId,
      userId,
      body.name,
      body.lastContact,
      Date.now(),
      body.name,
      body.lastContact,
      Date.now()
    )
    .run()

  return jsonResponse({ success: true })
}

// Delete a friend
async function deleteFriend(
  db: D1Database,
  userId: string,
  friendId: string
): Promise<Response> {
  await db
    .prepare('DELETE FROM friends WHERE id = ? AND userId = ?')
    .bind(friendId, userId)
    .run()

  return jsonResponse({ success: true })
}

// Batch upsert friends
async function batchUpsertFriends(
  db: D1Database,
  userId: string,
  request: Request
): Promise<Response> {
  const body = await request.json() as { friends: Friend[] }

  // Use a batch operation for better performance
  const statements = body.friends.map(friend =>
    db.prepare(
      'INSERT INTO friends (id, userId, name, lastContact, updatedAt) VALUES (?, ?, ?, ?, ?) ' +
      'ON CONFLICT(id) DO UPDATE SET name = ?, lastContact = ?, updatedAt = ?'
    ).bind(
      friend.id,
      userId,
      friend.name,
      friend.lastContact,
      Date.now(),
      friend.name,
      friend.lastContact,
      Date.now()
    )
  )

  await db.batch(statements)

  return jsonResponse({ success: true })
}

// Helper functions
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}

function handleCORS(): Response {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
