<template>
  <DesktopComp 
    @file-explorer-click="handleProjectsClick"
    @microsoft-store-click="handleServicesClick"
    @recycle-bin-click="handleBlogClick"
    @chrome-click="handleChromeClick"
    @navigate="handleNavigate"
    @lock="handleLock"
    @shutdown="handleShutdown"
    @restart="handleRestart"
    @sleep="handleSleep"
    @wake="handleWake"
    @taskview-click="handleTaskViewClick"
    @speaker-click="handleSpeakerClick"
    @wifi-click="handleWifiClick"
    @battery-click="handleBatteryClick"
    @arrow-click="handleArrowClick"
    @image-click="handleImageClick"
  />
</template>

<script>
import DesktopComp from '@/components/DesktopComp.vue'

export default {
  name: 'DesktopScreen',
  components: { DesktopComp },
  
  methods: {
    handleProjectsClick() {
      console.log('Projects clicked - Navigate to projects page')
      // Add your projects logic here
      // Example: Navigate to projects page
      if (this.$router) {
        this.$router.push('/projects')
      }
    },
    
    handleServicesClick() {
      console.log('Services clicked - Navigate to services page')
      // Add your services logic here
      // Example: Navigate to services page
      if (this.$router) {
        this.$router.push('/services')
      }
    },
    
    handleBlogClick() {
      console.log('Blog clicked - Navigate to blog page')
      // Add your blog logic here
      // Example: Navigate to blog page
      if (this.$router) {
        this.$router.push('/blog')
      }
    },
    
    handleChromeClick() {
      console.log('Chrome clicked')
      // Chrome already opens a new tab, but you can add additional logic
    },
    
    handleNavigate(item) {
      console.log('Navigate to:', item)
      // Your navigation logic
      if (this.$router && item.route) {
        this.$router.push(item.route)
      }
    },
    
    handleLock() {
      console.log('Lock screen')
      // Your lock screen logic
      if (this.$router) {
        this.$router.push('/lock')
      }
    },
    
    handleShutdown() {
      console.log('Shutdown')
      // Your shutdown logic
      // You might want to show a shutdown dialog or perform cleanup
    },
    
    handleRestart() {
      console.log('Restart')
      // Your restart logic
      if (this.$router) {
        this.$router.push('/restart')
      }
    },
    
    handleSleep() {
      console.log('Sleep')
      // Your sleep logic
    },
    
    handleWake() {
      console.log('Wake')
      // Your wake logic
    },
    
    handleTaskViewClick() {
      console.log('Task view clicked')
      // Your task view logic - could show open windows/apps
    },
    
    handleSpeakerClick() {
      console.log('Speaker clicked')
      // Your speaker logic - could toggle mute or show volume slider
    },
    
    handleWifiClick() {
      console.log('WiFi clicked')
      // Your WiFi logic - could show available networks
    },
    
    handleBatteryClick() {
      console.log('Battery clicked')
      // Your battery logic - could show battery percentage/details
    },
    
    handleArrowClick() {
      console.log('Arrow clicked')
      // Your arrow logic - could show hidden icons or system tray
    },
    
    handleImageClick(image) {
      console.log('Image clicked:', image)
      // Your image click logic - could open image in lightbox or navigate
      if (image && image.src) {
        // Example: Open image in modal or new tab
        window.open(image.src, '_blank')
      }
    }
  }
}
</script>