<template>
  <div id="app">
    <comButon />
	<hr />
	<comImgbox />
	<hr />
	<comMenu />
	<hr />
	<!-- <comBnaner /> -->
	<!-- <comBnaner
      :display-type="displayType"
      :carousel-list="carouselList"
      :video-url="videoUrl"
      :prev-arrow="prevArrow"
      :next-arrow="nextArrow"
      :custom-buttons="customButtons"
      :show-buttons="true"
      @item-click="handleItemClick"
      @button-click="handleButtonClick"
    /> -->
	<comBnaner />
  </div>
</template>

<script>
import comButon from './common/butonlist.vue'
import comImgbox from './common/imgbox.vue'
import comMenu from './common/menu.vue'
import comBnaner from './common/banners.vue'

export default {
  name: 'App',
  components:{
	comButon,
	comImgbox,
	comMenu,
	comBnaner
  },
  created(){},
  data(){
	    //         :style="{
        //       backgroundImage: `url('${item.bottomBannerImageUrl}')`,
        //       backgroundSize: 'cover',
        //       backgroundPosition: 'center',
        //     }"
        //   >
        //     <div class="introduction-area">
        //       <h1 class="title">{{ item.title }}</h1>
        //       <p class="description">{{ item.briefIntroduction }}</p>
	return{
		prevArrow: '',
      	nextArrow: '',
		displayType:'Y',
		carouselList:[
			{
				bottomBannerImageUrl:'https://acm-concr-front-api.bytebroad.com.cn/api/file/getObj?fileId=38b46a7242474dfa98b90455ffb36818&quot',
				title:'标题',
				briefIntroduction:'简介',
			},
			{
				bottomBannerImageUrl:'https://acm-concr-front-api.bytebroad.com.cn/api/file/getObj?fileId=38b46a7242474dfa98b90455ffb36818&quot',
				title:'标题',
				briefIntroduction:'简介',
			},
		],
		videoUrl:'Y',
		displayType:'Y',
	}
  },
  methods:{
	getNewDetail(row){
		console.log(row)
	}
  }
  

}
</script>
<style scoped>
#app{
	width: 100%;
}
.margin10{
	margin: 10px 0;
}
</style>