<template>
  <div class="restart-container">
    <!-- Main Content -->
    <transition name="content-fade" appear>
      <div v-if="isVisible" class="fixed inset-0 z-50 overflow-hidden">
        <!-- Sky Blue Background - Windows 10 style -->
        <div class="absolute inset-0 bg-sky-500"></div>
        
        <!-- Restart Content -->
        <div class="relative h-full flex items-center justify-center">
          <div class="text-center flex flex-col items-center">
            <!-- Windows 10 Circular Loading -->
            <div class="windows-loader">
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
              <div class="circle-dot"></div>
            </div>
            
            <!-- Restart Text -->
            <h1 class="text-white text-xl font-light mt-4" style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              Restarting
            </h1>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'WindowsRestart',
  data() {
    return {
      isVisible: false,
      timeoutId: null
    }
  },
  mounted() {
    // Fade in content smoothly
    requestAnimationFrame(() => {
      this.isVisible = true
    })
    
    // Wait 4 seconds before redirecting
    this.timeoutId = setTimeout(() => {
      this.completeRestart()
    }, 4000)
  },
  beforeUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  },
  methods: {
    completeRestart() {
      // Fade out content smoothly
      this.isVisible = false
      setTimeout(() => {
        this.$router.push('/')
      }, 500)
    }
  }
}
</script>

<style scoped>
.restart-container {
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: black;
}

/* Smooth content fade transition */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.content-fade-enter-to,
.content-fade-leave-from {
  opacity: 1;
}

/* Windows 10 Circular Loading */
.windows-loader {
  position: relative;
  width: 30px;
  height: 30px;
}

.circle-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
  opacity: 0;
  animation: circle-rotate 1.5s linear infinite;
}

.circle-dot:nth-child(1) { top: 0; left: 50%; transform: translate(-50%, -50%); animation-delay: 0s; }
.circle-dot:nth-child(2) { top: 6.7%; left: 75%; transform: translate(-50%, -50%); animation-delay: 0.125s; }
.circle-dot:nth-child(3) { top: 25%; left: 93.3%; transform: translate(-50%, -50%); animation-delay: 0.25s; }
.circle-dot:nth-child(4) { top: 50%; left: 100%; transform: translate(-50%, -50%); animation-delay: 0.375s; }
.circle-dot:nth-child(5) { top: 75%; left: 93.3%; transform: translate(-50%, -50%); animation-delay: 0.5s; }
.circle-dot:nth-child(6) { top: 93.3%; left: 75%; transform: translate(-50%, -50%); animation-delay: 0.625s; }
.circle-dot:nth-child(7) { top: 100%; left: 50%; transform: translate(-50%, -50%); animation-delay: 0.75s; }
.circle-dot:nth-child(8) { top: 93.3%; left: 25%; transform: translate(-50%, -50%); animation-delay: 0.875s; }
.circle-dot:nth-child(9) { top: 75%; left: 6.7%; transform: translate(-50%, -50%); animation-delay: 1.0s; }
.circle-dot:nth-child(10) { top: 50%; left: 0%; transform: translate(-50%, -50%); animation-delay: 1.125s; }
.circle-dot:nth-child(11) { top: 25%; left: 6.7%; transform: translate(-50%, -50%); animation-delay: 1.25s; }
.circle-dot:nth-child(12) { top: 6.7%; left: 25%; transform: translate(-50%, -50%); animation-delay: 1.375s; }

@keyframes circle-rotate {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  15% {
    opacity: 1;
    transform: scale(1);
  }
  30% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
}
</style>