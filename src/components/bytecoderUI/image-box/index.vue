<template>
  <div class="lxq-image-preview-container">
    <!-- 缩略图触发器 -->
    <div class="lxq-image-thumbnail-trigger" @click="openPreview">
      <slot name="trigger" :image="currentImage">
        <img 
          v-if="thumbnailSrc" 
          :src="thumbnailSrc" 
          :alt="altText"
          class="lxq-thumbnail"
          :style="{
            width: thumbnailWidth,
            height: thumbnailHeight,
            objectFit: thumbnailFit,
            borderRadius: thumbnailBorderRadius
          }"
        />
        <div v-else class="lxq-placeholder">
          <slot name="placeholder">
            <div class="lxq-default-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>{{ placeholderText }}</span>
            </div>
          </slot>
        </div>
      </slot>
    </div>

    <!-- 预览模态框 -->
    <teleport to="body" v-if="showPreview">
      <div class="lxq-imgContainer">
        <div class="lxq-imgInner">
          <!-- Left controls -->
          <div class="lxq-leftControls">
            <div class="lxq-closeBtn lxq-itembtn" @click="closePreview">
              <svg class="lxq-iconsize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <div class="lxq-navControls">
              <div class="lxq-navBtn lxq-itembtn" @click="prev" style="margin-bottom: 12px;">
                <svg class="lxq-iconsize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </div>
              <div class="lxq-navBtn lxq-itembtn" @click="next">
                <svg class="lxq-iconsize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Main image -->
          <div class="lxq-mainImage lxq-incolor">
            <img 
              :src="state.ImageUrl" 
              :alt="currentAltText" 
              ref="mainImage"
              :style="{ maxWidth: `${mainImageMaxWidth}%`, maxHeight: `${mainImageMaxHeight}%` }"
              @click="toggleZoom"
              class="lxq-preview-img"
            />
            
            <!-- 缩放指示器 -->
            <!-- <div v-if="showZoomControls" class="lxq-zoom-controls">
              <button class="lxq-zoom-btn lxq-itembtn" @click="zoomOut" :disabled="zoom <= 0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="lxq-zoom-percentage">{{ Math.round(zoom * 100) }}%</span>
              <button class="lxq-zoom-btn lxq-itembtn" @click="zoomIn" :disabled="zoom >= 3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div> -->
          </div>
          
          <!-- Right thumbnails -->
          <div class="lxq-rightThumbnails lxq-incolor">
            <div class="lxq-thumbnailGrid">
              <div 
                class="lxq-thumbnailItem" 
                v-for="(item, index) in state.imglist" 
                :key="getItemKey(item, index)"
                @click="selectImage(index)"
                :class="{ active: state.index === index }"
              >
                <img :src="item.url" :alt="item.alt || `Thumbnail ${index + 1}`" />
              </div>
            </div>
            
            <!-- 底部操作栏 -->
            <!-- <div class="lxq-action-bar">
              <button class="lxq-action-btn" @click="downloadImage" :title="downloadTitle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>下载</span>
              </button>
              <div class="lxq-counter">
                {{ state.index + 1 }} / {{ state.imglist.length }}
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch, nextTick } from 'vue'

export default defineComponent({
  name: 'LxqImageBox',
  
  props: {
    // 图片列表
    images: {
      type: Array,
      default: () => [],
      validator: (value: any[]) => {
        return value.every(item => item.url && typeof item.url === 'string')
      }
    },
    
    // 当前显示的图片索引
    initialIndex: {
      type: Number,
      default: 0,
      validator: (value: number) => value >= 0
    },
    
    // 单图模式（如果只需要显示一张图片）
    src: {
      type: String,
      default: ''
    },
    
    // 缩略图属性
    thumbnailSrc: {
      type: String,
      default: ''
    },
    
    thumbnailWidth: {
      type: String,
      default: '200px'
    },
    
    thumbnailHeight: {
      type: String,
      default: '150px'
    },
    
    thumbnailFit: {
      type: String,
      default: 'cover',
      validator: (value: string) => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
    },
    
    thumbnailBorderRadius: {
      type: String,
      default: '4px'
    },
    
    // 文本属性
    altText: {
      type: String,
      default: '图片'
    },
    
    placeholderText: {
      type: String,
      default: '点击预览图片'
    },
    
    downloadTitle: {
      type: String,
      default: '下载当前图片'
    },
    
    // 预览配置
    mainImageMaxWidth: {
      type: Number,
      default: 90
    },
    
    mainImageMaxHeight: {
      type: Number,
      default: 85
    },
    
    showZoomControls: {
      type: Boolean,
      default: true
    },
    
    // 是否显示预览框
    modelValue: {
      type: Boolean,
      default: false
    },
    
    // 是否可下载
    downloadable: {
      type: Boolean,
      default: true
    }
  },
  
  emits: [
    'update:modelValue',
    'close',
    'change',
    'download',
    'prev',
    'next',
    'error'
  ],
  
  setup(props, { emit }) {
    const showPreview = ref(props.modelValue)
    const mainImage = ref<HTMLImageElement | null>(null)
    const zoom = ref(1)
    
    const state = reactive({
      imglist: [] as any[],
      index: 0,
      ImageUrl: ''
    })
    
    // 计算属性
    const currentImage = computed(() => {
      return state.imglist[state.index] || {}
    })
    
    const currentAltText = computed(() => {
      return currentImage.value.alt || props.altText || `图片 ${state.index + 1}`
    })
    
    const triggerSrc = computed(() => {
      return props.thumbnailSrc || props.src || (props.images[0]?.url || '')
    })
    
    // 初始化图片列表
    const initImageList = () => {
      if (props.images && props.images.length > 0) {
        state.imglist = props.images.map((img, index) => ({
          id: img.id || index,
          url: img.url,
          alt: img.alt || props.altText,
          ...img
        }))
      } else if (props.src) {
        state.imglist = [{
          id: 0,
          url: props.src,
          alt: props.altText
        }]
      }
      
      state.index = Math.min(props.initialIndex, state.imglist.length - 1)
      state.ImageUrl = state.imglist[state.index]?.url || ''
    }
    
    // 监听 props 变化
    watch(() => props.images, initImageList, { deep: true, immediate: true })
    watch(() => props.src, initImageList, { immediate: true })
    watch(() => props.initialIndex, (newIndex) => {
      state.index = Math.min(newIndex, state.imglist.length - 1)
      state.ImageUrl = state.imglist[state.index]?.url || ''
    })
    
    // 监听 modelValue
    watch(() => props.modelValue, (value) => {
      showPreview.value = value
      if (value) {
        initImageList()
      }
    })
    
    watch(showPreview, (value) => {
      emit('update:modelValue', value)
      if (!value) {
        emit('close')
      }
    })
    
    // 方法
    const openPreview = () => {
      initImageList()
      showPreview.value = true
      zoom.value = 1
    }
    
    const closePreview = () => {
      showPreview.value = false
      zoom.value = 1
    }
    
    const selectImage = (index: number) => {
      if (index >= 0 && index < state.imglist.length) {
        state.index = index
        state.ImageUrl = state.imglist[index].url
        emit('change', index, state.imglist[index])
      }
    }
    
    const prev = () => {
      if (state.index > 0) {
        const newIndex = state.index - 1
        selectImage(newIndex)
        emit('prev', newIndex, state.imglist[newIndex])
      }
    }
    
    const next = () => {
      if (state.index < state.imglist.length - 1) {
        const newIndex = state.index + 1
        selectImage(newIndex)
        emit('next', newIndex, state.imglist[newIndex])
      }
    }
    
    const downloadImage = async () => {
      if (!props.downloadable) return
      
      try {
        const response = await fetch(state.ImageUrl)
        if (!response.ok) throw new Error('图片下载失败')
        
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        const filename = currentImage.value.filename || 
                        `image-${state.index + 1}.${getFileExtension(state.ImageUrl)}`
        link.download = filename
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        emit('download', state.ImageUrl, filename)
      } catch (error) {
        console.error('下载错误:', error)
        emit('error', 'download', error)
      }
    }
    
    const getFileExtension = (url: string): string => {
      const match = url.match(/\.([^.?#]+)(?:\?|$|#)/)
      return match ? match[1].toLowerCase() : 'png'
    }
    
    const getItemKey = (item: any, index: number): string | number => {
      return item.id || item.url || index
    }
    
    const toggleZoom = () => {
      if (zoom.value === 1) {
        zoom.value = 2
      } else {
        zoom.value = 1
      }
    }
    
    const zoomIn = () => {
      if (zoom.value < 3) {
        zoom.value = Math.min(zoom.value + 0.25, 3)
      }
    }
    
    const zoomOut = () => {
      if (zoom.value > 0.5) {
        zoom.value = Math.max(zoom.value - 0.25, 0.5)
      }
    }
    
    // 键盘事件处理
    const handleKeydown = (event: KeyboardEvent) => {
      if (!showPreview.value) return
      
      switch (event.key) {
        case 'Escape':
          closePreview()
          break
        case 'ArrowLeft':
          prev()
          break
        case 'ArrowRight':
          next()
          break
        case '+':
        case '=':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            zoomIn()
          }
          break
        case '-':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            zoomOut()
          }
          break
        case '0':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            zoom.value = 1
          }
          break
      }
    }
    
    // 添加键盘事件监听
    const addKeyboardListeners = () => {
      document.addEventListener('keydown', handleKeydown)
    }
    
    const removeKeyboardListeners = () => {
      document.removeEventListener('keydown', handleKeydown)
    }
    
    // 监听预览框显示/隐藏
    watch(showPreview, (value) => {
      if (value) {
        addKeyboardListeners()
      } else {
        removeKeyboardListeners()
      }
    })
    
    return {
      showPreview,
      mainImage,
      zoom,
      state,
      currentImage,
      currentAltText,
      triggerSrc,
      openPreview,
      closePreview,
      selectImage,
      prev,
      next,
      downloadImage,
      getItemKey,
      toggleZoom,
      zoomIn,
      zoomOut
    }
  }
})
</script>

<style scoped lang="scss">
.lxq-image-preview-container {
  display: inline-block;
}

.lxq-image-thumbnail-trigger {
  cursor: pointer;
  display: inline-block;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
}

.lxq-thumbnail {
  display: block;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
}

.lxq-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  background-color: #f5f7fa;
  color: #909399;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #409eff;
    color: #409eff;
  }
}

.lxq-default-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  span {
    font-size: 14px;
  }
}

.lxq-imgContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(14, 15, 20, 0.85);
  backdrop-filter: blur(4px);
  z-index: 9999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  animation: lxq-fade-in 0.2s ease;

  *:focus {
    outline: none;
  }

  .lxq-imgInner {
    width: min(1182px, 96vw);
    height: min(828px, 96vh);
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 1024px) {
      flex-direction: row;
      gap: 24px;
    }
  }
}

@keyframes lxq-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lxq-leftControls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  order: 1;

  @media (min-width: 1024px) {
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    order: 0;
  }

  .lxq-iconsize {
    width: 18px;
    height: 18px;
  }

  .lxq-closeBtn {
    width: 36px;
    height: 36px;
  }
  
  .lxq-navControls {
    display: flex;
    gap: 12px;

    @media (min-width: 1024px) {
      flex-direction: column;
      gap: 12px;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      height: fit-content;
    }

    .lxq-navBtn {
      width: 36px;
      height: 36px;
      margin-bottom: 0 !important;
    }
  }
}

.lxq-mainImage {
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  order: 2;
  position: relative;
  overflow: hidden;
  
  .lxq-preview-img {
    border-radius: 12px;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform 0.2s ease;
    cursor: zoom-in;
    
    &.zoomed {
      cursor: zoom-out;
    }
  }

  @media (min-width: 1024px) {
    order: 1;
  }
}

.lxq-incolor {
  background: rgba(255, 255, 255, 1);
  padding: 16px;
  border-radius: 24px;
}

.lxq-rightThumbnails {
  width: 100%;
  order: 3;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    width: 294px;
    order: 2;
  }

  .lxq-thumbnailGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
    }

    .lxq-thumbnailItem {
      aspect-ratio: 1;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
      border-radius: 8px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s ease;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        img {
          transform: scale(1.05);
        }
      }
      
      &.active {
        border: 2px solid #409eff;
        box-shadow: 0 0 0 1px #409eff;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(64, 158, 255, 0.1);
        }
      }
    }
  }
  
  .lxq-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    
    .lxq-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f5f7fa;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      color: #606266;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #409eff;
        border-color: #409eff;
        color: white;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .lxq-counter {
      font-size: 14px;
      color: #909399;
      font-weight: 500;
    }
  }
}

.lxq-itembtn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  border: 1px solid rgba(234, 235, 240, 0.1);
  background: rgba(215, 223, 254, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(133, 137, 155, 0.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
}

.lxq-zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  
  .lxq-zoom-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
  
  .lxq-zoom-percentage {
    color: white;
    font-size: 12px;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .lxq-imgContainer {
    padding: 10px;
  }
  
  .lxq-imgInner {
    width: 100% !important;
    height: 100% !important;
    gap: 12px !important;
  }
  
  .lxq-leftControls {
    flex-direction: row !important;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    
    .lxq-navControls {
      position: static;
      flex-direction: row;
    }
  }
  
  .lxq-rightThumbnails {
    height: 120px;
    overflow-x: auto;
    overflow-y: hidden;
    
    .lxq-thumbnailGrid {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 8px;
      
      .lxq-thumbnailItem {
        flex: 0 0 80px;
        margin-right: 8px;
      }
    }
  }
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>