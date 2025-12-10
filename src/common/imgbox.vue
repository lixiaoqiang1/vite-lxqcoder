<template>
  <div>
    <el-button type="primary" @click="showViewer = true">打开图片查看器</el-button>
    
    <li-imagebox
      v-model:visible="showViewer"
      :images="imageList"
      :initial-index="currentIndex"
      @close="handleClose"
      @change="handleImageChange"
    />
  </div>
</template>

<script>
// import { Imagebox } from 'your-package-name';

export default {
  components: {
    // Imagebox
  },
  data() {
    return {
      showViewer: false,
      currentIndex: 0,
      imageList: [
        {
          id: '1',
          url: 'https://acm-concr-front-api.bytebroad.com.cn/api/file/getObj?fileId=38b46a7242474dfa98b90455ffb36818&quot',
        },
        {
          id: '2',
          url: 'https://quchi.runjian.com/uploads/attach/2023/11/20231109/2eeaa430b21afd315f7054eac10a5f0e.jpg',
        },
        {
          id: '3',
          url: 'https://quchi.runjian.com/uploads/attach/2023/11/20231109/f1a11e33323b182832936de966b43eff.jpg',
        },
      ]
    };
  },
  methods: {
    handleClose() {
      console.log('查看器已关闭');
    },
    handleImageChange(index) {
      console.log('切换到图片:', index);
    }
  }
};
</script>