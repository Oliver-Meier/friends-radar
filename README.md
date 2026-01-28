# Friends Radar 🎯

A Vue.js app that helps you track when you last contacted your friends using a simple traffic light system. Never lose touch with the people who matter most!

![Friends Radar Demo](https://img.shields.io/badge/status-active-success.svg)
[![CI/CD](https://github.com/Oliver-Meier/friends-radar/actions/workflows/ci.yml/badge.svg)](https://github.com/Oliver-Meier/friends-radar/actions/workflows/ci.yml)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![Tests](https://img.shields.io/badge/tests-33%20passing-brightgreen)

🚀 **[Live Demo](https://oliver-meier.github.io/friends-radar/)**

## 🌟 Overview

Friends Radar is a minimalist web application that visualizes your social connections as colored indicators. Each friend is represented by a circular tile that changes color based on how long it's been since you last contacted them:

- 🟢 **Green** (0-7 days): Recently contacted
- 🟡 **Yellow** (7-21 days): Getting stale
- 🔴 **Red** (21+ days): Time to reach out!

Click on a friend's tile to record a new contact, and watch their indicator turn green. All data persists locally in your browser.

## ✨ Features

- **Visual Contact Tracking**: Intuitive traffic light color system
- **One-Click Updates**: Tap a friend to record contact instantly
- **Persistent Storage**: All data saved locally with localStorage
- **Responsive Design**: Works on desktop (4 columns) and mobile (2 columns)
- **Real-Time Updates**: Watch colors change as time passes
- **Zero Configuration**: No accounts, no servers, just open and use
- **Privacy First**: All data stays on your device
- **📱 PWA Support**: Install as a native app on your phone or desktop
- **🔔 Smart Notifications**: Get notified when friends are due for contact
- **🎨 Custom Icon**: Beautiful radar-themed icon with traffic light indicators

## 🚀 Tech Stack

- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)** - Modern Vue development pattern
- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** - Progressive Web App support
- **[Workbox](https://developers.google.com/web/tools/workbox)** - Service worker generation
- **CSS Grid** - Responsive layout
- **localStorage** - Client-side persistence
- **Web Notifications API** - Push notifications for overdue contacts

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher
- npm (comes with Node.js)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Oliver-Meier/friends-radar.git
   cd friends-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🎮 Usage

### Installing as PWA

Friends Radar can be installed as a Progressive Web App on your device:

**On Desktop (Chrome/Edge/Brave):**
1. Open the app in your browser
2. Look for the install icon in the address bar (⊕ or install button)
3. Click "Install" to add it to your desktop

**On iOS (Safari):**
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name it and tap "Add"

**On Android (Chrome):**
1. Open the app in Chrome
2. Tap the three-dot menu
3. Select "Install app" or "Add to Home Screen"

### Enabling Notifications

When you first open the app, you'll see a banner to enable notifications:

1. Click the "Enable Notifications" button
2. Allow notifications in your browser prompt
3. You'll get notified when friends haven't been contacted for 21+ seconds (or days in production)

**Note**: Notifications work best when the app is installed as a PWA.

### Adding Friends

Currently in demo mode with 25 pre-loaded friends. Full "Add Friend" functionality coming in US-006.

### Recording Contact

1. Click on any friend's tile
2. Their `lastContact` timestamp updates to now
3. The color indicator turns green
4. Watch it transition to yellow (after 7 seconds in demo mode) and red (after 21 seconds)

### Reset Demo

Click the "Reset Demo" button to clear localStorage and reload 25 friends with varied contact times.

### Testing Color Transitions

The demo uses **seconds** instead of days for easy testing:
- Green: 0-7 seconds since contact
- Yellow: 7-21 seconds since contact
- Red: 21+ seconds since contact

In production, these will be changed to days.

## 📁 Project Structure

```
friends-radar/
├── src/
│   ├── components/          # Vue components
│   │   ├── FriendTile.vue   # Individual friend tile with color indicator
│   │   └── FriendsGrid.vue  # Grid container for friend tiles
│   ├── composables/         # Vue composables (state management)
│   │   └── useFriends.ts    # Friends state and CRUD operations
│   ├── types/               # TypeScript type definitions
│   │   └── Friend.ts        # Friend interface
│   ├── utils/               # Utility functions
│   │   └── colorUtils.ts    # Color calculation logic
│   ├── assets/              # Static assets
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry point
├── public/                  # Public static files
├── specs/                   # Feature specifications
├── prd.json                 # Product requirements (user stories)
├── progress.txt             # Development iteration log
├── RALPH.md                 # Ralph Loops methodology documentation
├── AGENTS.md                # AI agent instructions
└── package.json             # Dependencies and scripts
```

## 🏗️ Development Methodology

This project is built using **[Ralph Loops](https://ghuntley.com/ralph/)** - an autonomous AI coding technique where an AI agent iteratively implements user stories until completion.

### Key Files

- **`prd.json`**: Contains all user stories with pass/fail status
- **`progress.txt`**: Append-only log of learnings from each iteration
- **`RALPH.md`**: Full methodology documentation
- **`AGENTS.md`**: Project-specific context for AI agents

### User Stories Status

- ✅ US-001: Friend data model and types
- ✅ US-002: localStorage persistence
- ✅ US-003: Color calculation utility
- ✅ US-004: FriendTile component
- ✅ US-005: FriendsGrid component
- ⏳ US-006: AddFriendForm component (next)
- ⏳ US-007: Full App.vue integration
- ⏳ US-008: Delete friend functionality
- ⏳ US-009: Polish styling and UX

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Run tests (required before build)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Build for production (runs tests first, then type checks, then builds)
npm run build

# Preview production build
npm run preview
```

**Important**: The build process now requires all tests to pass before proceeding. See [TESTING.md](TESTING.md) for details.

## 🎨 Customization

### Changing Color Thresholds

Edit `src/utils/colorUtils.ts`:

```typescript
// Current (testing - seconds)
const GREEN_THRESHOLD_SECONDS = 7
const YELLOW_THRESHOLD_SECONDS = 21

// Production (days)
const GREEN_THRESHOLD_DAYS = 7
const YELLOW_THRESHOLD_DAYS = 21
```

### Adjusting Grid Layout

Edit `src/components/FriendsGrid.vue`:

```css
.friends-grid {
  grid-template-columns: repeat(4, 1fr); /* Desktop */
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: repeat(2, 1fr); /* Mobile */
  }
}
```

### Styling Friend Tiles

Edit `src/components/FriendTile.vue` to customize:
- Indicator size (currently 80px)
- Colors (green: #4caf50, yellow: #ffc107, red: #f44336)
- Glow effects
- Hover animations

## 🗺️ Roadmap

### Coming Soon (In Progress)

- [ ] Add Friend form component
- [ ] Delete friend functionality
- [ ] Edit friend names
- [ ] Sort friends by contact time
- [ ] Filter by color status

### Future Ideas

- [ ] Categories/tags for friends
- [ ] Notes on each friend
- [ ] Contact history/timeline
- [ ] Reminders/notifications
- [ ] Export/import data
- [ ] Dark mode
- [ ] Multiple profiles
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! This project follows the Ralph Loops methodology.

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Run `npm run build` before committing
   - Follow existing code style
   - Update `progress.txt` with learnings
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Always run `npm run build` before committing (ensures TypeScript compiles)
- Keep components small and focused
- Use TypeScript strict mode
- Follow Vue 3 Composition API patterns
- Document learnings in `progress.txt`

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with [Ralph Loops](https://ghuntley.com/ralph/) methodology by Geoffrey Huntley
- Inspired by the need to maintain meaningful friendships in a busy world
- Color psychology: traffic light system for intuitive understanding

## 📧 Contact

Oliver Meier - [@Oliver-Meier](https://github.com/Oliver-Meier)

Project Link: [https://github.com/Oliver-Meier/friends-radar](https://github.com/Oliver-Meier/friends-radar)

---

**Made with ❤️ and Vue.js** | **Never lose touch with your friends again!**
