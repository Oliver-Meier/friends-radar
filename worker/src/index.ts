// Cloudflare Worker for Friends Radar API
// This handles all backend operations with D1 database

export interface Env {
  DB: D1Database
  // Add any other bindings here
}

interface Friend {
  id: string
  name: string
  lastContact: number
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS()
    }

    const url = new URL(request.url)
    const path = url.pathname

    // Verify authentication
    const userId = await verifyAuth(request)
    if (!userId) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    try {
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
  }
}

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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}

function handleCORS(): Response {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
