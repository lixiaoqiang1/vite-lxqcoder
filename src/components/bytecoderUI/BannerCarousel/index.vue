<template>
  <div class="ai-assistant-section">
    <!-- 轮播图 - 根据数组中的type字段判断是否显示轮播 -->
    <div v-if="hasCarouselItems">
      <el-carousel 
        height="744px" 
        indicator-position="none" 
        arrow="never" 
        ref="carousel"
        @change="handleCarouselChange"
      >
        <el-carousel-item 
          v-for="(item, index) in carouselList" 
          :key="index" 
          style="height: 100%" 
          arrow="always"
          :show-indicators="false"
        >
          <!-- 图片轮播项 -->
          <div 
            v-if="item.type === 'image'"
            class="carousel-item-content" 
            :style="{
              backgroundImage: `url('${item.bottomBannerImageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div class="introduction-area">
              <h1 class="title">{{ item.title }}</h1>
              <p class="description">{{ item.briefIntroduction }}</p>
              
              <!-- 统一的按钮区域 -->
              <div v-if="showButtons" class="btn-all">
                <!-- 优先使用轮播项自带的按钮 -->
                <div 
                  v-for="(btn, btnIndex) in getButtonsForItem(item)" 
                  :key="btnIndex"
                  class="knowbtn custom-btn"
                  :class="btn.className"
                  :style="btn.style"
                  @click="handleButtonClick(item, btn, btnIndex)"
                >
                  <div class="btn-text">{{ btn.text }}</div>
                  <i v-if="btn.icon" :class="btn.icon" class="btn-icon"></i>
                  <img v-else-if="btn.iconImg" :src="btn.iconImg" class="btn-icon-img" />
                  <i v-else class="el-icon-top-right btn-icon"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 视频轮播项 -->
          <div 
            v-else-if="item.type === 'video'"
            class="video-carousel-item"
          >
            <video 
              playsinline 
              autoplay 
              loop 
              muted 
              style="width: 100%; height: 100%; object-fit: cover"
            >
              <source :src="item.videoUrl || item.bottomBannerImageUrl" type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
            <div class="introduction-area">
              <h1 class="title">{{ item.title }}</h1>
              <p class="description">{{ item.briefIntroduction }}</p>
              
              <!-- 统一的按钮区域 -->
              <div v-if="showButtons" class="btn-all">
                <div 
                  v-for="(btn, btnIndex) in getButtonsForItem(item)" 
                  :key="btnIndex"
                  class="knowbtn custom-btn"
                  :class="btn.className"
                  :style="btn.style"
                  @click="handleButtonClick(item, btn, btnIndex)"
                >
                  <div class="btn-text">{{ btn.text }}</div>
                  <i v-if="btn.icon" :class="btn.icon" class="btn-icon"></i>
                  <img v-else-if="btn.iconImg" :src="btn.iconImg" class="btn-icon-img" />
                  <i v-else class="el-icon-top-right btn-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 单独的纯视频（当没有轮播项时显示） -->
    <div v-else-if="videoUrl" class="video-content">
      <video playsinline autoplay loop muted style="width: 100%; height: 744px; object-fit: cover">
        <source :src="videoUrl" type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
    </div>
    
    <!-- 自定义箭头 - 只在有轮播图时显示 -->
    <div 
      v-if="hasCarouselItems && prevArrow"
      class="custom-arrow custom-prev" 
      :class="{ 'active': isPrevActive }"
      @mousedown="setActive('prev', true)"
      @mouseup="setActive('prev', false)"
      @mouseleave="setActive('prev', false)"
      @touchstart="setActive('prev', true)"
      @touchend="setActive('prev', false)"
      @click="prevSlide"
    >
      <img :src="prevArrow" alt="左箭头" class="arrow-image" />
    </div>
    <div 
      v-if="hasCarouselItems && nextArrow"
      class="custom-arrow custom-next" 
      :class="{ 'active': isNextActive }"
      @mousedown="setActive('next', true)"
      @mouseup="setActive('next', false)"
      @mouseleave="setActive('next', false)"
      @touchstart="setActive('next', true)"
      @touchend="setActive('next', false)"
      @click="nextSlide"
    >
      <img :src="nextArrow" alt="右箭头" class="arrow-image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'li-banners',
  props: {
    carouselList: {
      type: Array,
      default: () => [],
      validator: (list) => {
        return list.every(item => {
          const hasValidType = ['image', 'video'].includes(item.type);
          const hasRequiredFields = item.title !== undefined && item.briefIntroduction !== undefined;
          const hasUrl = item.bottomBannerImageUrl || item.videoUrl;
          return hasValidType && hasRequiredFields && hasUrl;
        });
      }
    },
    videoUrl: {
      type: String,
      default: ''
    },
    prevArrow: {
      type: String,
      default: ''
    },
    nextArrow: {
      type: String,
      default: ''
    },
    customButtons: {
      type: Array,
      default: () => []
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hasCarouselItems() {
      return this.carouselList && this.carouselList.length > 0;
    }
  },
  data() {
    return {
      isNextActive: false,
      isPrevActive: false,
      currentIndex: 0
    }
  },
  methods: {
    // 获取当前轮播项的按钮配置
    getButtonsForItem(item) {
      // 优先使用轮播项自带的按钮
      if (item.buttons && item.buttons.length > 0) {
        return item.buttons;
      }
      // 否则使用全局自定义按钮
      return this.customButtons;
    },
    
    prevSlide() {
      if (this.$refs.carousel) {
        this.$refs.carousel.prev()
      }
    },
    
    nextSlide() {
      if (this.$refs.carousel) {
        this.$refs.carousel.next()
      }
    },
    
    setActive(arrow, isActive) {
      if (arrow === 'prev') {
        this.isPrevActive = isActive
      } else {
        this.isNextActive = isActive
      }
    },
    
    handleCarouselChange(index) {
      this.currentIndex = index
      this.$emit('change', index)
    },
    
    handleButtonClick(item, button, buttonIndex) {
      this.$emit('button-click', { 
        item, 
        button, 
        buttonIndex,
        currentIndex: this.currentIndex
      })
    },
    
    // 保留item-click事件用于图片项点击
    handleItemClick(row) {
      this.$emit('item-click', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-assistant-section {
  height: 744px;
  background-size: cover;
  position: relative;
  
  :deep(.el-carousel) {
    position: relative;
    height: 100%;
  }
  
  :deep(.el-carousel__arrow) {
    display: none;
  }
  
  :deep(.el-carousel__container) {
    height: 100%;
  }
  
  .custom-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    opacity: 0.5;
    border: 2px solid rgba(255, 255, 255, 0.50);
    background: linear-gradient(180deg, #F2F3F7 0%, #FEFEFE 100%);
    box-shadow: 
      -4px -2px 16px 0 #FFF, 
      4px 2px 24px 0 rgba(136, 154, 191, 0.20);
    cursor: pointer;
    z-index: 10;
    transition: all 0.15s ease;
    
    &.active {
      opacity: 1;
      border-radius: 100px;
      border: 2px solid rgba(255, 255, 255, 0.70);
      background: linear-gradient(180deg, #F2F3F7 0%, #FEFEFE 100%);
      box-shadow: -4px -2px 16px 0 #FFF, 4px 2px 24px 0 rgba(136, 154, 191, 0.20);
    }
    
    &:hover:not(.active) {
      opacity: 1;
      border-radius: 100px;
      border: 2px solid rgba(255, 255, 255, 0.70);
      background: linear-gradient(180deg, #F2F3F7 0%, #FEFEFE 100%);
      box-shadow: -4px -2px 16px 0 #FFF, 4px 2px 24px 0 rgba(136, 154, 191, 0.20);
    }
  }
  
  .custom-prev {
    left: 20px;
  }
  
  .custom-next {
    right: 20px;
  }
  
  .arrow-image {
    width: 14px;
    height: 14px;
    object-fit: contain;
    transition: filter 0.15s ease;
    
    .custom-arrow.active & {
      filter: brightness(0.50);
    }
  }

  .carousel-item-content,
  .video-carousel-item {
    width: 100%;
    margin: 0 auto;
    height: 100%;
    position: relative;
    
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .introduction-area {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-top: 212px;
      max-width: 1600px;
      margin: 0 auto;
      padding-left: 20px;
      padding-right: 20px;
      box-sizing: border-box;
      z-index: 2;

      .title {
        color: #000;
        font-family: "Alimama ShuHeiTi";
        font-size: 64px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        margin-bottom: 16px;
        max-width: 900px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .description {
        font-family: MiSans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0.8px;
        opacity: 0.9;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        margin-bottom: 64px;
        max-width: 900px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .btn-all {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        
        .knowbtn {
          display: flex;
          padding: 12px 20px 12px 24px;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          border-radius: 100px;
          background: linear-gradient(90deg, #1887F5 0%, #0F5EFF 50%, #5763FF 100%);
          box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
          height: 35px;
          min-width: 100px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            border-radius: 100px;
            background: linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), linear-gradient(90deg, #1887F5 0%, #0F5EFF 50%, #5763FF 100%);
            box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
            transform: translateY(-2px);
          }
          
          .btn-text {
            font-size: 18px;
            font-weight: 500;
            line-height: 28px;
            white-space: nowrap;
          }
          
          .btn-icon {
            margin-left: 10px;
            font-size: 14px;
          }
          
          .btn-icon-img {
            width: 14px;
            height: 14px;
            margin-left: 10px;
            object-fit: contain;
          }
        }
      }
    }
  }

  .video-content {
    height: 100%;
    
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .ai-assistant-section {
    height: 500px;
  }
  
  .carousel-item-content,
  .video-carousel-item {
    height: 500px !important;
  }
  
  .introduction-area {
    padding-top: 120px !important;
    padding-left: 40px !important;
    padding-right: 40px !important;
    
    .title {
      font-size: 36px !important;
    }
    
    .description {
      font-size: 16px !important;
    }
    
    .btn-all {
      flex-direction: column;
      align-items: flex-start;
      
      .knowbtn {
        width: 100% !important;
        justify-content: center;
      }
    }
  }
  
  .video-content video {
    height: 500px !important;
  }
  
  .custom-arrow {
    width: 36px !important;
    height: 36px !important;
  }
  
  .arrow-image {
    width: 10px !important;
    height: 10px !important;
  }
}
</style>