<template>
  <div class="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div class="text-center flex flex-col items-center">
      <!-- Windows Logo -->
      <img 
        src="../assets/img/win10.png" 
        alt="Windows Logo" 
        class="w-32 h-auto animate-fade-in drop-shadow-glow mb-32"
      />
      
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'BootScreen',
  mounted() {
    // Wait 4 seconds then redirect to lock screen
    setTimeout(() => {
      this.$router.push('/lock')
    }, 4000)
  }
}
</script>

<style scoped>
.windows-loader {
  position: relative;
  width: 30px;
  height: 30px;
  margin-top: 80px;
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

/* Position 12 dots in a perfect circle (every 30 degrees) */
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

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in;
}

.drop-shadow-glow {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}
</style>