# Telegram Bot Setup Guide

This guide explains how to set up the Telegram bot for Friends Radar daily notifications.

## Why Telegram?

iOS (Safari, Chrome) doesn't support web push notifications. Telegram provides a reliable alternative for receiving daily reminders about friends who need your attention.

## For Users

### How to Subscribe

1. **Open the Telegram bot**: [@FriendsRadarBot](https://t.me/FriendsRadarBot)

2. **Start the bot**: Send `/start`

3. **Link your account**:
   - Open Friends Radar app (logged in with Google)
   - Look for the blue "Get Telegram Notifications" card
   - Copy your link code
   - Send to the bot: `/link YOUR_CODE`

4. **Done!** You'll receive daily notifications at 9:00 AM if any friends are overdue (21+ days)

### Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Subscribe to notifications |
| `/status` | Check overdue friends right now |
| `/stop` | Pause notifications |
| `/link CODE` | Link your Friends Radar account |
| `/help` | Show available commands |

---

## For Developers

### Prerequisites

1. **Telegram Bot Token** from [@BotFather](https://t.me/BotFather)
2. **Cloudflare account** with Workers and D1

### Step 1: Create a Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Choose a name: `Friends Radar`
4. Choose a username: `FriendsRadarBot` (must end with "bot")
5. Copy the bot token (looks like `123456789:ABCdefGHI...`)

### Step 2: Configure the Worker

1. Add the bot token as a secret:
   ```bash
   cd worker
   wrangler secret put TELEGRAM_BOT_TOKEN
   # Paste your bot token when prompted
   ```

2. Update the database schema:
   ```bash
   wrangler d1 execute friends-radar-db --remote --file schema.sql
   ```

3. Deploy the worker:
   ```bash
   wrangler deploy
   ```

### Step 3: Set Up Webhook

Register your Worker as the Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://friends-radar-api.mr-meieroliver.workers.dev/telegram/webhook"}'
```

Verify it's set:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### Step 4: Verify Cron Trigger

The worker has a cron trigger configured to run daily at 9:00 AM UTC:

```toml
# wrangler.toml
[triggers]
crons = ["0 9 * * *"]
```

Check cron logs in the Cloudflare dashboard:
- Go to Workers & Pages → friends-radar-api → Triggers → Cron Triggers

---

## Database Schema

```sql
CREATE TABLE telegram_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chatId TEXT NOT NULL UNIQUE,      -- Telegram chat ID
  userId TEXT,                       -- Friends Radar user ID (Google sub)
  username TEXT,                     -- Telegram username
  firstName TEXT,                    -- Telegram first name
  isActive INTEGER DEFAULT 1,        -- 1 = active, 0 = paused
  notifyTime TEXT DEFAULT '09:00',   -- Notification time (future use)
  timezone TEXT DEFAULT 'Europe/Berlin', -- User timezone (future use)
  createdAt INTEGER,
  updatedAt INTEGER
);
```

---

## API Endpoints

### Telegram Webhook
`POST /telegram/webhook`
- Receives updates from Telegram
- No authentication (path should be secret in production)

### Link Account
`POST /api/telegram/link`
- Links Telegram chat to Friends Radar user
- Requires Bearer token authentication
- Body: `{ "chatId": "123456789" }`

### Get Status
`GET /api/telegram/status`
- Checks if user has linked Telegram account
- Requires Bearer token authentication

### Unlink Account
`POST /api/telegram/unlink`
- Removes Telegram link from user account
- Requires Bearer token authentication

---

## How Daily Notifications Work

1. **Cron trigger** fires at 9:00 AM UTC daily
2. **Worker** fetches all active subscriptions with linked accounts
3. For each subscription:
   - Query overdue friends (lastContact > 21 days ago)
   - If any overdue, send Telegram message
4. **Message format**:
   ```
   ⚠️ Daily Reminder
   
   3 friends need your attention:
   Alice, Bob, Charlie
   
   Open Friends Radar to reach out!
   ```

---

## Troubleshooting

### Bot not responding
1. Check webhook is set correctly
2. Verify TELEGRAM_BOT_TOKEN secret is configured
3. Check worker logs: `wrangler tail`

### Not receiving daily notifications
1. Verify account is linked: `/status` in Telegram
2. Check subscription is active (not /stop'd)
3. Verify cron is running in Cloudflare dashboard

### Link code not working
1. Ensure you're logged into Friends Radar (not guest mode)
2. Copy the full link code (it's your user ID)
3. Make sure you've sent `/start` first

---

## Security Considerations

- Webhook URL should ideally include a secret path
- Bot token must be kept secret (use wrangler secret)
- User IDs are used as link codes (consider temporary codes for production)
- JWT verification should be implemented for production use

---

## Future Improvements

- [ ] Customizable notification time per user
- [ ] Timezone support
- [ ] Weekly summary option
- [ ] Inline buttons to mark friends as contacted
- [ ] Temporary link codes (instead of raw user IDs)
