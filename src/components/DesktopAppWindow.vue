<template>
  <transition name="window-fade">
    <div
      v-if="visible"
      class="app-window"
      :class="{ 'window-maximized': isWindowMaximized }"
      :style="windowStyle"
      @mousedown="handleWindowMousedown"
    >
      <!-- Window Title Bar -->
      <div
        class="window-title-bar"
        @mousedown="startDragWindow"
        @dblclick="toggleMaximize"
      >
        <div class="window-title">
          <svg class="window-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>{{ title }}</span>
        </div>
        <div class="window-controls">
          <button class="window-btn minimize-btn" @click.stop="$emit('minimize')" title="Minimize">
            <svg viewBox="0 0 10 10" fill="currentColor">
              <rect x="1" y="4" width="8" height="1.5"/>
            </svg>
          </button>
          <button class="window-btn maximize-btn" @click.stop="toggleMaximize" :title="isWindowMaximized ? 'Restore' : 'Maximize'">
            <svg viewBox="0 0 10 10" fill="currentColor">
              <path v-if="!isWindowMaximized" d="M2,2 L8,2 L8,8 L2,8 Z M2,2 L8,2 M2,2 L2,8 M8,2 L8,8 M2,8 L8,8" stroke="currentColor" stroke-width="0.8" fill="none"/>
              <path v-else d="M3,2 L8,2 L8,7 L7,7 L7,3 L3,3 Z M2,3 L7,3 L7,8 L2,8 Z" stroke="currentColor" stroke-width="0.8" fill="none"/>
            </svg>
          </button>
          <button class="window-btn close-btn" @click.stop="$emit('close')" title="Close">
            <svg viewBox="0 0 10 10" fill="currentColor">
              <path d="M2,2 L8,8 M8,2 L2,8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Window Content (slot for any app) -->
      <div class="window-content">
        <slot />
      </div>

      <!-- Resize Handles -->
      <div class="resize-handle resize-nw" @mousedown.stop="startResize('nw', $event)"></div>
      <div class="resize-handle resize-n"  @mousedown.stop="startResize('n',  $event)"></div>
      <div class="resize-handle resize-ne" @mousedown.stop="startResize('ne', $event)"></div>
      <div class="resize-handle resize-w"  @mousedown.stop="startResize('w',  $event)"></div>
      <div class="resize-handle resize-e"  @mousedown.stop="startResize('e',  $event)"></div>
      <div class="resize-handle resize-sw" @mousedown.stop="startResize('sw', $event)"></div>
      <div class="resize-handle resize-s"  @mousedown.stop="startResize('s',  $event)"></div>
      <div class="resize-handle resize-se" @mousedown.stop="startResize('se', $event)"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DesktopAppWindow',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Window'
    },
    initialPosition: {
      type: Object,
      default: () => ({ x: 100, y: 100 })
    },
    initialSize: {
      type: Object,
      default: () => ({ width: 900, height: 600 })
    },
    minWidth: {
      type: Number,
      default: 400
    },
    minHeight: {
      type: Number,
      default: 300
    },
    // Taskbar height so maximized window doesn't go under it
    taskbarHeight: {
      type: Number,
      default: 40
    }
  },

  emits: ['close', 'minimize', 'bring-to-front'],

  data() {
    return {
      windowPosition: { ...this.initialPosition },
      windowSize:     { ...this.initialSize },
      isWindowMaximized: false,
      windowZIndex: 1000,

      // Drag state
      isDraggingWindow: false,
      dragStart:        { x: 0, y: 0 },
      windowStartPos:   { x: 0, y: 0 },

      // Resize state
      isResizing:      false,
      resizeDirection: null,
      resizeStart:     { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 },

      // Saved state for restore
      savedPosition: { ...this.initialPosition },
      savedSize:     { ...this.initialSize }
    }
  },

  computed: {
    windowStyle() {
      if (this.isWindowMaximized) {
        return { zIndex: this.windowZIndex }
      }
      return {
        left:   this.windowPosition.x + 'px',
        top:    this.windowPosition.y + 'px',
        width:  this.windowSize.width  + 'px',
        height: this.windowSize.height + 'px',
        zIndex: this.windowZIndex
      }
    }
  },

  watch: {
    // Reset position/size when window is re-opened after being closed
    visible(val) {
      if (val) {
        this.bringToFront()
      }
    }
  },

  beforeUnmount() {
    this._removeDragListeners()
    this._removeResizeListeners()
  },

  methods: {
    // ─── Z-index ────────────────────────────────────────────────────────────────

    handleWindowMousedown() {
      this.bringToFront()
    },

    bringToFront() {
      const windows = document.querySelectorAll('.app-window')
      let maxZ = this.windowZIndex
      windows.forEach(win => {
        const z = parseInt(getComputedStyle(win).zIndex)
        if (!isNaN(z) && z > maxZ) maxZ = z
      })
      this.windowZIndex = maxZ + 1
      this.$emit('bring-to-front')
    },

    // ─── Maximize / Restore ─────────────────────────────────────────────────────

    toggleMaximize() {
      if (this.isWindowMaximized) {
        this.windowPosition    = { ...this.savedPosition }
        this.windowSize        = { ...this.savedSize }
        this.isWindowMaximized = false
      } else {
        this.savedPosition     = { ...this.windowPosition }
        this.savedSize         = { ...this.windowSize }
        this.isWindowMaximized = true
      }
    },

    // ─── Drag ───────────────────────────────────────────────────────────────────

    startDragWindow(e) {
      // Don't drag when clicking window controls or when maximized
      if (e.target.closest('.window-controls') || this.isWindowMaximized) return
      e.preventDefault()
      this.isDraggingWindow = true
      this.dragStart        = { x: e.clientX, y: e.clientY }
      this.windowStartPos   = { ...this.windowPosition }
      document.addEventListener('mousemove', this._onDragWindow)
      document.addEventListener('mouseup',   this._stopDragWindow)
    },

    _onDragWindow(e) {
      if (!this.isDraggingWindow) return
      this.windowPosition = {
        x: this.windowStartPos.x + (e.clientX - this.dragStart.x),
        y: this.windowStartPos.y + (e.clientY - this.dragStart.y)
      }
    },

    _stopDragWindow() {
      this.isDraggingWindow = false
      this._removeDragListeners()
    },

    _removeDragListeners() {
      document.removeEventListener('mousemove', this._onDragWindow)
      document.removeEventListener('mouseup',   this._stopDragWindow)
    },

    // ─── Resize ─────────────────────────────────────────────────────────────────

    startResize(direction, e) {
      e.preventDefault()
      this.isResizing      = true
      this.resizeDirection = direction
      this.resizeStart     = {
        x:      e.clientX,
        y:      e.clientY,
        width:  this.windowSize.width,
        height: this.windowSize.height,
        left:   this.windowPosition.x,
        top:    this.windowPosition.y
      }
      document.addEventListener('mousemove', this._onResize)
      document.addEventListener('mouseup',   this._stopResize)
    },

    _onResize(e) {
      if (!this.isResizing) return

      const dx = e.clientX - this.resizeStart.x
      const dy = e.clientY - this.resizeStart.y
      const mw = this.minWidth
      const mh = this.minHeight

      let w = this.resizeStart.width
      let h = this.resizeStart.height
      let x = this.resizeStart.left
      let y = this.resizeStart.top

      switch (this.resizeDirection) {
        case 'e':
          w = Math.max(mw, w + dx)
          break
        case 'w': {
          const newW = Math.max(mw, w - dx)
          x = x + (w - newW)   // anchor right edge
          w = newW
          break
        }
        case 's':
          h = Math.max(mh, h + dy)
          break
        case 'n': {
          const newH = Math.max(mh, h - dy)
          y = y + (h - newH)   // anchor bottom edge
          h = newH
          break
        }
        case 'se':
          w = Math.max(mw, w + dx)
          h = Math.max(mh, h + dy)
          break
        case 'sw': {
          const newW = Math.max(mw, w - dx)
          x = x + (w - newW)
          w = newW
          h = Math.max(mh, h + dy)
          break
        }
        case 'ne': {
          const newH = Math.max(mh, h - dy)
          y = y + (h - newH)
          w = Math.max(mw, w + dx)
          h = newH
          break
        }
        case 'nw': {
          const newW = Math.max(mw, w - dx)
          const newH = Math.max(mh, h - dy)
          x = x + (w - newW)
          y = y + (h - newH)
          w = newW
          h = newH
          break
        }
      }

      this.windowSize     = { width: w, height: h }
      this.windowPosition = { x, y }
    },

    _stopResize() {
      this.isResizing = false
      this._removeResizeListeners()
    },

    _removeResizeListeners() {
      document.removeEventListener('mousemove', this._onResize)
      document.removeEventListener('mouseup',   this._stopResize)
    }
  }
}
</script>

<style scoped>
.app-window {
  position: fixed;
  background: rgba(32, 32, 32, 0.98);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 400px;
  min-height: 300px;
}

.window-maximized {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: calc(100% - 40px) !important;
  border-radius: 0;
}

/* ── Title Bar ─────────────────────────────────────────────────────────────── */

.window-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: grab;
  user-select: none;
  flex-shrink: 0;
}

.window-title-bar:active { cursor: grabbing; }

.window-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 13px;
  font-family: 'Segoe UI', sans-serif;
  font-weight: 500;
}

.window-icon {
  width: 16px;
  height: 16px;
}

/* ── Window Controls ───────────────────────────────────────────────────────── */

.window-controls {
  display: flex;
  gap: 4px;
}

.window-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  transition: background 0.2s ease;
}

.window-btn svg {
  width: 12px;
  height: 12px;
}

.window-btn:hover        { background: rgba(255, 255, 255, 0.1); }
.close-btn:hover         { background: #e81123; }

/* ── Content ───────────────────────────────────────────────────────────────── */

.window-content {
  flex: 1;
  overflow: auto;
  background: rgba(0, 0, 0, 0.2);
}

/* ── Resize Handles ────────────────────────────────────────────────────────── */

.resize-handle {
  position: absolute;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.2s ease;
}

.resize-handle:hover {
  opacity: 1;
  background: rgba(0, 120, 212, 0.3);
}

.resize-nw { top: 0;    left: 0;    width: 15px; height: 15px; cursor: nw-resize; }
.resize-n  { top: 0;    left: 15px; right: 15px; height: 5px;  cursor: n-resize;  }
.resize-ne { top: 0;    right: 0;   width: 15px; height: 15px; cursor: ne-resize; }
.resize-w  { top: 15px; left: 0;    bottom: 15px; width: 5px;  cursor: w-resize;  }
.resize-e  { top: 15px; right: 0;   bottom: 15px; width: 5px;  cursor: e-resize;  }
.resize-sw { bottom: 0; left: 0;    width: 15px; height: 15px; cursor: sw-resize; }
.resize-s  { bottom: 0; left: 15px; right: 15px; height: 5px;  cursor: s-resize;  }
.resize-se { bottom: 0; right: 0;   width: 15px; height: 15px; cursor: se-resize; }

/* ── Transition ────────────────────────────────────────────────────────────── */

.window-fade-enter-active,
.window-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.window-fade-enter-from,
.window-fade-enter {
  opacity: 0;
  transform: scale(0.95);
}

.window-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>