import Button from "./button/index.vue";
import Imagebox from "./Imagebox/index.vue";
import 	Menu from "./menu/index.vue";
import 	BannerCarousel from "./BannerCarousel/index.vue";

// 按需引入
export { Button,Imagebox,Menu,BannerCarousel };

const component = [Button,Imagebox,Menu,BannerCarousel];

const coderUI = {
	install(App) {
		component.forEach((item) => {
			App.component(item.name, item);
		});
	},
};

export default coderUI;

