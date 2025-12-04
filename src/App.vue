<script setup></script>

<template>
	<MukButton size="large" type="primary">我是测试组件</MukButton>
	<!-- <Imagebox /> -->
	<Imagebox
      :images="imglist"
      :initial-index="0"
      thumbnail-width="200px"
      thumbnail-height="150px"
    />
	<!-- <Imagebox src="https://bytepiping-storage.bytebroad.com.cn/quchi/webImg/banner2.png" /> -->
</template>
<script lang="ts" >
const imglist=[
		{ url: 'https://maas-watermark-prod.cn-wlcb.ufileos.com/202512041239197de00f6324b149db_watermark.png?UCloudPublicKey=TOKEN_75a9ae85-4f15-4045-940f-e94c0f82ae90&Signature=xkCdUsFeWpluI%2FiJ0rNmMI1bpGM%3D&Expires=1764909566', alt: '图片1' },
		{ url: 'https://maas-watermark-prod.cn-wlcb.ufileos.com/2025120412391950ab1cca2f954058_watermark.png?UCloudPublicKey=TOKEN_75a9ae85-4f15-4045-940f-e94c0f82ae90&Signature=N2TOkY1Ygkn9QUmF1fH4xPjT%2F20%3D&Expires=1764909570', alt: '图片2' },
		{ url: 'https://maas-watermark-prod.cn-wlcb.ufileos.com/202512041239195f91b3f423d34177_watermark.png?UCloudPublicKey=TOKEN_75a9ae85-4f15-4045-940f-e94c0f82ae90&Signature=YwqjT8BZhuGftEIoER%2FKcY6T5gc%3D&Expires=1764909567', alt: '图片3' },
		{ url: 'https://maas-watermark-prod.cn-wlcb.ufileos.com/20251204123919294a0e3cf66044e2_watermark.png?UCloudPublicKey=TOKEN_75a9ae85-4f15-4045-940f-e94c0f82ae90&Signature=olB8pZuqU2oIKn8VoGQIkuwWMJ8%3D&Expires=1764909566', alt: '图片4' },
	]
import { reactive, onMounted, ref, onBeforeUnmount } from 'vue'
const state = reactive({
	
})
</script>

<style scoped></style>

