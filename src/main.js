import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { BannerCarousel,Menu } from 'bytecoderui1';
import 'bytecoderui1/bytecoderUI1.css'; // 引入全局样式

const app = createApp(App);
// 使用路由
app.use(router);
// 注册组件库

// 使用Element Plus
app.use(ElementPlus);

//按需引入组件库
app.component('li-menu', Menu);
app.component('li-banners', BannerCarousel);

app.mount("#app");