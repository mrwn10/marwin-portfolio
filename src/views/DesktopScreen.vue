<template>
  <div class="desktop-container">
    <!-- Desktop Background -->
    <div 
      class="desktop-background"
      :style="{ backgroundImage: `url(${require('@/assets/img/desktop.jpg')})` }"
    ></div>
    
    <!-- Sleep/Shutdown Mode Overlay -->
    <div 
      v-if="isSleeping || isShuttingDown"
      class="fixed inset-0 bg-black z-30 flex items-center justify-center"
      style="transition: background-color 0.3s ease;"
    >
      <div class="text-center animate-pulse">
        <div class="text-white/50 text-sm mb-2">
          {{ isShuttingDown ? 'Computer is off' : 'Screen is sleeping' }}
        </div>
        <div class="text-white/30 text-xs">
          {{ isShuttingDown ? 'Press Space or P to turn on' : 'Press Space or P to wake up' }}
        </div>
      </div>
    </div>
    
    <!-- Dark Fade Overlay -->
    <transition name="fade-dark">
      <div class="dark-overlay" v-if="showOverlay && !isSleeping && !isShuttingDown"></div>
    </transition>
    
    <!-- Desktop Icons -->
    <transition name="fade-in-slow">
      <div class="desktop-icons" v-if="!showOverlay && !isSleeping && !isShuttingDown">
        <div class="desktop-icon">
          <img src="@/assets/img/recycle.png" alt="Recycle Bin" class="icon-image" />
          <span class="icon-label">Recycle Bin</span>
        </div>
      </div>
    </transition>
    
    <!-- Start Menu -->
    <transition name="start-menu-slide">
      <div class="start-menu" v-if="showStartMenu && !showOverlay && !isSleeping && !isShuttingDown">
        <div class="start-menu-content">
          <!-- Column 1: Icons Only -->
          <div class="start-menu-column icons-column">
            <div class="icon-item hamburger-item">
              <svg class="hamburger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div class="icon-group">
              <div class="icon-item" @click="toggleProfileMenu">
                <img src="@/assets/img/profile.jpeg" alt="Profile" class="column-icon-img profile-img" />
              </div>
              <div class="icon-item power-icon-container" @click="togglePowerMenu">
                <img src="@/assets/img/power.png" alt="Power" class="column-icon-img power-icon" />
              </div>
            </div>
          </div>
          
          <!-- Column 2: Dynamic Content -->
          <transition name="slide-column">
            <div class="start-menu-column dynamic-column" v-if="showPowerMenu || showProfileMenu">
              <!-- Power Options -->
              <div v-if="showPowerMenu" class="dynamic-content power-content">
                <div class="column-title">Power Options</div>
                <div class="power-options-list">
                  <div class="power-option-item" @click="handleLock">
                    <svg class="power-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span class="power-option-label">Lock</span>
                  </div>
                  <div class="power-option-item" @click="handleSleep">
                    <svg class="power-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <span class="power-option-label">Sleep</span>
                  </div>
                  <div class="power-option-item" @click="handleShutdown">
                    <img src="@/assets/img/power.png" alt="Shutdown" class="power-option-icon" />
                    <span class="power-option-label">Shutdown</span>
                  </div>
                  <div class="power-option-item" @click="handleRestart">
                    <svg class="power-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span class="power-option-label">Restart</span>
                  </div>
                </div>
              </div>
              
              <!-- Profile Info -->
              <div v-if="showProfileMenu" class="dynamic-content profile-content">
                <div class="column-title">Profile</div>
                <div class="profile-info">
                  <div class="profile-name">Marwin Dalin</div>
                  <div class="profile-role">Developer</div>
                </div>
              </div>
            </div>
          </transition>
          
          <!-- Column 3: Portfolio Navigation (FILTERABLE) -->
          <div class="start-menu-column nav-column" :class="{ 'shifted': showPowerMenu || showProfileMenu }">
            <div class="column-title">Navigation</div>
            <div class="nav-list">
              <template v-if="hasSearchResults">
                <div 
                  v-for="item in filteredNavItems" 
                  :key="item.name"
                  class="nav-item"
                >
                  <span class="nav-name">{{ item.name }}</span>
                </div>
              </template>
              <div v-else class="no-results">
                No results found for "{{ searchQuery }}"
              </div>
            </div>
          </div>
          
          <!-- Column 4: Discover -->
          <div class="start-menu-column images-column" :class="{ 'shifted': showPowerMenu || showProfileMenu }">
            <div class="column-title">Discover</div>
            <div class="images-grid">
              <div 
                v-for="(image, index) in discoverImages" 
                :key="index"
                class="image-placeholder"
                :class="{ 'animate-image': animatedImages.includes(index) }"
              >
                <img v-if="image.type === 'image'" :src="image.src" :alt="image.alt" class="responsive-image" />
                <svg v-else class="responsive-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Taskbar -->
    <transition name="fade-in-slow">
      <div class="taskbar" v-if="!showOverlay && !isSleeping && !isShuttingDown">
        <div class="taskbar-left">
          <div class="start-button" @click="toggleStartMenu">
            <img src="@/assets/img/windows.png" alt="Windows" class="windows-icon" />
          </div>
          
          <div class="search-bar">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <div class="search-input-wrapper">
              <input 
                ref="searchInput"
                type="text" 
                class="search-input" 
                v-model="searchQuery"
                @input="handleSearchInput"
                @focus="handleInputFocus"
                @keydown.esc="handleEscapeKey"
              />
              <div 
                class="search-placeholder" 
                @click="handlePlaceholderClick"
                v-show="!searchQuery"
              >
                Type here to search
              </div>
            </div>
          </div>
          
          <!-- Task View Button - Now on LEFT side (swapped position) -->
          <div class="taskview-icon-button" @click="handleTaskViewClick">
            <svg class="taskview-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            </svg>
          </div>
          
          <!-- Chrome Icon - Now on LEFT side next to Task View (swapped position) -->
          <div class="chrome-icon-button" @click="handleChromeClick">
            <img src="@/assets/img/chrome.png" alt="Chrome" class="chrome-icon" />
          </div>
        </div>
        
        <div class="taskbar-right">
          <div class="arrow-icon-button" @click="handleArrowClick">
            <svg class="arrow-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5 L5 12 M12 5 L19 12"/>
            </svg>
          </div>
          
          <div class="battery-icon-button" @click="handleBatteryClick">
            <div class="battery-icon">
              <div class="battery-body"></div>
              <div class="battery-charge"></div>
              <div class="battery-terminal"></div>
            </div>
          </div>
          
          <div class="wifi-icon-button" @click="handleWifiClick">
            <img src="@/assets/img/wifii.png" alt="WiFi" class="wifi-icon" />
          </div>
          
          <div class="speaker-icon-button" @click="handleSpeakerClick">
            <svg class="speaker-svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3z"/>
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" opacity="0.7"/>
              <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" opacity="0.5"/>
            </svg>
          </div>
          
          <div class="datetime-container">
            <div class="taskbar-time">{{ currentTime }}</div>
            <div class="taskbar-date">{{ currentDate }}</div>
          </div>
          <div class="corner-bar"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'DesktopScreen',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      currentTime: '',
      currentDate: '',
      showOverlay: true,
      showStartMenu: false,
      searchQuery: '',
      showPowerMenu: false,
      showProfileMenu: false,
      isSleeping: false,
      isShuttingDown: false,
      navigationItems: [
        { name: 'Projects', visible: true },
        { name: 'Services', visible: true },
        { name: 'About Me', visible: true },
        { name: 'Contact', visible: true },
        { name: 'Blog', visible: true },
        { name: 'Testimonials', visible: true }
      ],
      discoverImages: [
        { type: 'image', src: require('@/assets/img/wally.png'), alt: 'Wally' },
        { type: 'image', src: require('@/assets/img/1.jpg'), alt: 'Image 1' },
        { type: 'image', src: require('@/assets/img/2.jpg'), alt: 'Image 2' },
        { type: 'image', src: require('@/assets/img/3.jpg'), alt: 'Image 3' },
        { type: 'image', src: require('@/assets/img/4.jpg'), alt: 'Image 4' },
        { type: 'image', src: require('@/assets/img/5.jpg'), alt: 'Image 5' }
      ],
      animatedImages: [],
      animationInterval: null
    }
  },
  computed: {
    filteredNavItems() {
      if (!this.searchQuery.trim()) {
        return this.navigationItems
      }
      const query = this.searchQuery.toLowerCase().trim()
      return this.navigationItems.filter(item => 
        item.name.toLowerCase().includes(query)
      )
    },
    hasSearchResults() {
      if (!this.searchQuery.trim()) return true
      return this.filteredNavItems.length > 0
    }
  },
  mounted() {
    this.updateDateTime()
    this.timeInterval = setInterval(this.updateDateTime, 1000)
    setTimeout(() => { this.showOverlay = false }, 500)
    document.addEventListener('click', this.closeStartMenu)
    window.addEventListener('keydown', this.handleWakeKey)
    this.startImageAnimations()
  },
  beforeUnmount() {
    if (this.timeInterval) clearInterval(this.timeInterval)
    if (this.animationInterval) clearInterval(this.animationInterval)
    document.removeEventListener('click', this.closeStartMenu)
    window.removeEventListener('keydown', this.handleWakeKey)
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      if (hours === 0) hours = 12
      const minutesStr = minutes < 10 ? '0' + minutes : minutes
      this.currentTime = `${hours}:${minutesStr} ${ampm}`
      const day = now.getDate()
      const month = now.getMonth() + 1
      const year = now.getFullYear()
      const dayStr = day < 10 ? '0' + day : day
      const monthStr = month < 10 ? '0' + month : month
      this.currentDate = `${dayStr}/${monthStr}/${year}`
    },
    toggleStartMenu(event) {
      if (event) event.stopPropagation()
      this.showStartMenu = !this.showStartMenu
      if (!this.showStartMenu) {
        this.showPowerMenu = false
        this.showProfileMenu = false
        this.searchQuery = ''
      }
    },
    closeStartMenu(event) {
      if (this.showStartMenu && 
          !event.target.closest('.start-menu') && 
          !event.target.closest('.start-button') &&
          !event.target.closest('.search-placeholder') &&
          !event.target.closest('.search-input')) {
        this.showStartMenu = false
        this.showPowerMenu = false
        this.showProfileMenu = false
        this.searchQuery = ''
      }
    },
    handlePlaceholderClick() {
      if (!this.showStartMenu) this.showStartMenu = true
      this.$nextTick(() => {
        if (this.$refs.searchInput) this.$refs.searchInput.focus()
      })
    },
    handleInputFocus() {},
    handleSearchInput() {
      if (!this.showStartMenu && this.searchQuery) this.showStartMenu = true
    },
    handleEscapeKey() {
      this.searchQuery = ''
      this.showStartMenu = false
      if (this.$refs.searchInput) this.$refs.searchInput.blur()
    },
    handleChromeClick() { window.open('https://www.google.com', '_blank') },
    handleTaskViewClick() { /* Task view functionality - can be extended */ },
    handleSpeakerClick() {},
    handleWifiClick() {},
    handleBatteryClick() {},
    handleArrowClick() {},
    togglePowerMenu(event) {
      if (event) event.stopPropagation()
      this.showProfileMenu = false
      this.showPowerMenu = !this.showPowerMenu
    },
    toggleProfileMenu(event) {
      if (event) event.stopPropagation()
      this.showPowerMenu = false
      this.showProfileMenu = !this.showProfileMenu
    },
    handleLock() {
      this.showPowerMenu = false
      this.showProfileMenu = false
      this.showStartMenu = false
      this.router.push('/lock')
    },
    handleShutdown() {
      this.showPowerMenu = false
      this.showProfileMenu = false
      this.showStartMenu = false
      this.isShuttingDown = true
    },
    handleRestart() {
      this.showPowerMenu = false
      this.showProfileMenu = false
      this.showStartMenu = false
      this.router.push('/restart')
    },
    handleSleep() {
      this.showPowerMenu = false
      this.showProfileMenu = false
      this.showStartMenu = false
      this.isSleeping = true
    },
    handleWakeKey(event) {
      if (this.isSleeping && (event.code === 'Space' || event.code === 'KeyP')) {
        event.preventDefault()
        window.location.reload()
      } else if (this.isShuttingDown && (event.code === 'Space' || event.code === 'KeyP')) {
        event.preventDefault()
        this.router.push('/')
      }
    },
    startImageAnimations() {
      this.animationInterval = setInterval(() => {
        if (this.showStartMenu) this.animateRandomImages()
      }, this.getRandomInterval(3000, 4000))
    },
    getRandomInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    animateRandomImages() {
      this.animatedImages = []
      const numberOfImagesToAnimate = Math.random() > 0.6 ? 2 : 1
      const totalImages = this.discoverImages.length
      const selectedIndices = new Set()
      while (selectedIndices.size < numberOfImagesToAnimate) {
        selectedIndices.add(Math.floor(Math.random() * totalImages))
      }
      this.animatedImages = Array.from(selectedIndices)
      setTimeout(() => { this.animatedImages = [] }, 600)
      if (this.animationInterval) {
        clearInterval(this.animationInterval)
        this.animationInterval = setInterval(() => {
          if (this.showStartMenu) this.animateRandomImages()
        }, this.getRandomInterval(3000, 4000))
      }
    }
  }
}
</script>

<style scoped>
.desktop-container {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.desktop-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.dark-overlay {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 50;
}

.fade-dark-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-dark-leave-to {
  opacity: 0;
}

.fade-in-slow-enter-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}
.fade-in-slow-enter-from {
  opacity: 0;
}

.desktop-icons {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 8px 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 8px;
}

.icon-label {
  color: white;
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  background: transparent;
  padding: 2px 4px;
}

.start-menu {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: auto;
  min-width: 600px;
  max-width: calc(100% - 20px);
  height: 500px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 0;
  border-top: none;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 20;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.start-menu-slide-enter-active {
  transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.3s ease;
}
.start-menu-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.start-menu-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.start-menu-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.start-menu-content {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex: 1;
}

.start-menu-column {
  padding: 16px 12px;
  overflow-y: auto;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.start-menu-column::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.icons-column {
  width: 60px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 12px;
  flex-shrink: 0;
}

.icon-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 0;
}

.icon-item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  border-radius: 6px;
}

.icon-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.hamburger-item {
  align-self: flex-start;
}

.hamburger-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.column-icon-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.power-icon {
  filter: brightness(0) invert(1);
}

.profile-img {
  border-radius: 50%;
  object-fit: cover;
  filter: none;
}

.dynamic-column {
  width: 200px;
  background: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  overflow: hidden;
}

.dynamic-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: slideInFromLeft 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

@keyframes slideInFromLeft {
  0% { opacity: 0; transform: translateX(-25px); }
  100% { opacity: 1; transform: translateX(0); }
}

.power-content {
  height: 100%;
}

.power-options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 0;
  padding-bottom: 0;
}

.power-option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  border-radius: 6px;
  color: white;
}

.power-option-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.power-option-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.power-option-label {
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
}

.profile-content {
  height: 100%;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 0;
  padding-bottom: 0;
  width: 100%;
}

.profile-name {
  color: white;
  font-size: 15px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 600;
  text-align: left;
  letter-spacing: 0.3px;
  padding: 10px 12px;
}

.profile-role {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  text-align: left;
  padding: 0 12px 10px 12px;
}

.nav-column {
  width: 200px;
  background: rgba(0, 0, 0, 0.15);
  padding: 16px 12px;
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  flex-shrink: 0;
}

.column-title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  border-radius: 4px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-name {
  color: white;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
}

/* No results message styling */
.no-results {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  text-align: center;
  padding: 20px 12px;
  font-style: italic;
}

/* ── Discover / images column ── */
.images-column {
  flex: 1;
  min-width: 180px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  padding: 16px 12px;
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  overflow-y: auto;
}

/* Fixed 2-column grid — images always wrap downward */
.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

/* Fixed height cells so images fill the column vertically */
.image-placeholder {
  aspect-ratio: unset;
  height: 142px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  overflow: hidden;
  width: 100%;
  position: relative;
}

.image-placeholder:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.02);
}

.image-placeholder.animate-image {
  animation: coolGlow 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

@keyframes coolGlow {
  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(255,255,255,0);     background: rgba(255,255,255,0.05); }
  30%  { transform: scale(1.05); box-shadow: 0 0 20px 5px rgba(0,120,212,0.6); background: rgba(0,120,212,0.2); }
  70%  { transform: scale(1.02); box-shadow: 0 0 15px 3px rgba(0,120,212,0.4); background: rgba(0,120,212,0.15); }
  100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(255,255,255,0);     background: rgba(255,255,255,0.05); }
}

.responsive-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.responsive-icon {
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.5);
}

/* Taller cells on large screens */
@media (min-width: 1400px) {
  .image-placeholder { height: 170px; }
}

/* Slide column animation */
.slide-column-enter-active {
  animation: slideColumnIn 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}
.slide-column-leave-active {
  animation: slideColumnOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideColumnIn {
  0%   { opacity: 0; transform: translateX(-30px); width: 0; }
  100% { opacity: 1; transform: translateX(0);     width: 200px; }
}
@keyframes slideColumnOut {
  0%   { opacity: 1; transform: translateX(0);     width: 200px; }
  100% { opacity: 0; transform: translateX(-30px); width: 0; padding: 0; }
}

/* Taskbar */
.taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border-top: none;
  z-index: 10;
}

.taskbar-left {
  display: flex;
  align-items: stretch;
  height: 100%;
}

.taskbar-right {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  gap: 2px;
}

.start-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.start-button:hover {
  background: rgba(0, 120, 212, 0.3);
}

.start-button:hover .windows-icon {
  filter: brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(7484%) hue-rotate(200deg) brightness(94%) contrast(104%);
}

.windows-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  transition: filter 0.2s ease;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 0 12px;
  height: 100%;
  transition: all 0.2s ease;
  min-width: 280px;
  border-radius: 0;
  margin: 0;
  border: none;
}

.search-bar:hover { background: #f0f0f0; }

.search-bar:focus-within {
  background: white;
  box-shadow: inset 0 0 0 1px rgba(0, 120, 212, 0.5);
}

.search-icon {
  width: 16px;
  height: 16px;
  color: #666;
  flex-shrink: 0;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  padding: 0;
  margin: 0;
}

.search-placeholder {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  color: #666;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
}

.search-placeholder:hover { color: #333; }

/* Chrome icon - Left side (swapped position) */
.chrome-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.chrome-icon-button:hover { background: rgba(255, 255, 255, 0.1); }

.chrome-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* Task View Button - RESIZED (smaller) with increased side padding */
.taskview-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
  position: relative;
}

.taskview-icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.taskview-svg-icon {
  width: 20px;
  height: 20px;
  color: white;
  opacity: 0.9;
}

.arrow-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.arrow-icon-button:hover { background: rgba(255, 255, 255, 0.1); }

.arrow-svg-icon {
  width: 18px;
  height: 18px;
  color: white;
  opacity: 0.9;
}

.battery-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.battery-icon-button:hover { background: rgba(255, 255, 255, 0.1); }

.battery-icon {
  position: relative;
  width: 20px;
  height: 12px;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
}

.battery-body {
  width: 16px;
  height: 10px;
  border: 1px solid white;
  border-radius: 2px;
  background: transparent;
  position: relative;
}

.battery-charge {
  position: absolute;
  left: 1px; top: 1px; bottom: 1px;
  width: 12px;
  background: white;
  border-radius: 1px;
}

.battery-terminal {
  position: absolute;
  right: 1px;
  width: 2px;
  height: 5px;
  background: white;
  border-radius: 1px;
  top: 50%;
  transform: translateY(-50%);
}

.wifi-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.wifi-icon-button:hover { background: rgba(255, 255, 255, 0.1); }

.wifi-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  opacity: 0.9;
}

.speaker-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.speaker-icon-button:hover { background: rgba(255, 255, 255, 0.1); }

.speaker-svg-icon {
  width: 16px;
  height: 16px;
  color: white;
  opacity: 0.9;
}

.datetime-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: 4px 12px;
  margin-right: 8px;
  cursor: default;
}

.taskbar-time {
  color: white;
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.3;
  transition: opacity 0.2s ease;
  font-weight: 500;
}

.taskbar-date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.3;
  transition: opacity 0.2s ease;
}

.datetime-container:hover .taskbar-time,
.datetime-container:hover .taskbar-date {
  opacity: 0.7;
}

.corner-bar {
  position: absolute;
  bottom: 0; right: 0;
  width: 12px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  cursor: default;
  z-index: 0;
  transition: background 0.2s ease;
}

.corner-bar:hover { background: rgba(0, 120, 212, 0.15); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  .start-menu { min-width: 90%; max-width: 95%; }
  .nav-column { width: 160px; }
  .dynamic-column { width: 160px; }
  .image-placeholder { height: 110px; }

  @keyframes slideColumnIn {
    0%   { opacity: 0; transform: translateX(-30px); width: 0; }
    100% { opacity: 1; transform: translateX(0);     width: 160px; }
  }
  @keyframes slideColumnOut {
    0%   { opacity: 1; transform: translateX(0);     width: 160px; }
    100% { opacity: 0; transform: translateX(-30px); width: 0; padding: 0; }
  }
}

@media (max-width: 480px) {
  .image-placeholder { height: 90px; }
  .profile-name { font-size: 13px; padding: 8px 10px; }
  .profile-role { font-size: 11px; padding: 0 10px 8px 10px; }
}
</style>