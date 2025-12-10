<template>
  <li-banners
    :carousel-list="carouselList"
    :video-url="videoUrl"
    :prev-arrow="prevArrow"
    :next-arrow="nextArrow"
    :custom-buttons="customButtons"
    :show-buttons="true"
    @item-click="handleItemClick"
    @button-click="handleButtonClick"
  />
</template>

<script>
export default {
  name: "banner",
  data() {
    return {
      prevArrow: "1",
      nextArrow: "2",
      videoUrl: "单独的视频URL（当没有轮播项时显示）",
      // 混合类型的轮播数组
      carouselList: [
        {
          type: "image",
          bottomBannerImageUrl: "https://acm-concr-front-api.bytebroad.com.cn/api/file/getObj?fileId=38b46a7242474dfa98b90455ffb36818&quot",
          title: "可信AI先进赋能平台",
          briefIntroduction: "从基础设施到行业应用领域，为您提供完善智能体应用，助力您的业务腾飞",
          buttonType: "1" // 可选：旧版按钮类型
        },
        {
          type: "video",
          videoUrl: "https://bytepiping-storage.bytebroad.com.cn/quchi/webImg/bannerVal2.webm", // 专门用于视频的URL
          // bottomBannerImageUrl也可以用于视频（向后兼容）
          bottomBannerImageUrl: "https://example.com/video1.mp4",
          title: "视频标题",
          briefIntroduction: "视频简介",
          buttons: [ // 自定义按钮（仅对该项生效）
            {
              text: "了解详情",
              icon: "el-icon-video-play"
            }
          ]
        },
      ],
    };
  },
  methods: {
    handleItemClick(row) {
      console.log('item clicked:', row);
    },
    handleButtonClick(row) {
      console.log('button clicked:', row);
    }
  }
};
</script>