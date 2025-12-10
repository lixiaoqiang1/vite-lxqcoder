<template>
  <div v-if="state.visible" class="bytecoder-image-viewer">
    <div class="imgContainer">
      <div class="imgInner">
        <!-- Left controls -->
        <div class="leftControls">
          <div class="closeBtn itembtn" @click="closeViewer">
            <svg
              class="iconsize"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style="width: 18px; height: 18px;"
            >
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="navControls">
            <div class="navBtn itembtn" @click="prev" style="margin-bottom: 12px;">
              <svg
                class="iconsize"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="width: 18px; height: 18px;"
              >
                <path d="M12 19L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="navBtn itembtn" @click="next">
              <svg
                class="iconsize"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="width: 18px; height: 18px;"
              >
                <path d="M12 5L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Main image -->
        <div class="mainImage incolor">
          <img 
            :src="state.imageUrl" 
            :alt="`Image ${state.currentIndex + 1}`" 
            ref="mainImage" 
            @load="onImageLoad"
            @error="onImageError"
          />
          <div v-if="state.loading" class="image-loading">
            <div class="loading-spinner"></div>
          </div>
        </div>
        
        <!-- Right thumbnails -->
        <div class="rightThumbnails incolor">
          <div class="thumbnailGrid">
            <div 
              class="thumbnailItem" 
              v-for="(item, index) in state.images" 
              :key="getImageKey(item, index)"
              @click="selectImage(index)"
              :class="{ active: state.currentIndex === index }"
            >
              <img 
                :src="item.url || item" 
                :alt="`Thumbnail ${index + 1}`"
                @error="onThumbnailError(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "li-imagebox",
  props: {
    // 图片列表，支持字符串数组或对象数组
    images: {
      type: Array,
      default: () => []
    },
    // 初始显示图片的索引
    initialIndex: {
      type: Number,
      default: 0
    },
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 是否显示缩略图
    showThumbnails: {
      type: Boolean,
      default: true
    },
    // 是否支持键盘导航
    keyboardNavigation: {
      type: Boolean,
      default: true
    },
    // 是否支持鼠标滚轮切换
    wheelNavigation: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:visible', 'close', 'change', 'error'],
  data() {
    return {
      state: {
        visible: false,
        images: [],
        currentIndex: 0,
        imageUrl: '',
        loading: false,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        this.state.visible = newVal;
        if (newVal) {
          this.initViewer();
          this.addEventListeners();
        } else {
          this.removeEventListeners();
        }
      }
    },
    images: {
      immediate: true,
      handler(newVal) {
        this.state.images = this.normalizeImages(newVal);
      }
    },
    initialIndex: {
      immediate: true,
      handler(newVal) {
        this.state.currentIndex = Math.max(0, Math.min(newVal, this.state.images.length - 1));
      }
    },
    'state.currentIndex'(newIndex) {
      this.loadCurrentImage();
      this.$emit('change', newIndex);
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    this.removeEventListeners();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 初始化查看器
    initViewer() {
      if (this.state.images.length > 0) {
        this.state.currentIndex = Math.max(0, Math.min(this.initialIndex, this.state.images.length - 1));
        this.loadCurrentImage();
      }
    },
    
    // 标准化图片数据
    normalizeImages(images) {
      if (!Array.isArray(images)) return [];
      
      return images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: `img-${index}`,
            url: img,
            name: `Image ${index + 1}`
          };
        }
        return {
          id: img.id || `img-${index}`,
          url: img.url || img.src || '',
          name: img.name || `Image ${index + 1}`,
          ...img
        };
      });
    },
    
    // 获取图片key
    getImageKey(item, index) {
      return item.id || `thumbnail-${index}`;
    },
    
    // 加载当前图片
    loadCurrentImage() {
      if (this.state.images.length === 0) return;
      
      const image = this.state.images[this.state.currentIndex];
      if (!image) return;
      
      this.state.loading = true;
      this.state.imageUrl = image.url || image;
      
      // 预加载下一张图片
      this.preloadNextImage();
    },
    
    // 预加载下一张图片
    preloadNextImage() {
      const nextIndex = (this.state.currentIndex + 1) % this.state.images.length;
      if (this.state.images[nextIndex]) {
        const nextImage = this.state.images[nextIndex];
        const img = new Image();
        img.src = nextImage.url || nextImage;
      }
    },
    
    // 图片加载完成
    onImageLoad() {
      this.state.loading = false;
    },
    
    // 图片加载失败
    onImageError() {
      this.state.loading = false;
      this.$emit('error', {
        type: 'load',
        index: this.state.currentIndex,
        image: this.state.images[this.state.currentIndex]
      });
    },
    
    // 缩略图加载失败
    onThumbnailError(index) {
      this.$emit('error', {
        type: 'thumbnail',
        index,
        image: this.state.images[index]
      });
    },
    
    // 选择图片
    selectImage(index) {
      if (index >= 0 && index < this.state.images.length) {
        this.state.currentIndex = index;
      }
    },
    
    // 上一张
    prev() {
      if (this.state.images.length === 0) return;
      
      if (this.state.currentIndex > 0) {
        this.state.currentIndex--;
      } else {
        this.state.currentIndex = this.state.images.length - 1;
      }
    },
    
    // 下一张
    next() {
      if (this.state.images.length === 0) return;
      
      if (this.state.currentIndex < this.state.images.length - 1) {
        this.state.currentIndex++;
      } else {
        this.state.currentIndex = 0;
      }
    },
    
    // 关闭查看器
    closeViewer() {
      this.state.visible = false;
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    
    // 下载图片
    async downloadImage() {
      if (!this.state.imageUrl) return;
      
      try {
        const response = await fetch(this.state.imageUrl);
        if (!response.ok) throw new Error('图片下载失败');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const image = this.state.images[this.state.currentIndex];
        const fileName = image.name || image.filename || 'image';
        const extension = this.getImageExtension(image.url || image);
        
        link.href = url;
        link.download = `${fileName}.${extension}`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('下载错误:', error);
        this.$emit('error', {
          type: 'download',
          index: this.state.currentIndex,
          image: this.state.images[this.state.currentIndex],
          error: error.message
        });
      }
    },
    
    // 获取图片扩展名
    getImageExtension(url) {
      if (!url) return 'png';
      const match = url.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
      return match ? match[1] : 'png';
    },
    
    // 处理窗口大小变化
    handleResize() {
      this.state.windowWidth = window.innerWidth;
      this.state.windowHeight = window.innerHeight;
    },
    
    // 键盘事件处理
    handleKeydown(event) {
      if (!this.state.visible || !this.keyboardNavigation) return;
      
      switch (event.key) {
        case 'Escape':
          this.closeViewer();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          this.prev();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          this.next();
          break;
      }
    },
    
    // 鼠标滚轮事件
    handleWheel(event) {
      if (!this.state.visible || !this.wheelNavigation) return;
      
      event.preventDefault();
      if (event.deltaY > 0) {
        this.next();
      } else {
        this.prev();
      }
    },
    
    // 添加事件监听
    addEventListeners() {
      if (this.keyboardNavigation) {
        document.addEventListener('keydown', this.handleKeydown);
      }
      if (this.wheelNavigation) {
        document.addEventListener('wheel', this.handleWheel, { passive: false });
      }
    },
    
    // 移除事件监听
    removeEventListeners() {
      document.removeEventListener('keydown', this.handleKeydown);
      document.removeEventListener('wheel', this.handleWheel);
    }
  }
};
</script>

<style scoped>
.bytecoder-image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.imgContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(14, 15, 20, 0.85);
  z-index: 99;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.imgContainer *:focus {
  outline: none;
}

.imgInner {
  width: min(1182px, 96vw);
  height: min(828px, 96vh);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 1024px) {
  .imgInner {
    flex-direction: row;
    gap: 24px;
  }
}

.leftControls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  order: 1;
}

@media (min-width: 1024px) {
  .leftControls {
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    order: 0;
  }
}

.iconsize {
  width: 18px;
  height: 18px;
}

.closeBtn {
  width: 36px;
  height: 36px;
}

.navControls {
  display: flex;
  gap: 12px;
}

@media (min-width: 1024px) {
  .navControls {
    flex-direction: column;
    gap: 12px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    height: fit-content;
  }
}

.navBtn {
  width: 36px;
  height: 36px;
  margin-bottom: 0 !important;
}

.mainImage {
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  order: 2;
  position: relative;
}

.mainImage img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  user-select: none;
  -webkit-user-drag: none;
  object-fit: contain;
}

@media (min-width: 1024px) {
  .mainImage {
    order: 1;
  }
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.incolor {
  background: rgba(255, 255, 255, 1);
  padding: 16px;
  border-radius: 24px;
}

.rightThumbnails {
  width: 100%;
  order: 3;
}

@media (min-width: 1024px) {
  .rightThumbnails {
    width: 294px;
    order: 2;
  }
}

.thumbnailGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
}

@media (min-width: 1024px) {
  .thumbnailGrid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
}

.thumbnailItem {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
}

.thumbnailItem:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.thumbnailItem:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.thumbnailItem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnailItem.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  background-blend-mode: overlay;
}

.itembtn {
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
}

.itembtn:hover {
  background: rgba(133, 137, 155, 0.2);
  transform: scale(1.05);
}

.itembtn:active {
  transform: scale(0.98);
}
</style>