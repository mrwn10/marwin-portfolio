<template>
  <div class="fixed inset-0 z-50 overflow-hidden" @click="handleClick" @keydown="handleKeyPress" tabindex="0">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out"
      :class="{ 'blur-2xl': showWelcome }"
      :style="{ backgroundImage: `url(${require('@/assets/img/lockscreen.png')})` }"
    ></div>
    
    <!-- Dark blur overlay that fades out -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-xl animate-dark-blur-out"></div>
    
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
    
    <!-- Welcome Overlay (password screen) - ONLY shows after user interaction -->
    <div 
      v-if="showWelcomeDelayed && !isSleeping && !isShuttingDown"
      class="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-20 animate-fade-in-center"
    >
      <!-- Power Button with Dropdown Menu -->
      <div class="absolute bottom-12 right-12">
        <div class="relative">
          <button 
            @click.stop="togglePowerMenu"
            class="power-button flex items-center justify-center transition-all duration-200"
            style="background: transparent; padding: 8px; border-radius: 8px;"
          >
            <img 
              src="../assets/img/power.png" 
              alt="Power" 
              class="w-6 h-6 brightness-0 invert"
              style="opacity: 0.8;"
            />
          </button>
          
          <!-- Dropdown Menu - Windows 11 style with animation -->
          <transition name="dropdown">
            <div 
              v-if="showPowerMenu"
              class="absolute bottom-full right-0 mb-2 w-48 bg-[#1f1f1f] rounded-lg overflow-hidden shadow-2xl"
              style="box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1);"
            >
              <button 
                @click="handleShutdown"
                class="w-full px-4 py-2.5 text-left text-white hover:bg-[#2d2d2d] transition-colors flex items-center gap-3 text-sm"
              >
                <img 
                  src="../assets/img/power.png" 
                  alt="Shutdown" 
                  class="w-4 h-4 brightness-0 invert"
                  style="opacity: 0.8;"
                />
                Shutdown
              </button>
              <button 
                @click="handleRestart"
                class="w-full px-4 py-2.5 text-left text-white hover:bg-[#2d2d2d] transition-colors flex items-center gap-3 text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Restart
              </button>
              <button 
                @click="handleSleep"
                class="w-full px-4 py-2.5 text-left text-white hover:bg-[#2d2d2d] transition-colors flex items-center gap-3 text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                Sleep
              </button>
            </div>
          </transition>
        </div>
      </div>
      
      <div class="text-center animate-scale-up">
        <!-- Profile Circle -->
        <div class="flex justify-center mb-4">
          <div class="w-44 h-44 rounded-full overflow-hidden" style="box-shadow: 0 25px 35px -8px rgba(0, 0, 0, 0.6), 0 15px 15px -6px rgba(0, 0, 0, 0.4); border: 3px solid rgba(255, 255, 255, 0.3);">
            <img 
              src="../assets/img/profile.jpeg" 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <!-- Marwin Dalin -->
        <h1 class="text-white mb-4 windows-10-font" style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; font-size: 2.5rem; font-weight: 300; letter-spacing: normal; text-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);">
          Marwin Dalin
        </h1>
        
        <!-- Password input area or error message -->
        <div class="mt-1 flex flex-col items-center">
          <!-- Normal password input -->
          <div v-if="!showError && !isLoading" class="relative">
            <input 
              ref="passwordInput"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Enter password"
              class="px-3 w-80 bg-white text-gray-800 placeholder-gray-400 text-left focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all pr-10"
              style="border-radius: 0px; box-shadow: 0 15px 20px -6px rgba(0, 0, 0, 0.4), 0 5px 10px -4px rgba(0, 0, 0, 0.3); height: 32px; font-size: 14px;"
              @keypress.enter="handleUnlock"
              v-model="password"
            />
            <button 
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none opacity-60 hover:opacity-100"
              tabindex="-1"
            >
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          
          <!-- Loading spinner -->
          <div v-else-if="isLoading" class="windows-loader">
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
          
          <!-- Error message -->
          <div v-else-if="showError" class="flex flex-col items-center gap-4">
            <div class="text-white text-sm text-center" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
              Incorrect password. Please try again.
            </div>
            <button 
              ref="okButton"
              @click="resetFromError"
              @keypress.enter="resetFromError"
              class="ok-button"
            >
              OK
            </button>
          </div>
          
          <!-- Password hint -->
          <div v-if="!showError && !isLoading" class="mt-4 text-white/50 text-sm text-center" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
            Password: marwin123
          </div>
        </div>
      </div>
    </div>
    
    <!-- Initial Clock Screen - Shows when NOT in password mode -->
    <div 
      class="relative h-full w-full"
      :class="{ 'animate-fade-out-up': showWelcome }"
      v-if="!isSleeping && !isShuttingDown && !showWelcomeDelayed"
      @click="handleClockScreenClick"
    >
      <!-- Date & Time - Bottom Left -->
      <div class="absolute bottom-12 left-12 text-left animate-fade-in-bottom">
        <div class="text-white text-7xl font-light mb-3 drop-shadow-lg tracking-wide" style="margin-left: 0; padding-left: 0; text-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);">
          {{ currentTime }}
        </div>
        <div class="text-white/80 text-2xl tracking-wide" style="margin-left: 0; padding-left: 0; text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);">
          {{ currentDate }}
        </div>
      </div>
      
      <!-- Status Icons - Bottom Right -->
      <div class="absolute bottom-12 right-12 flex items-center gap-3 animate-fade-in-bottom-right">
        <img 
          src="../assets/img/wifii.png" 
          alt="WiFi" 
          class="w-5 h-5 brightness-0 invert"
          style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));"
        />
        
        <div class="flex items-center gap-1" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));">
          <div class="relative">
            <div class="w-5 h-3 border border-white rounded-sm"></div>
            <div class="absolute inset-[2px] bg-white rounded-[1px]"></div>
            <div class="absolute -right-[2px] top-[2.5px] w-[2px] h-[5px] bg-white rounded-r-sm"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'LockScreen',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      currentTime: '',
      currentDate: '',
      showWelcome: false,
      showWelcomeDelayed: false,
      password: '',
      showPassword: false,
      showPowerMenu: false,
      intervalId: null,
      isSleeping: false,
      isShuttingDown: false,
      showError: false,
      isLoading: false
    }
  },
  mounted() {
    this.updateDateTime()
    this.intervalId = setInterval(this.updateDateTime, 1000)
    
    // Focus the container to capture key events
    this.$el.focus()
    
    // Add sleep/shutdown wake listener
    window.addEventListener('keydown', this.handleWakeKey)
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    window.removeEventListener('keydown', this.handleWakeKey)
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      
      let hours = now.getHours()
      let minutes = now.getMinutes()
      
      hours = hours % 12
      if (hours === 0) hours = 12
      
      const minutesStr = minutes < 10 ? '0' + minutes : minutes
      
      this.currentTime = `${hours}:${minutesStr}`
      
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      
      const dayName = days[now.getDay()]
      const dayNumber = now.getDate()
      const monthName = months[now.getMonth()]
      
      this.currentDate = `${dayName}, ${dayNumber} ${monthName}`
    },
    
    handleClockScreenClick(event) {
      // Handle click on the clock screen
      if (!this.showWelcome && !this.showWelcomeDelayed && !this.isSleeping && !this.isShuttingDown) {
        event.stopPropagation()
        this.showWelcome = true
        
        setTimeout(() => {
          this.showWelcomeDelayed = true
          this.$nextTick(() => {
            if (this.$refs.passwordInput) {
              this.$refs.passwordInput.focus()
            }
          })
        }, 300)
      }
    },
    
    handleKeyPress(event) {
      // Only trigger on Space bar when in initial state
      if (event.code === 'Space' && !this.showWelcome && !this.showWelcomeDelayed && !this.isSleeping && !this.isShuttingDown) {
        event.preventDefault()
        event.stopPropagation()
        this.showWelcome = true
        
        setTimeout(() => {
          this.showWelcomeDelayed = true
          this.$nextTick(() => {
            if (this.$refs.passwordInput) {
              this.$refs.passwordInput.focus()
            }
          })
        }, 300)
      }
    },
    
    handleClick(event) {
      // Don't trigger if clicking on power menu
      const powerContainer = event.target.closest('.relative')
      if (powerContainer) return
      
      // Only trigger when in initial state AND not clicking on the clock screen (which has its own handler)
      if (!this.showWelcome && !this.showWelcomeDelayed && !this.isSleeping && !this.isShuttingDown) {
        this.showWelcome = true
        
        setTimeout(() => {
          this.showWelcomeDelayed = true
          this.$nextTick(() => {
            if (this.$refs.passwordInput) {
              this.$refs.passwordInput.focus()
            }
          })
        }, 300)
      }
    },
    
    handleUnlock() {
      if (this.password === 'marwin123') {
        this.showError = false
        this.isLoading = false
        this.router.push('/desktop')
      } else {
        this.isLoading = true
        this.password = ''
        
        setTimeout(() => {
          this.isLoading = false
          this.showError = true
          
          this.$nextTick(() => {
            if (this.$refs.okButton) {
              this.$refs.okButton.focus()
            }
          })
        }, 1000)
      }
    },
    
    resetFromError() {
      this.showError = false
      this.password = ''
      this.$nextTick(() => {
        if (this.$refs.passwordInput) {
          this.$refs.passwordInput.focus()
        }
      })
    },
    
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
      this.$nextTick(() => {
        if (this.$refs.passwordInput) {
          this.$refs.passwordInput.focus()
        }
      })
    },
    
    togglePowerMenu() {
      this.showPowerMenu = !this.showPowerMenu
    },
    
    handleShutdown() {
      this.showPowerMenu = false
      this.isShuttingDown = true
    },
    
    handleRestart() {
      this.showPowerMenu = false
      this.router.push('/restart')
    },
    
    handleSleep() {
      this.showPowerMenu = false
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
    }
  }
}
</script>

<style scoped>
@keyframes dark-blur-out {
  0% {
    backdrop-filter: blur(30px);
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 1;
  }
  30% {
    backdrop-filter: blur(15px);
    background-color: rgba(0, 0, 0, 0.4);
  }
  100% {
    backdrop-filter: blur(0px);
    background-color: rgba(0, 0, 0, 0);
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes fade-in-bottom {
  0% {
    opacity: 0;
    transform: translateY(80px);
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-bottom-right {
  0% {
    opacity: 0;
    transform: translateY(80px) translateX(20px);
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

@keyframes fade-in-center {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scale-up {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-out-up {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px);
    visibility: hidden;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

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

.windows-loader {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto;
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

.ok-button {
  padding: 6px 48px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  cursor: pointer;
  letter-spacing: 0.5px;
  min-width: 160px;
}

.ok-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.ok-button:focus {
  outline: none;
  ring: 2px solid rgba(255, 255, 255, 0.5);
}

.dropdown-enter-active {
  animation: dropdownIn 0.2s ease-out;
}

.dropdown-leave-active {
  animation: dropdownOut 0.15s ease-in;
}

@keyframes dropdownIn {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdownOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

.animate-dark-blur-out {
  animation: dark-blur-out 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-fade-in-bottom {
  opacity: 0;
  animation: fade-in-bottom 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) 0.3s forwards;
}

.animate-fade-in-bottom-right {
  opacity: 0;
  animation: fade-in-bottom-right 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) 0.3s forwards;
}

.animate-fade-in-center {
  animation: fade-in-center 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
}

.animate-scale-up {
  animation: scale-up 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}

.animate-fade-out-up {
  animation: fade-out-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.blur-2xl {
  filter: blur(20px);
  transform: scale(1.05);
}

.power-button {
  background: transparent;
  transition: all 0.2s ease;
}

.power-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.windows-10-font {
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  letter-spacing: normal;
}
</style>