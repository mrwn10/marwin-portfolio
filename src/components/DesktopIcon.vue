<!-- DesktopIcon.vue -->
<template>
  <div class="desktop-icons-container">
    <div
      v-for="(icon, index) in icons"
      :key="icon.id"
      class="desktop-icon"
      :class="{ 'dragging': draggingIcon === icon.id }"
      :style="{
        transform: `translate(${icon.dragX !== undefined ? icon.dragX : icon.x}px, ${icon.dragY !== undefined ? icon.dragY : icon.y}px)`,
        zIndex: draggingIcon === icon.id ? 1000 : autoZIndex(icon),
        transition: shouldAnimate ? (draggingIcon === icon.id ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)') : 'none'
      }"
      @mousedown="startDrag($event, index, icon)"
      @dblclick="handleIconDoubleClick(icon)"
    >
      <img :src="icon.icon" :alt="icon.label" class="icon-image" />
      <span class="icon-label">{{ icon.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopIcon',
  
  props: {
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
    gridSize: {
      type: Number,
      default: 100
    },
    iconWidth: {
      type: Number,
      default: 80
    },
    iconHeight: {
      type: Number,
      default: 80
    }
  },
  
  emits: [
    'file-explorer-click', 
    'microsoft-store-click', 
    'recycle-bin-click',
    'chrome-click',
    'ppt-click',
    'word-click',
    'icons-updated'
  ],
  
  data() {
    return {
      draggingIcon: null,
      dragStartX: 0,
      dragStartY: 0,
      initialX: 0,
      initialY: 0,
      initialColumn: 0,
      initialRow: 0,
      isDragging: false,
      dragThreshold: 5,
      dragOccurred: false,
      clickTimer: null,
      shouldAnimate: false,
      animationTimeout: null,
      icons: [
        {
          id: 'blog',
          label: 'Blog',
          icon: this.recycleBinIcon,
          x: 0,
          y: 0,
          column: 0,
          row: 0,
          event: 'recycle-bin-click'
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: this.fileExplorerIcon,
          x: 0,
          y: 100,
          column: 0,
          row: 1,
          event: 'file-explorer-click'
        },
        {
          id: 'services',
          label: 'Services',
          icon: this.microsoftStoreIcon,
          x: 0,
          y: 200,
          column: 0,
          row: 2,
          event: 'microsoft-store-click'
        },
        {
          id: 'contact',
          label: 'Contact',
          icon: this.chromeIcon,
          x: 0,
          y: 300,
          column: 0,
          row: 3,
          event: 'chrome-click'
        },
        {
          id: 'about',
          label: 'About Me',
          icon: this.pptIcon,
          x: 100,
          y: 0,
          column: 1,
          row: 0,
          event: 'ppt-click'
        },
        {
          id: 'resume',
          label: 'Resume',
          icon: this.wordIcon,
          x: 100,
          y: 100,
          column: 1,
          row: 1,
          event: 'word-click'
        }
      ]
    }
  },
  
  mounted() {
    this.loadIconPositions()
    window.addEventListener('mousemove', this.onDrag)
    window.addEventListener('mouseup', this.stopDrag)
    
    this.animationTimeout = setTimeout(() => {
      this.shouldAnimate = true
    }, 100)
  },
  
  beforeUnmount() {
    window.removeEventListener('mousemove', this.onDrag)
    window.removeEventListener('mouseup', this.stopDrag)
    if (this.clickTimer) clearTimeout(this.clickTimer)
    if (this.animationTimeout) clearTimeout(this.animationTimeout)
  },
  
  methods: {
    autoZIndex(icon) {
      return 10 - this.icons.findIndex(i => i.id === icon.id)
    },
    
    startDrag(event, index, icon) {
      if (event.button !== 0) return
      
      event.preventDefault()
      event.stopPropagation()
      
      this.draggingIcon = icon.id
      this.dragStartX = event.clientX
      this.dragStartY = event.clientY
      this.initialX = icon.x
      this.initialY = icon.y
      this.initialColumn = icon.column
      this.initialRow = icon.row
      this.isDragging = false
      this.dragOccurred = false
      
      if (this.clickTimer) {
        clearTimeout(this.clickTimer)
        this.clickTimer = null
      }
      
      icon.dragX = icon.x
      icon.dragY = icon.y
      
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    },
    
    onDrag(event) {
      if (!this.draggingIcon) return
      
      const deltaX = event.clientX - this.dragStartX
      const deltaY = event.clientY - this.dragStartY
      
      if (!this.isDragging && (Math.abs(deltaX) > this.dragThreshold || Math.abs(deltaY) > this.dragThreshold)) {
        this.isDragging = true
        this.dragOccurred = true
      }
      
      if (this.isDragging) {
        const icon = this.icons.find(i => i.id === this.draggingIcon)
        if (icon) {
          let newX = this.initialX + deltaX
          let newY = this.initialY + deltaY
          
          const container = document.querySelector('.desktop-icons-container')
          const containerRect = container?.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight - 40 }
          
          const maxX = Math.max(0, containerRect.width - this.iconWidth)
          const maxY = Math.max(0, containerRect.height - this.iconHeight)
          
          icon.dragX = Math.min(Math.max(0, newX), maxX)
          icon.dragY = Math.min(Math.max(0, newY), maxY)
        }
      }
    },
    
    findEmptyGridPosition(startColumn, startRow) {
      let maxAttempts = 100
      let attempt = 0
      let column = startColumn
      let row = startRow
      
      while (attempt < maxAttempts) {
        const isOccupied = this.icons.some(other => 
          other.id !== this.draggingIcon && 
          other.column === column && 
          other.row === row
        )
        
        if (!isOccupied) {
          return { column, row }
        }
        
        if (row === startRow && column === startColumn) {
          column++
        } else if (column > startColumn && row === startRow) {
          row++
        } else if (column === startColumn && row > startRow) {
          column--
        } else if (column < startColumn && row === startRow + 1) {
          row--
        } else {
          startColumn++
          startRow++
          column = startColumn
          row = startRow
        }
        
        attempt++
      }
      
      return { column: this.initialColumn, row: this.initialRow }
    },
    
    stopDrag() {
      if (this.draggingIcon) {
        const icon = this.icons.find(i => i.id === this.draggingIcon)
        
        if (icon && this.isDragging) {
          let newX = icon.dragX
          let newY = icon.dragY
          
          const container = document.querySelector('.desktop-icons-container')
          const containerRect = container?.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight - 40 }
          
          let snappedX = Math.round(newX / this.gridSize) * this.gridSize
          let snappedY = Math.round(newY / this.gridSize) * this.gridSize
          
          const maxX = Math.max(0, (containerRect.width - this.iconWidth) / this.gridSize) * this.gridSize
          const maxY = Math.max(0, (containerRect.height - this.iconHeight) / this.gridSize) * this.gridSize
          
          snappedX = Math.min(Math.max(0, snappedX), maxX)
          snappedY = Math.min(Math.max(0, snappedY), maxY)
          
          const targetColumn = Math.round(snappedX / this.gridSize)
          const targetRow = Math.round(snappedY / this.gridSize)
          
          const overlappingIcon = this.icons.find(other => 
            other.id !== icon.id && 
            other.column === targetColumn && 
            other.row === targetRow
          )
          
          let finalColumn, finalRow, finalX, finalY
          
          if (overlappingIcon) {
            const emptySpot = this.findEmptyGridPosition(targetColumn, targetRow)
            finalColumn = emptySpot.column
            finalRow = emptySpot.row
            finalX = finalColumn * this.gridSize
            finalY = finalRow * this.gridSize
          } else {
            finalColumn = targetColumn
            finalRow = targetRow
            finalX = snappedX
            finalY = snappedY
          }
          
          icon.x = finalX
          icon.y = finalY
          icon.column = finalColumn
          icon.row = finalRow
          
          delete icon.dragX
          delete icon.dragY
          
          this.reorderIconsByPosition()
          this.saveIconPositions()
        }
        
        this.draggingIcon = null
        this.isDragging = false
        
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        
        this.$emit('icons-updated', this.icons)
      }
    },
    
    reorderIconsByPosition() {
      this.icons.sort((a, b) => {
        if (a.row === b.row) return a.column - b.column
        return a.row - b.row
      })
    },
    
    saveIconPositions() {
      const positions = this.icons.map(icon => ({
        id: icon.id,
        x: icon.x,
        y: icon.y,
        column: icon.column,
        row: icon.row
      }))
      localStorage.setItem('desktop-icon-positions', JSON.stringify(positions))
    },
    
    loadIconPositions() {
      const saved = localStorage.getItem('desktop-icon-positions')
      if (saved) {
        const positions = JSON.parse(saved)
        positions.forEach(savedIcon => {
          const icon = this.icons.find(i => i.id === savedIcon.id)
          if (icon) {
            icon.x = savedIcon.x
            icon.y = savedIcon.y
            icon.column = savedIcon.column
            icon.row = savedIcon.row
          }
        })
        this.reorderIconsByPosition()
      }
    },
    
    handleIconDoubleClick(icon) {
      if (!this.dragOccurred && !this.isDragging) {
        // Simply emit the event - parent component handles opening the modal
        this.$emit(icon.event)
        console.log(`${icon.label} opened`)
      }
      
      this.dragOccurred = false
    },
    
    resetIconPositions() {
      const defaultPositions = {
        blog: { x: 0, y: 0, column: 0, row: 0 },
        projects: { x: 0, y: 100, column: 0, row: 1 },
        services: { x: 0, y: 200, column: 0, row: 2 },
        contact: { x: 0, y: 300, column: 0, row: 3 },
        about: { x: 100, y: 0, column: 1, row: 0 },
        resume: { x: 100, y: 100, column: 1, row: 1 }
      }
      
      this.icons.forEach(icon => {
        const defaultPos = defaultPositions[icon.id]
        if (defaultPos) {
          icon.x = defaultPos.x
          icon.y = defaultPos.y
          icon.column = defaultPos.column
          icon.row = defaultPos.row
        }
      })
      
      this.reorderIconsByPosition()
      this.saveIconPositions()
    }
  }
}
</script>

<style scoped>
.desktop-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
  z-index: 5;
  overflow: visible;
}

.desktop-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 8px 4px;
  cursor: grab;
  border-radius: 4px;
  user-select: none;
  will-change: transform;
  transition: none;
}

.desktop-icon:not(.dragging) {
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.desktop-icon.initial-load {
  transition: none !important;
}

.desktop-icon:active {
  cursor: grabbing;
}

.desktop-icon.dragging {
  cursor: grabbing;
  opacity: 0.8;
  z-index: 1000 !important;
  transition: none !important;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 8px;
  pointer-events: none;
}

.icon-label {
  color: white;
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  background: transparent;
  padding: 2px 4px;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}
</style>