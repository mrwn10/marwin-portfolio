<template>
  <div class="desktop-container">
    <!-- Desktop Background -->
    <div
      class="desktop-background"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>

    <!-- Sleep/Shutdown Mode Overlay -->
    <div
      v-if="isSleeping || isShuttingDown"
      class="fixed inset-0 bg-black z-30 flex items-center justify-center"
      style="transition: background-color 0.3s ease; z-index: 9999;"
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

    <!-- Desktop Icons Component -->
    <DesktopIcon
      v-if="!showOverlay && !isSleeping && !isShuttingDown"
      :recycle-bin-icon="recycleBinIcon"
      :file-explorer-icon="fileExplorerIcon"
      :microsoft-store-icon="microsoftStoreIcon"
      :chrome-icon="chromeIcon"
      :ppt-icon="pptIcon"
      :word-icon="wordIcon"
      @file-explorer-click="handleFileExplorerClick"
      @microsoft-store-click="handleMicrosoftStoreClick"
      @recycle-bin-click="handleRecycleBinClick"
      @chrome-click="handleChromeClick"
      @ppt-click="handlePptClick"
      @word-click="handleWordClick"
    />

    <!-- App Windows - Lower z-index so they don't overlap start menu -->
    <div style="z-index: 10; position: relative;">
      <DesktopAppWindow
        :visible="showBlogModal"
        title="Blog"
        :initial-position="{ x: 100, y: 100 }"
        :initial-size="{ width: 900, height: 600 }"
        :taskbar-height="40"
        @close="closeBlogModal"
        @minimize="closeBlogModal"
      >
        <DesktopBlog />
      </DesktopAppWindow>

      <DesktopAppWindow
        :visible="showAboutModal"
        title="About Me"
        :initial-position="{ x: 120, y: 120 }"
        :initial-size="{ width: 800, height: 550 }"
        :taskbar-height="40"
        @close="closeAboutModal"
        @minimize="closeAboutModal"
      >
        <DesktopAboutMe />
      </DesktopAppWindow>

      <DesktopAppWindow
        :visible="showProjectsModal"
        title="Projects"
        :initial-position="{ x: 140, y: 140 }"
        :initial-size="{ width: 950, height: 600 }"
        :taskbar-height="40"
        @close="closeProjectsModal"
        @minimize="closeProjectsModal"
      >
        <DesktopProjects />
      </DesktopAppWindow>

      <DesktopAppWindow
        :visible="showServicesModal"
        title="Services"
        :initial-position="{ x: 160, y: 160 }"
        :initial-size="{ width: 850, height: 550 }"
        :taskbar-height="40"
        @close="closeServicesModal"
        @minimize="closeServicesModal"
      >
        <DesktopServices @navigate-contact="handleContactFromServices" />
      </DesktopAppWindow>

      <DesktopAppWindow
        :visible="showResumeModal"
        title="Resume"
        :initial-position="{ x: 180, y: 180 }"
        :initial-size="{ width: 850, height: 600 }"
        :taskbar-height="40"
        @close="closeResumeModal"
        @minimize="closeResumeModal"
      >
        <DesktopResume />
      </DesktopAppWindow>

      <DesktopAppWindow
        :visible="showContactModal"
        title="Contact"
        :initial-position="{ x: 200, y: 200 }"
        :initial-size="{ width: 750, height: 550 }"
        :taskbar-height="40"
        @close="closeContactModal"
        @minimize="closeContactModal"
      >
        <DesktopContact />
      </DesktopAppWindow>
    </div>

    <!-- Start Menu - High z-index to stay on top -->
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
                <img :src="profileImage" alt="Profile" class="column-icon-img profile-img" />
              </div>
              <div class="icon-item power-icon-container" @click="togglePowerMenu">
                <img :src="powerIcon" alt="Power" class="column-icon-img power-icon" />
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
                    <img :src="powerIcon" alt="Shutdown" class="power-option-icon" />
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
                  <div class="profile-name">{{ profileName }}</div>
                  <div class="profile-role">{{ profileRole }}</div>
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
                  @click="handleNavigationClick(item)"
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
                @click="handleImageClick(image)"
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

    <!-- Taskbar - Highest z-index to always stay on top -->
    <transition name="fade-in-slow">
      <div class="taskbar" v-if="!showOverlay && !isSleeping && !isShuttingDown">
        <div class="taskbar-left">
          <div class="start-button" @click="toggleStartMenu">
            <img :src="windowsIcon" alt="Windows" class="windows-icon" />
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

          <!-- Task View Button -->
          <div class="taskview-icon-button" @click="handleTaskViewClick">
            <svg class="taskview-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            </svg>
          </div>

          <!-- File Explorer - Opens Projects Modal -->
          <div class="chrome-icon-button" @click="openProjectsModal">
            <img :src="fileExplorerIcon" alt="File Explorer" class="chrome-icon" />
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
            <img :src="wifiIcon" alt="WiFi" class="wifi-icon" />
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
import DesktopIcon      from './DesktopIcon.vue'
import DesktopBlog      from './DesktopBlog.vue'
import DesktopAboutMe   from './DesktopAboutMe.vue'
import DesktopContact   from './DesktopContact.vue'
import DesktopProjects  from './DesktopProjects.vue'
import DesktopResume    from './DesktopResume.vue'
import DesktopServices  from './DesktopServices.vue'
import DesktopAppWindow from './DesktopAppWindow.vue'

export default {
  name: 'DesktopComp',

  components: {
    DesktopIcon,
    DesktopBlog,
    DesktopAboutMe,
    DesktopContact,
    DesktopProjects,
    DesktopResume,
    DesktopServices,
    DesktopAppWindow
  },

  props: {
    backgroundImage: {
      type: String,
      default: () => require('@/assets/img/desktop.jpg')
    },
    recycleBinIcon: {
      type: String,
      default: () => require('@/assets/img/recycle.png')
    },
    fileExplorerIcon: {
      type: String,
      default: () => require('@/assets/img/file.png')
    },
    microsoftStoreIcon: {
      type: String,
      default: () => require('@/assets/img/store.png')
    },
    chromeIcon: {
      type: String,
      default: () => require('@/assets/img/chrome.png')
    },
    pptIcon: {
      type: String,
      default: () => require('@/assets/img/ppt.png')
    },
    wordIcon: {
      type: String,
      default: () => require('@/assets/img/word.png')
    },
    profileImage: {
      type: String,
      default: () => require('@/assets/img/profile.jpeg')
    },
    powerIcon: {
      type: String,
      default: () => require('@/assets/img/power.png')
    },
    windowsIcon: {
      type: String,
      default: () => require('@/assets/img/windows.png')
    },
    wifiIcon: {
      type: String,
      default: () => require('@/assets/img/wifii.png')
    },
    profileName: {
      type: String,
      default: 'Marwin Dalin'
    },
    profileRole: {
      type: String,
      default: 'Developer'
    },
    navigationItems: {
      type: Array,
      default: () => [
        { name: 'Projects',  visible: true, route: null, isModal: true, modalType: 'projects' },
        { name: 'Services',  visible: true, route: null, isModal: true, modalType: 'services' },
        { name: 'About Me',  visible: true, route: null, isModal: true, modalType: 'about' },
        { name: 'Contact',   visible: true, route: null, isModal: true, modalType: 'contact' },
        { name: 'Blog',      visible: true, route: null, isModal: true, modalType: 'blog' },
        { name: 'Resume',    visible: true, route: null, isModal: true, modalType: 'resume' }
      ]
    },
    discoverImages: {
      type: Array,
      default: () => [
        { type: 'image', src: require('@/assets/img/wally.png'), alt: 'Wally' },
        { type: 'image', src: require('@/assets/img/1.jpg'),     alt: 'Image 1' },
        { type: 'image', src: require('@/assets/img/2.jpg'),     alt: 'Image 2' },
        { type: 'image', src: require('@/assets/img/3.jpg'),     alt: 'Image 3' },
        { type: 'image', src: require('@/assets/img/4.jpg'),     alt: 'Image 4' },
        { type: 'image', src: require('@/assets/img/5.jpg'),     alt: 'Image 5' }
      ]
    },
    autoHideOverlay: {
      type: Boolean,
      default: true
    },
    overlayDuration: {
      type: Number,
      default: 500
    },
    enableImageAnimations: {
      type: Boolean,
      default: true
    },
    lockRoute: {
      type: String,
      default: '/lock'
    },
    restartRoute: {
      type: String,
      default: '/restart'
    }
  },

  emits: [
    'navigate',
    'lock',
    'shutdown',
    'restart',
    'sleep',
    'wake',
    'taskview-click',
    'speaker-click',
    'wifi-click',
    'battery-click',
    'arrow-click',
    'image-click'
  ],

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
      animatedImages: [],
      animationInterval: null,
      internalNavigationItems: [...this.navigationItems],
      internalDiscoverImages:  [...this.discoverImages],
      // Modal states
      showBlogModal: false,
      showAboutModal: false,
      showProjectsModal: false,
      showServicesModal: false,
      showResumeModal: false,
      showContactModal: false
    }
  },

  computed: {
    filteredNavItems() {
      const items = this.internalNavigationItems.filter(i => i.visible !== false)
      if (!this.searchQuery.trim()) return items
      const q = this.searchQuery.toLowerCase().trim()
      return items.filter(i => i.name.toLowerCase().includes(q))
    },
    hasSearchResults() {
      if (!this.searchQuery.trim()) return true
      return this.filteredNavItems.length > 0
    }
  },

  watch: {
    navigationItems: {
      handler(val) { this.internalNavigationItems = [...val] },
      deep: true
    },
    discoverImages: {
      handler(val) { this.internalDiscoverImages = [...val] },
      deep: true
    }
  },

  mounted() {
    this.updateDateTime()
    this.timeInterval = setInterval(this.updateDateTime, 1000)

    if (this.autoHideOverlay) {
      setTimeout(() => { this.showOverlay = false }, this.overlayDuration)
    }

    document.addEventListener('click', this.closeStartMenu)
    window.addEventListener('keydown', this.handleWakeKey)

    if (this.enableImageAnimations) {
      this.startImageAnimations()
    }
  },

  beforeUnmount() {
    if (this.timeInterval)      clearInterval(this.timeInterval)
    if (this.animationInterval) clearInterval(this.animationInterval)
    document.removeEventListener('click', this.closeStartMenu)
    window.removeEventListener('keydown', this.handleWakeKey)
  },

  methods: {
    updateDateTime() {
      const now     = new Date()
      let hours     = now.getHours()
      const minutes = now.getMinutes()
      const ampm    = hours >= 12 ? 'PM' : 'AM'
      hours         = hours % 12 || 12
      const mm      = minutes < 10 ? '0' + minutes : minutes
      this.currentTime = `${hours}:${mm} ${ampm}`

      const d   = now.getDate()
      const mo  = now.getMonth() + 1
      const y   = now.getFullYear()
      this.currentDate = `${d < 10 ? '0' + d : d}/${mo < 10 ? '0' + mo : mo}/${y}`
    },

    toggleStartMenu(event) {
      if (event) event.stopPropagation()
      this.showStartMenu = !this.showStartMenu
      if (!this.showStartMenu) {
        this.showPowerMenu   = false
        this.showProfileMenu = false
        this.searchQuery     = ''
      }
    },

    closeStartMenu(event) {
      if (
        this.showStartMenu &&
        !event.target.closest('.start-menu') &&
        !event.target.closest('.start-button') &&
        !event.target.closest('.search-placeholder') &&
        !event.target.closest('.search-input')
      ) {
        this.showStartMenu   = false
        this.showPowerMenu   = false
        this.showProfileMenu = false
        this.searchQuery     = ''
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
      this.searchQuery   = ''
      this.showStartMenu = false
      if (this.$refs.searchInput) this.$refs.searchInput.blur()
    },

    handleChromeClick() {
      this.openContactModal()
    },

    handleTaskViewClick()  { this.$emit('taskview-click') },
    handleSpeakerClick()   { this.$emit('speaker-click') },
    handleWifiClick()      { this.$emit('wifi-click') },
    handleBatteryClick()   { this.$emit('battery-click') },
    handleArrowClick()     { this.$emit('arrow-click') },

    togglePowerMenu(event) {
      if (event) event.stopPropagation()
      this.showProfileMenu = false
      this.showPowerMenu   = !this.showPowerMenu
    },

    toggleProfileMenu(event) {
      if (event) event.stopPropagation()
      this.showPowerMenu   = false
      this.showProfileMenu = !this.showProfileMenu
    },

    handleNavigationClick(item) {
      this.showStartMenu = false
      this.$emit('navigate', item)

      if (item.isModal) {
        this.openModalByType(item.modalType)
      } else if (item.route && this.$router) {
        this.$router.push(item.route)
      }
    },

    openModalByType(type) {
      switch(type) {
        case 'blog':
          this.openBlogModal()
          break
        case 'about':
          this.openAboutModal()
          break
        case 'projects':
          this.openProjectsModal()
          break
        case 'services':
          this.openServicesModal()
          break
        case 'resume':
          this.openResumeModal()
          break
        case 'contact':
          this.openContactModal()
          break
        default:
          console.warn('Unknown modal type:', type)
      }
    },

    handleImageClick(image) {
      this.$emit('image-click', image)
    },

    handleLock() {
      this._closeMenus()
      this.$emit('lock')
      if (this.$router) this.$router.push(this.lockRoute)
    },

    handleShutdown() {
      this._closeMenus()
      this.isShuttingDown = true
      this.$emit('shutdown')
    },

    handleRestart() {
      this._closeMenus()
      this.$emit('restart')
      if (this.$router) this.$router.push(this.restartRoute)
    },

    handleSleep() {
      this._closeMenus()
      this.isSleeping = true
      this.$emit('sleep')
    },

    handleWakeKey(event) {
      if ((this.isSleeping || this.isShuttingDown) && (event.code === 'Space' || event.code === 'KeyP')) {
        event.preventDefault()
        this.$emit('wake')
        if (this.isShuttingDown && this.$router) {
          this.$router.push('/')
        } else {
          window.location.reload()
        }
      }
    },

    handleFileExplorerClick() {
      this.openProjectsModal()
    },

    handleMicrosoftStoreClick() {
      this.openServicesModal()
    },

    handleRecycleBinClick() {
      this.openBlogModal()
    },

    handlePptClick() {
      this.openAboutModal()
    },

    handleWordClick() {
      this.openResumeModal()
    },

    handleContactFromServices() {
      this.closeServicesModal()
      this.openContactModal()
    },

    // Modal management
    openBlogModal()     { this.showBlogModal = true },
    closeBlogModal()    { this.showBlogModal = false },
    
    openAboutModal()    { this.showAboutModal = true },
    closeAboutModal()   { this.showAboutModal = false },
    
    openProjectsModal() { this.showProjectsModal = true },
    closeProjectsModal(){ this.showProjectsModal = false },
    
    openServicesModal() { this.showServicesModal = true },
    closeServicesModal(){ this.showServicesModal = false },
    
    openResumeModal()   { this.showResumeModal = true },
    closeResumeModal()  { this.showResumeModal = false },
    
    openContactModal()  { this.showContactModal = true },
    closeContactModal() { this.showContactModal = false },

    // ── Image Animations ──────────────────────────────────────────────────────

    startImageAnimations() {
      this.animationInterval = setInterval(() => {
        if (this.showStartMenu) this.animateRandomImages()
      }, this._randomInterval(3000, 4000))
    },

    _randomInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },

    animateRandomImages() {
      const count    = Math.random() > 0.6 ? 2 : 1
      const total    = this.internalDiscoverImages.length
      const selected = new Set()
      while (selected.size < count) selected.add(Math.floor(Math.random() * total))
      this.animatedImages = Array.from(selected)
      setTimeout(() => { this.animatedImages = [] }, 600)
    },

    // ── Internal helpers ──────────────────────────────────────────────────────

    _closeMenus() {
      this.showPowerMenu   = false
      this.showProfileMenu = false
      this.showStartMenu   = false
    },

    // ── Public API (callable by parent via $refs) ─────────────────────────────

    showOverlayTemporarily(duration = 500) {
      this.showOverlay = true
      setTimeout(() => { this.showOverlay = false }, duration)
    },

    forceHideStartMenu() { this._closeMenus() },

    wakeFromSleep() {
      if (this.isSleeping) {
        this.isSleeping = false
        window.location.reload()
      }
    },

    getCurrentSleepState() {
      return { isSleeping: this.isSleeping, isShuttingDown: this.isShuttingDown }
    }
  }
}
</script>

<style scoped>
/* Keep all existing styles exactly as they were from your original */
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
.fade-dark-leave-to { opacity: 0; }

.fade-in-slow-enter-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}
.fade-in-slow-enter-from { opacity: 0; }

/* ── Start Menu ────────────────────────────────────────────────────────────── */

.start-menu {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: auto;
  min-width: 600px;
  max-width: calc(100% - 20px);
  height: 500px;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 1000;
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
.start-menu-slide-enter-from { transform: translateY(100%); opacity: 0; }
.start-menu-slide-leave-to   { transform: translateY(100%); opacity: 0; }

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

.start-menu-column::-webkit-scrollbar { width: 0; background: transparent; }

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

.hamburger-item    { align-self: flex-start; }
.hamburger-icon    { width: 20px; height: 20px; color: white; }
.column-icon-img   { width: 22px; height: 22px; object-fit: contain; }
.power-icon        { filter: brightness(0) invert(1); }
.profile-img       { border-radius: 50%; object-fit: cover; filter: none; }

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
  from { opacity: 0; transform: translateX(-25px); }
  to   { opacity: 1; transform: translateX(0); }
}

.power-options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
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

.power-option-icon  { width: 18px; height: 18px; filter: brightness(0) invert(1); opacity: 0.8; }
.power-option-label { font-size: 13px; font-family: 'Segoe UI', 'Roboto', sans-serif; }

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  width: 100%;
}

.profile-name {
  color: white;
  font-size: 15px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 600;
  padding: 10px 12px;
  letter-spacing: 0.3px;
}

.profile-role {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  padding: 0 12px 10px 12px;
}

.nav-column {
  width: 200px;
  background: rgba(0, 0, 0, 0.15);
  padding: 16px 12px;
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

.nav-list { display: flex; flex-direction: column; gap: 4px; }

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

.no-results {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  text-align: center;
  padding: 20px 12px;
  font-style: italic;
}

.images-column {
  flex: 1;
  min-width: 180px;
  background: rgba(255, 255, 255, 0.08);
  padding: 16px 12px;
  overflow-y: auto;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.image-placeholder {
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
  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(255,255,255,0);      background: rgba(255,255,255,0.05); }
  30%  { transform: scale(1.05); box-shadow: 0 0 20px 5px rgba(0,120,212,0.6); background: rgba(0,120,212,0.2); }
  70%  { transform: scale(1.02); box-shadow: 0 0 15px 3px rgba(0,120,212,0.4); background: rgba(0,120,212,0.15); }
  100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(255,255,255,0);      background: rgba(255,255,255,0.05); }
}

.responsive-image  { width: 100%; height: 100%; object-fit: cover; }
.responsive-icon   { width: 32px; height: 32px; color: rgba(255, 255, 255, 0.5); }

@media (min-width: 1400px) {
  .image-placeholder { height: 170px; }
}

.slide-column-enter-active { animation: slideColumnIn  0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1); }
.slide-column-leave-active { animation: slideColumnOut 0.3s  cubic-bezier(0.4, 0, 0.2, 1); }

@keyframes slideColumnIn {
  from { opacity: 0; transform: translateX(-30px); width: 0; }
  to   { opacity: 1; transform: translateX(0);     width: 200px; }
}
@keyframes slideColumnOut {
  from { opacity: 1; transform: translateX(0);     width: 200px; }
  to   { opacity: 0; transform: translateX(-30px); width: 0; padding: 0; }
}

/* ── Taskbar ───────────────────────────────────────────────────────────────── */

.taskbar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  z-index: 2000;
}

.taskbar-left  { display: flex; align-items: stretch; height: 100%; }
.taskbar-right { display: flex; align-items: center; height: 100%; position: relative; gap: 2px; }

.start-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.start-button:hover { background: rgba(0, 120, 212, 0.3); }

.start-button:hover .windows-icon {
  filter: brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(7484%) hue-rotate(200deg) brightness(94%) contrast(104%);
}

.windows-icon { width: 20px; height: 20px; object-fit: contain; transition: filter 0.2s ease; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 0 12px;
  height: 100%;
  min-width: 280px;
}

.search-bar:hover          { background: #f0f0f0; }
.search-bar:focus-within   { background: white; box-shadow: inset 0 0 0 1px rgba(0, 120, 212, 0.5); }

.search-icon { width: 16px; height: 16px; color: #666; flex-shrink: 0; }

.search-input-wrapper { position: relative; flex: 1; min-width: 0; }

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  padding: 0;
}

.search-placeholder {
  position: absolute;
  inset: 0;
  color: #666;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.search-placeholder:hover { color: #333; }

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
.chrome-icon { width: 24px; height: 24px; object-fit: contain; }

.taskview-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  height: 100%;
}

.taskview-icon-button:hover { background: rgba(255, 255, 255, 0.1); }
.taskview-svg-icon { width: 20px; height: 20px; color: white; opacity: 0.9; }

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
.arrow-svg-icon { width: 18px; height: 18px; color: white; opacity: 0.9; }

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

.battery-icon    { position: relative; width: 20px; height: 12px; display: flex; align-items: center; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3)); }
.battery-body    { width: 16px; height: 10px; border: 1px solid white; border-radius: 2px; background: transparent; position: relative; }
.battery-charge  { position: absolute; left: 1px; top: 1px; bottom: 1px; width: 12px; background: white; border-radius: 1px; }
.battery-terminal{ position: absolute; right: 1px; width: 2px; height: 5px; background: white; border-radius: 1px; top: 50%; transform: translateY(-50%); }

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
.wifi-icon { width: 16px; height: 16px; object-fit: contain; opacity: 0.9; }

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
.speaker-svg-icon { width: 16px; height: 16px; color: white; opacity: 0.9; }

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
  font-weight: 500;
}

.taskbar-date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.3;
}

.datetime-container:hover .taskbar-time,
.datetime-container:hover .taskbar-date { opacity: 0.7; }

.corner-bar {
  position: absolute;
  bottom: 0; right: 0;
  width: 12px; height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  cursor: default;
  transition: background 0.2s ease;
}

.corner-bar:hover { background: rgba(0, 120, 212, 0.15); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.7; }
}

.animate-pulse { animation: pulse 2s ease-in-out infinite; }

@media (max-width: 768px) {
  .start-menu   { min-width: 90%; max-width: 95%; }
  .nav-column   { width: 160px; }
  .dynamic-column { width: 160px; }
  .image-placeholder { height: 110px; }

  @keyframes slideColumnIn {
    from { opacity: 0; transform: translateX(-30px); width: 0; }
    to   { opacity: 1; transform: translateX(0);     width: 160px; }
  }
  @keyframes slideColumnOut {
    from { opacity: 1; transform: translateX(0);     width: 160px; }
    to   { opacity: 0; transform: translateX(-30px); width: 0; padding: 0; }
  }
}

@media (max-width: 480px) {
  .image-placeholder { height: 90px; }
  .profile-name      { font-size: 13px; padding: 8px 10px; }
  .profile-role      { font-size: 11px; padding: 0 10px 8px 10px; }
}
</style>