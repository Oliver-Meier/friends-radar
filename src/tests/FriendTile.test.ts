import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import FriendTile from '../components/FriendTile.vue'
import type { Friend } from '../types/Friend'

// Minimal i18n for tests – no file path resolution (works on Render/CI)
const testI18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { friend: { delete: 'Delete' } } }
})
const mountOptions = { global: { plugins: [testI18n] } }

describe('FriendTile', () => {
  const createFriend = (overrides = {}): Friend => ({
    id: '1',
    name: 'Alice',
    lastContact: Date.now(),
    ...overrides
  })

  beforeEach(() => {
    vi.useRealTimers()
  })

  it('renders friend name', () => {
    const friend = createFriend({ name: 'Bob' })
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    expect(wrapper.text()).toContain('Bob')
  })

  it('shows green indicator for recent contact', () => {
    const friend = createFriend({ lastContact: Date.now() })
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    const indicator = wrapper.find('.indicator')
    expect(indicator.classes()).toContain('green')
  })

  it('shows yellow indicator for contact 7-21 seconds ago', () => {
    const friend = createFriend({ lastContact: Date.now() - 10000 })
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    const indicator = wrapper.find('.indicator')
    expect(indicator.classes()).toContain('yellow')
  })

  it('shows red indicator for contact over 21 seconds ago', () => {
    const friend = createFriend({ lastContact: Date.now() - 25000 })
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    const indicator = wrapper.find('.indicator')
    expect(indicator.classes()).toContain('red')
  })

  it('emits contact event when clicked', async () => {
    const friend = createFriend()
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    await wrapper.find('.friend-tile').trigger('click')
    
    expect(wrapper.emitted('contact')).toBeTruthy()
    expect(wrapper.emitted('contact')?.[0]).toEqual(['1'])
  })

  it('emits delete event when delete button clicked', async () => {
    const friend = createFriend()
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    await wrapper.find('.delete-btn').trigger('click')
    
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual(['1'])
  })

  it('does not emit contact event when delete button clicked', async () => {
    const friend = createFriend()
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    await wrapper.find('.delete-btn').trigger('click')
    
    expect(wrapper.emitted('contact')).toBeFalsy()
  })

  it('has delete button', () => {
    const friend = createFriend()
    const wrapper = mount(FriendTile, { props: { friend }, ...mountOptions })
    
    const deleteBtn = wrapper.find('.delete-btn')
    expect(deleteBtn.exists()).toBe(true)
  })
})
