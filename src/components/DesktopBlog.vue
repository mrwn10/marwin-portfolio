<template>
  <div 
    class="recycle-modal-overlay" 
    v-if="visible"
    @click.self="closeModal"
  >
    <div 
      class="recycle-modal"
      :style="modalStyle"
      ref="modal"
    >
      <!-- Header with drag handle -->
      <div 
        class="modal-header"
        @mousedown="startDrag"
      >
        <div class="header-title">
          <span class="title-icon">🗑️</span>
          <span class="title-text">Recycle Bin</span>
        </div>
        <div class="header-controls">
          <div class="control-btn minimize" @click.stop="minimizeModal">
            <span>─</span>
          </div>
          <div class="control-btn maximize" @click.stop="toggleMaximize">
            <span>{{ isMaximized ? '❐' : '□' }}</span>
          </div>
          <div class="control-btn close" @click.stop="closeModal">
            <span>✕</span>
          </div>
        </div>
      </div>
      
      <!-- Empty content area -->
      <div class="modal-content">
        <div class="empty-recycle">
          <div class="empty-icon">🗑️</div>
          <div class="empty-text">Recycle Bin is empty</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecycleBinModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      modalX: 100,
      modalY: 100,
      modalWidth: 500,
      modalHeight: 400,
      isMaximized: false,
      savedState: {
        x: 100,
        y: 100,
        width: 500,
        height: 400
      }
    }
  },
  computed: {
    modalStyle() {
      if (this.isMaximized) {
        return {
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          transform: 'none'
        }
      }
      return {
        width: `${this.modalWidth}px`,
        height: `${this.modalHeight}px`,
        top: `${this.modalY}px`,
        left: `${this.modalX}px`,
        transform: 'none'
      }
    }
  },
  methods: {
    startDrag(e) {
      // Only allow dragging from the header (not from controls)
      if (e.target.closest('.header-controls')) return
      
      this.isDragging = true
      this.dragStartX = e.clientX - this.modalX
      this.dragStartY = e.clientY - this.modalY
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      
      // Add dragging cursor
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    },
    
    onDrag(e) {
      if (!this.isDragging || this.isMaximized) return
      
      let newX = e.clientX - this.dragStartX
      let newY = e.clientY - this.dragStartY
      
      // Get window boundaries
      const maxX = window.innerWidth - this.modalWidth
      const maxY = window.innerHeight - 50 // Leave some space at top
      
      // Constrain to viewport
      newX = Math.min(Math.max(0, newX), maxX)
      newY = Math.min(Math.max(0, newY), maxY)
      
      this.modalX = newX
      this.modalY = newY
    },
    
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    },
    
    minimizeModal() {
      this.$emit('minimize')
    },
    
    toggleMaximize() {
      if (this.isMaximized) {
        // Restore to saved size and position
        this.modalWidth = this.savedState.width
        this.modalHeight = this.savedState.height
        this.modalX = this.savedState.x
        this.modalY = this.savedState.y
        this.isMaximized = false
      } else {
        // Save current state before maximizing
        this.savedState = {
          x: this.modalX,
          y: this.modalY,
          width: this.modalWidth,
          height: this.modalHeight
        }
        this.isMaximized = true
      }
    },
    
    closeModal() {
      this.$emit('close')
    }
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  }
}
</script>

<style scoped>
.recycle-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.recycle-modal {
  position: fixed;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  z-index: 1001;
}

/* Header styling with drag handle */
.modal-header {
  background: linear-gradient(135deg, #2d2d30 0%, #1e1e1e 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 48px;
  cursor: grab;
  border-bottom: 1px solid #3c3c3c;
}

.modal-header:active {
  cursor: grabbing;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 18px;
}

.title-text {
  font-size: 13px;
  font-weight: 500;
}

.header-controls {
  display: flex;
  gap: 4px;
  cursor: default;
}

.control-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  font-size: 14px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.control-btn.close:hover {
  background: #e81123;
}

/* Content area */
.modal-content {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.empty-recycle {
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #666;
}

/* Maximized state adjustments */
.recycle-modal:has(.modal-header:active) {
  cursor: grabbing;
}
</style>