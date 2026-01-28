# Feature: Friends Radar - Core Functionality

## Visual Reference

![Friends Radar Mockup](./assets/friends-radar-mockup.png)

*The UI shows friend tiles as traffic-light style indicators - green (recently contacted), yellow (some time passed), red (contact overdue)*

---

## Jobs to be Done (JTBD)

**When** I want to maintain my friendships and not lose touch with people I care about,  
**I want to** see a visual overview of all my friends with color-coded contact urgency,  
**So I can** quickly identify who I haven't contacted in a while and reach out to them.

---

## User Stories

### US-1: Add Friends
As a user, I want to add friends by their first name so that I can track when I last contacted them.

### US-2: Persist Friends List
As a user, I want my friends list to be saved locally so that it persists between browser sessions.

### US-3: View Friends as Tiles
As a user, I want to see my friends displayed as tiles/buttons with their names so I can get a quick overview.

### US-4: Color-Coded Contact Indicator
As a user, I want each friend tile to show a color indicator (green → yellow → red) based on how long since I last contacted them, so I can see at a glance who needs attention.

### US-5: Record Contact
As a user, I want to click/tap a friend tile to record that I've contacted them, resetting their indicator to green.

---

## Acceptance Criteria

### Data Model
- [ ] Friend has: `id`, `name` (string), `lastContact` (timestamp)
- [ ] Friends list persists in localStorage
- [ ] New friends start with `lastContact` = current time (green)

### UI Requirements
- [ ] Grid/tile layout displaying all friends
- [ ] Each tile shows:
  - Friend's first name
  - Circular color indicator (traffic light style)
- [ ] Responsive layout (works on mobile and desktop)
- [ ] Ability to add new friends (input + button or modal)

### Color Logic
- [ ] **Green**: Contacted within last 7 days
- [ ] **Yellow**: Contacted 7-21 days ago  
- [ ] **Red**: Not contacted for 21+ days
- [ ] Colors should transition smoothly (CSS gradient or stepped)

### Interactions
- [ ] Click tile → Record contact (reset to green)
- [ ] Add friend → Creates new tile (starts green)
- [ ] Optional: Long-press/right-click to delete friend

---

## Technical Notes

### Data Persistence
```typescript
interface Friend {
  id: string;
  name: string;
  lastContact: number; // Unix timestamp
}

// Store in localStorage as JSON
localStorage.setItem('friends', JSON.stringify(friends));
```

### Color Calculation
```typescript
function getContactColor(lastContact: number): 'green' | 'yellow' | 'red' {
  const daysSinceContact = (Date.now() - lastContact) / (1000 * 60 * 60 * 24);
  if (daysSinceContact <= 7) return 'green';
  if (daysSinceContact <= 21) return 'yellow';
  return 'red';
}
```

### Suggested Components
- `FriendTile.vue` - Single friend tile with indicator
- `FriendsGrid.vue` - Grid container for all tiles
- `AddFriendForm.vue` - Form to add new friends
- `useFriends.ts` - Composable for friends state & persistence

---

## Out of Scope (Future Features)
- User authentication / cloud sync
- Contact history / notes
- Reminder notifications
- Multiple contact frequency settings per friend
- Friend groups/categories
- Import contacts from phone

---

## Design Notes

Based on the mockup:
- Clean, minimal interface
- Tiles arranged in a grid (4 columns on desktop, 2 on mobile)
- Large, tappable circular indicators
- Name displayed below indicator
- Browser-style title bar shown in mockup (just app chrome, not part of our UI)
