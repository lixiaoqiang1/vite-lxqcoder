import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import bytecoder from "./components/bytecoderUI"; //导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App);
app.use(bytecoder); //注册
app.use(ElementPlus)
app.mount("#app");