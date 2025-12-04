import Button from "./button/index.vue";
import Imagebox from "./image-box/index.vue";

// 按需引入
export { Button,Imagebox };

const component = [Button,Imagebox];

const coderUI = {
	install(App) {
		component.forEach((item) => {
			App.component(item.name, item);
		});
	},
};

export default coderUI;

