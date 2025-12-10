import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, ref, renderList, renderSlot, resolveComponent, toDisplayString, unref, withCtx } from "vue";
var __plugin_vue_export_helper_default = (s, I) => {
	let L = s.__vccOpts || s;
	for (let [s, R] of I) L[s] = R;
	return L;
}, button_default = /* @__PURE__ */ __plugin_vue_export_helper_default(/* @__PURE__ */ Object.assign({ name: "li-button" }, {
	props: {
		size: {
			type: String,
			default: "middle"
		},
		type: {
			type: String,
			default: "default"
		}
	},
	setup(s) {
		return (L, R) => {
			let z = resolveComponent("el-button");
			return openBlock(), createBlock(z, {
				size: s.size,
				type: s.type
			}, {
				default: withCtx(() => [renderSlot(L.$slots, "default", {}, void 0, !0)]),
				_: 3
			}, 8, ["size", "type"]);
		};
	}
}), [["__scopeId", "data-v-48def249"]]), _sfc_main$1 = {
	name: "li-imagebox",
	props: {
		images: {
			type: Array,
			default: () => []
		},
		initialIndex: {
			type: Number,
			default: 0
		},
		visible: {
			type: Boolean,
			default: !1
		},
		showThumbnails: {
			type: Boolean,
			default: !0
		},
		keyboardNavigation: {
			type: Boolean,
			default: !0
		},
		wheelNavigation: {
			type: Boolean,
			default: !0
		}
	},
	emits: [
		"update:visible",
		"close",
		"change",
		"error"
	],
	data() {
		return { state: {
			visible: !1,
			images: [],
			currentIndex: 0,
			imageUrl: "",
			loading: !1,
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		} };
	},
	watch: {
		visible: {
			immediate: !0,
			handler(s) {
				this.state.visible = s, s ? (this.initViewer(), this.addEventListeners()) : this.removeEventListeners();
			}
		},
		images: {
			immediate: !0,
			handler(s) {
				this.state.images = this.normalizeImages(s);
			}
		},
		initialIndex: {
			immediate: !0,
			handler(s) {
				this.state.currentIndex = Math.max(0, Math.min(s, this.state.images.length - 1));
			}
		},
		"state.currentIndex"(s) {
			this.loadCurrentImage(), this.$emit("change", s);
		}
	},
	mounted() {
		this.handleResize(), window.addEventListener("resize", this.handleResize);
	},
	beforeUnmount() {
		this.removeEventListeners(), window.removeEventListener("resize", this.handleResize);
	},
	methods: {
		initViewer() {
			this.state.images.length > 0 && (this.state.currentIndex = Math.max(0, Math.min(this.initialIndex, this.state.images.length - 1)), this.loadCurrentImage());
		},
		normalizeImages(s) {
			return Array.isArray(s) ? s.map((s, I) => typeof s == "string" ? {
				id: `img-${I}`,
				url: s,
				name: `Image ${I + 1}`
			} : {
				id: s.id || `img-${I}`,
				url: s.url || s.src || "",
				name: s.name || `Image ${I + 1}`,
				...s
			}) : [];
		},
		getImageKey(s, I) {
			return s.id || `thumbnail-${I}`;
		},
		loadCurrentImage() {
			if (this.state.images.length === 0) return;
			let s = this.state.images[this.state.currentIndex];
			s && (this.state.loading = !0, this.state.imageUrl = s.url || s, this.preloadNextImage());
		},
		preloadNextImage() {
			let s = (this.state.currentIndex + 1) % this.state.images.length;
			if (this.state.images[s]) {
				let I = this.state.images[s], L = new Image();
				L.src = I.url || I;
			}
		},
		onImageLoad() {
			this.state.loading = !1;
		},
		onImageError() {
			this.state.loading = !1, this.$emit("error", {
				type: "load",
				index: this.state.currentIndex,
				image: this.state.images[this.state.currentIndex]
			});
		},
		onThumbnailError(s) {
			this.$emit("error", {
				type: "thumbnail",
				index: s,
				image: this.state.images[s]
			});
		},
		selectImage(s) {
			s >= 0 && s < this.state.images.length && (this.state.currentIndex = s);
		},
		prev() {
			this.state.images.length !== 0 && (this.state.currentIndex > 0 ? this.state.currentIndex-- : this.state.currentIndex = this.state.images.length - 1);
		},
		next() {
			this.state.images.length !== 0 && (this.state.currentIndex < this.state.images.length - 1 ? this.state.currentIndex++ : this.state.currentIndex = 0);
		},
		closeViewer() {
			this.state.visible = !1, this.$emit("update:visible", !1), this.$emit("close");
		},
		async downloadImage() {
			if (this.state.imageUrl) try {
				let s = await fetch(this.state.imageUrl);
				if (!s.ok) throw Error("图片下载失败");
				let I = await s.blob(), L = URL.createObjectURL(I), R = document.createElement("a"), z = this.state.images[this.state.currentIndex], B = z.name || z.filename || "image", V = this.getImageExtension(z.url || z);
				R.href = L, R.download = `${B}.${V}`, R.style.display = "none", document.body.appendChild(R), R.click(), document.body.removeChild(R), URL.revokeObjectURL(L);
			} catch (s) {
				console.error("下载错误:", s), this.$emit("error", {
					type: "download",
					index: this.state.currentIndex,
					image: this.state.images[this.state.currentIndex],
					error: s.message
				});
			}
		},
		getImageExtension(s) {
			if (!s) return "png";
			let I = s.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
			return I ? I[1] : "png";
		},
		handleResize() {
			this.state.windowWidth = window.innerWidth, this.state.windowHeight = window.innerHeight;
		},
		handleKeydown(s) {
			if (!(!this.state.visible || !this.keyboardNavigation)) switch (s.key) {
				case "Escape":
					this.closeViewer();
					break;
				case "ArrowLeft":
				case "ArrowUp":
					s.preventDefault(), this.prev();
					break;
				case "ArrowRight":
				case "ArrowDown":
					s.preventDefault(), this.next();
					break;
			}
		},
		handleWheel(s) {
			!this.state.visible || !this.wheelNavigation || (s.preventDefault(), s.deltaY > 0 ? this.next() : this.prev());
		},
		addEventListeners() {
			this.keyboardNavigation && document.addEventListener("keydown", this.handleKeydown), this.wheelNavigation && document.addEventListener("wheel", this.handleWheel, { passive: !1 });
		},
		removeEventListeners() {
			document.removeEventListener("keydown", this.handleKeydown), document.removeEventListener("wheel", this.handleWheel);
		}
	}
}, _hoisted_1$1 = {
	key: 0,
	class: "bytecoder-image-viewer"
}, _hoisted_2$1 = { class: "imgContainer" }, _hoisted_3$1 = { class: "imgInner" }, _hoisted_4$1 = { class: "leftControls" }, _hoisted_5$1 = {
	class: "iconsize",
	viewBox: "0 0 24 24",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	style: {
		width: "18px",
		height: "18px"
	}
}, _hoisted_6$1 = { class: "navControls" }, _hoisted_7$1 = {
	class: "iconsize",
	viewBox: "0 0 24 24",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	style: {
		width: "18px",
		height: "18px"
	}
}, _hoisted_8$1 = {
	class: "iconsize",
	viewBox: "0 0 24 24",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	style: {
		width: "18px",
		height: "18px"
	}
}, _hoisted_9$1 = { class: "mainImage incolor" }, _hoisted_10$1 = ["src", "alt"], _hoisted_11$1 = {
	key: 0,
	class: "image-loading"
}, _hoisted_12$1 = { class: "rightThumbnails incolor" }, _hoisted_13$1 = { class: "thumbnailGrid" }, _hoisted_14$1 = ["onClick"], _hoisted_15$1 = [
	"src",
	"alt",
	"onError"
];
function _sfc_render$1(I, B, V, H, W, G) {
	return W.state.visible ? (openBlock(), createElementBlock("div", _hoisted_1$1, [createElementVNode("div", _hoisted_2$1, [createElementVNode("div", _hoisted_3$1, [
		createElementVNode("div", _hoisted_4$1, [createElementVNode("div", {
			class: "closeBtn itembtn",
			onClick: B[0] ||= (...s) => G.closeViewer && G.closeViewer(...s)
		}, [(openBlock(), createElementBlock("svg", _hoisted_5$1, [...B[5] ||= [createElementVNode("path", {
			d: "M18 6L6 18",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}, null, -1), createElementVNode("path", {
			d: "M6 6L18 18",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}, null, -1)]]))]), createElementVNode("div", _hoisted_6$1, [createElementVNode("div", {
			class: "navBtn itembtn",
			onClick: B[1] ||= (...s) => G.prev && G.prev(...s),
			style: { "margin-bottom": "12px" }
		}, [(openBlock(), createElementBlock("svg", _hoisted_7$1, [...B[6] ||= [createElementVNode("path", {
			d: "M12 19L12 5",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}, null, -1), createElementVNode("path", {
			d: "M5 12L12 5L19 12",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}, null, -1)]]))]), createElementVNode("div", {
			class: "navBtn itembtn",
			onClick: B[2] ||= (...s) => G.next && G.next(...s)
		}, [(openBlock(), createElementBlock("svg", _hoisted_8$1, [...B[7] ||= [createElementVNode("path", {
			d: "M12 5L12 19",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}, null, -1), createElementVNode("path", {
			d: "M19 12L12 19L5 12",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}, null, -1)]]))])])]),
		createElementVNode("div", _hoisted_9$1, [createElementVNode("img", {
			src: W.state.imageUrl,
			alt: `Image ${W.state.currentIndex + 1}`,
			ref: "mainImage",
			onLoad: B[3] ||= (...s) => G.onImageLoad && G.onImageLoad(...s),
			onError: B[4] ||= (...s) => G.onImageError && G.onImageError(...s)
		}, null, 40, _hoisted_10$1), W.state.loading ? (openBlock(), createElementBlock("div", _hoisted_11$1, [...B[8] ||= [createElementVNode("div", { class: "loading-spinner" }, null, -1)]])) : createCommentVNode("", !0)]),
		createElementVNode("div", _hoisted_12$1, [createElementVNode("div", _hoisted_13$1, [(openBlock(!0), createElementBlock(Fragment, null, renderList(W.state.images, (s, I) => (openBlock(), createElementBlock("div", {
			class: normalizeClass(["thumbnailItem", { active: W.state.currentIndex === I }]),
			key: G.getImageKey(s, I),
			onClick: (s) => G.selectImage(I)
		}, [createElementVNode("img", {
			src: s.url || s,
			alt: `Thumbnail ${I + 1}`,
			onError: (s) => G.onThumbnailError(I)
		}, null, 40, _hoisted_15$1)], 10, _hoisted_14$1))), 128))])])
	])])])) : createCommentVNode("", !0);
}
var Imagebox_default = /* @__PURE__ */ __plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-1f51462f"]]), document_default = /* @__PURE__ */ defineComponent({
	name: "Document",
	__name: "document",
	setup(s) {
		return (s, I) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createElementVNode("path", {
			fill: "currentColor",
			d: "M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h160v64H320zm0 384h384v64H320z"
		})]));
	}
}), location_default = /* @__PURE__ */ defineComponent({
	name: "Location",
	__name: "location",
	setup(s) {
		return (s, I) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createElementVNode("path", {
			fill: "currentColor",
			d: "M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416M512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544"
		}), createElementVNode("path", {
			fill: "currentColor",
			d: "M512 512a96 96 0 1 0 0-192 96 96 0 0 0 0 192m0 64a160 160 0 1 1 0-320 160 160 0 0 1 0 320"
		})]));
	}
}), menu_default$1 = /* @__PURE__ */ defineComponent({
	name: "Menu",
	__name: "menu",
	setup(s) {
		return (s, I) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createElementVNode("path", {
			fill: "currentColor",
			d: "M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32z"
		})]));
	}
}), setting_default = /* @__PURE__ */ defineComponent({
	name: "Setting",
	__name: "setting",
	setup(s) {
		return (s, I) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createElementVNode("path", {
			fill: "currentColor",
			d: "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"
		})]));
	}
}), menu_default = /* @__PURE__ */ defineComponent({
	name: "li-menu",
	__name: "index",
	setup(I) {
		let L = ref(!0), H = (s, I) => {
			console.log(s, I);
		}, U = (s, I) => {
			console.log(s, I);
		};
		return (I, W) => {
			let G = resolveComponent("el-radio-button"), K = resolveComponent("el-radio-group"), q = resolveComponent("el-icon"), J = resolveComponent("el-menu-item"), X = resolveComponent("el-menu-item-group"), Z = resolveComponent("el-sub-menu"), Q = resolveComponent("el-menu");
			return openBlock(), createElementBlock(Fragment, null, [createVNode(K, {
				modelValue: L.value,
				"onUpdate:modelValue": W[0] ||= (s) => L.value = s,
				style: { "margin-bottom": "20px" }
			}, {
				default: withCtx(() => [createVNode(G, { value: !1 }, {
					default: withCtx(() => [...W[1] ||= [createTextVNode("expand", -1)]]),
					_: 1
				}), createVNode(G, { value: !0 }, {
					default: withCtx(() => [...W[2] ||= [createTextVNode("collapse", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]), createVNode(Q, {
				"default-active": "2",
				class: "el-menu-vertical-demo",
				collapse: L.value,
				onOpen: H,
				onClose: U
			}, {
				default: withCtx(() => [
					createVNode(Z, { index: "1" }, {
						title: withCtx(() => [createVNode(q, null, {
							default: withCtx(() => [createVNode(unref(location_default))]),
							_: 1
						}), W[3] ||= createElementVNode("span", null, "Navigator One", -1)]),
						default: withCtx(() => [
							createVNode(X, null, {
								title: withCtx(() => [...W[4] ||= [createElementVNode("span", null, "Group One", -1)]]),
								default: withCtx(() => [createVNode(J, { index: "1-1" }, {
									default: withCtx(() => [...W[5] ||= [createTextVNode("item one", -1)]]),
									_: 1
								}), createVNode(J, { index: "1-2" }, {
									default: withCtx(() => [...W[6] ||= [createTextVNode("item two", -1)]]),
									_: 1
								})]),
								_: 1
							}),
							createVNode(X, { title: "Group Two" }, {
								default: withCtx(() => [createVNode(J, { index: "1-3" }, {
									default: withCtx(() => [...W[7] ||= [createTextVNode("item three", -1)]]),
									_: 1
								})]),
								_: 1
							}),
							createVNode(Z, { index: "1-4" }, {
								title: withCtx(() => [...W[8] ||= [createElementVNode("span", null, "item four", -1)]]),
								default: withCtx(() => [createVNode(J, { index: "1-4-1" }, {
									default: withCtx(() => [...W[9] ||= [createTextVNode("item one", -1)]]),
									_: 1
								})]),
								_: 1
							})
						]),
						_: 1
					}),
					createVNode(J, { index: "2" }, {
						title: withCtx(() => [...W[10] ||= [createTextVNode("Navigator Two", -1)]]),
						default: withCtx(() => [createVNode(q, null, {
							default: withCtx(() => [createVNode(unref(menu_default$1))]),
							_: 1
						})]),
						_: 1
					}),
					createVNode(J, {
						index: "3",
						disabled: ""
					}, {
						title: withCtx(() => [...W[11] ||= [createTextVNode("Navigator Three", -1)]]),
						default: withCtx(() => [createVNode(q, null, {
							default: withCtx(() => [createVNode(unref(document_default))]),
							_: 1
						})]),
						_: 1
					}),
					createVNode(J, { index: "4" }, {
						title: withCtx(() => [...W[12] ||= [createTextVNode("Navigator Four", -1)]]),
						default: withCtx(() => [createVNode(q, null, {
							default: withCtx(() => [createVNode(unref(setting_default))]),
							_: 1
						})]),
						_: 1
					})
				]),
				_: 1
			}, 8, ["collapse"])], 64);
		};
	}
}), _sfc_main = {
	name: "li-banners",
	props: {
		carouselList: {
			type: Array,
			default: () => [],
			validator: (s) => s.every((s) => {
				let I = ["image", "video"].includes(s.type), L = s.title !== void 0 && s.briefIntroduction !== void 0, R = s.bottomBannerImageUrl || s.videoUrl;
				return I && L && R;
			})
		},
		videoUrl: {
			type: String,
			default: ""
		},
		prevArrow: {
			type: String,
			default: ""
		},
		nextArrow: {
			type: String,
			default: ""
		},
		customButtons: {
			type: Array,
			default: () => []
		},
		showButtons: {
			type: Boolean,
			default: !0
		}
	},
	computed: { hasCarouselItems() {
		return this.carouselList && this.carouselList.length > 0;
	} },
	data() {
		return {
			isNextActive: !1,
			isPrevActive: !1,
			currentIndex: 0
		};
	},
	methods: {
		getButtonsForItem(s) {
			return s.buttons && s.buttons.length > 0 ? s.buttons : this.customButtons;
		},
		prevSlide() {
			this.$refs.carousel && this.$refs.carousel.prev();
		},
		nextSlide() {
			this.$refs.carousel && this.$refs.carousel.next();
		},
		setActive(s, I) {
			s === "prev" ? this.isPrevActive = I : this.isNextActive = I;
		},
		handleCarouselChange(s) {
			this.currentIndex = s, this.$emit("change", s);
		},
		handleButtonClick(s, I, L) {
			this.$emit("button-click", {
				item: s,
				button: I,
				buttonIndex: L,
				currentIndex: this.currentIndex
			});
		},
		handleItemClick(s) {
			this.$emit("item-click", s);
		}
	}
}, _hoisted_1 = { class: "ai-assistant-section" }, _hoisted_2 = { key: 0 }, _hoisted_3 = { class: "introduction-area" }, _hoisted_4 = { class: "title" }, _hoisted_5 = { class: "description" }, _hoisted_6 = {
	key: 0,
	class: "btn-all"
}, _hoisted_7 = ["onClick"], _hoisted_8 = { class: "btn-text" }, _hoisted_9 = ["src"], _hoisted_10 = {
	key: 2,
	class: "el-icon-top-right btn-icon"
}, _hoisted_11 = {
	key: 1,
	class: "video-carousel-item"
}, _hoisted_12 = {
	playsinline: "",
	autoplay: "",
	loop: "",
	muted: "",
	style: {
		width: "100%",
		height: "100%",
		"object-fit": "cover"
	}
}, _hoisted_13 = ["src"], _hoisted_14 = { class: "introduction-area" }, _hoisted_15 = { class: "title" }, _hoisted_16 = { class: "description" }, _hoisted_17 = {
	key: 0,
	class: "btn-all"
}, _hoisted_18 = ["onClick"], _hoisted_19 = { class: "btn-text" }, _hoisted_20 = ["src"], _hoisted_21 = {
	key: 2,
	class: "el-icon-top-right btn-icon"
}, _hoisted_22 = {
	key: 1,
	class: "video-content"
}, _hoisted_23 = {
	playsinline: "",
	autoplay: "",
	loop: "",
	muted: "",
	style: {
		width: "100%",
		height: "744px",
		"object-fit": "cover"
	}
}, _hoisted_24 = ["src"], _hoisted_25 = ["src"], _hoisted_26 = ["src"];
function _sfc_render(H, G, q, Y, X, Z) {
	let Q = resolveComponent("el-carousel-item"), $ = resolveComponent("el-carousel");
	return openBlock(), createElementBlock("div", _hoisted_1, [
		Z.hasCarouselItems ? (openBlock(), createElementBlock("div", _hoisted_2, [createVNode($, {
			height: "744px",
			"indicator-position": "none",
			arrow: "never",
			ref: "carousel",
			onChange: Z.handleCarouselChange
		}, {
			default: withCtx(() => [(openBlock(!0), createElementBlock(Fragment, null, renderList(q.carouselList, (V, H) => (openBlock(), createBlock(Q, {
				key: H,
				style: { height: "100%" },
				arrow: "always",
				"show-indicators": !1
			}, {
				default: withCtx(() => [V.type === "image" ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "carousel-item-content",
					style: normalizeStyle({
						backgroundImage: `url('${V.bottomBannerImageUrl}')`,
						backgroundSize: "cover",
						backgroundPosition: "center"
					})
				}, [createElementVNode("div", _hoisted_3, [
					createElementVNode("h1", _hoisted_4, toDisplayString(V.title), 1),
					createElementVNode("p", _hoisted_5, toDisplayString(V.briefIntroduction), 1),
					q.showButtons ? (openBlock(), createElementBlock("div", _hoisted_6, [(openBlock(!0), createElementBlock(Fragment, null, renderList(Z.getButtonsForItem(V), (s, I) => (openBlock(), createElementBlock("div", {
						key: I,
						class: normalizeClass(["knowbtn custom-btn", s.className]),
						style: normalizeStyle(s.style),
						onClick: (L) => Z.handleButtonClick(V, s, I)
					}, [createElementVNode("div", _hoisted_8, toDisplayString(s.text), 1), s.icon ? (openBlock(), createElementBlock("i", {
						key: 0,
						class: normalizeClass([s.icon, "btn-icon"])
					}, null, 2)) : s.iconImg ? (openBlock(), createElementBlock("img", {
						key: 1,
						src: s.iconImg,
						class: "btn-icon-img"
					}, null, 8, _hoisted_9)) : (openBlock(), createElementBlock("i", _hoisted_10))], 14, _hoisted_7))), 128))])) : createCommentVNode("", !0)
				])], 4)) : V.type === "video" ? (openBlock(), createElementBlock("div", _hoisted_11, [createElementVNode("video", _hoisted_12, [createElementVNode("source", {
					src: V.videoUrl || V.bottomBannerImageUrl,
					type: "video/mp4"
				}, null, 8, _hoisted_13), G[12] ||= createTextVNode(" 您的浏览器不支持视频播放。 ", -1)]), createElementVNode("div", _hoisted_14, [
					createElementVNode("h1", _hoisted_15, toDisplayString(V.title), 1),
					createElementVNode("p", _hoisted_16, toDisplayString(V.briefIntroduction), 1),
					q.showButtons ? (openBlock(), createElementBlock("div", _hoisted_17, [(openBlock(!0), createElementBlock(Fragment, null, renderList(Z.getButtonsForItem(V), (s, I) => (openBlock(), createElementBlock("div", {
						key: I,
						class: normalizeClass(["knowbtn custom-btn", s.className]),
						style: normalizeStyle(s.style),
						onClick: (L) => Z.handleButtonClick(V, s, I)
					}, [createElementVNode("div", _hoisted_19, toDisplayString(s.text), 1), s.icon ? (openBlock(), createElementBlock("i", {
						key: 0,
						class: normalizeClass([s.icon, "btn-icon"])
					}, null, 2)) : s.iconImg ? (openBlock(), createElementBlock("img", {
						key: 1,
						src: s.iconImg,
						class: "btn-icon-img"
					}, null, 8, _hoisted_20)) : (openBlock(), createElementBlock("i", _hoisted_21))], 14, _hoisted_18))), 128))])) : createCommentVNode("", !0)
				])])) : createCommentVNode("", !0)]),
				_: 2
			}, 1024))), 128))]),
			_: 1
		}, 8, ["onChange"])])) : q.videoUrl ? (openBlock(), createElementBlock("div", _hoisted_22, [createElementVNode("video", _hoisted_23, [createElementVNode("source", {
			src: q.videoUrl,
			type: "video/mp4"
		}, null, 8, _hoisted_24), G[13] ||= createTextVNode(" 您的浏览器不支持视频播放。 ", -1)])])) : createCommentVNode("", !0),
		Z.hasCarouselItems && q.prevArrow ? (openBlock(), createElementBlock("div", {
			key: 2,
			class: normalizeClass(["custom-arrow custom-prev", { active: X.isPrevActive }]),
			onMousedown: G[0] ||= (s) => Z.setActive("prev", !0),
			onMouseup: G[1] ||= (s) => Z.setActive("prev", !1),
			onMouseleave: G[2] ||= (s) => Z.setActive("prev", !1),
			onTouchstart: G[3] ||= (s) => Z.setActive("prev", !0),
			onTouchend: G[4] ||= (s) => Z.setActive("prev", !1),
			onClick: G[5] ||= (...s) => Z.prevSlide && Z.prevSlide(...s)
		}, [createElementVNode("img", {
			src: q.prevArrow,
			alt: "左箭头",
			class: "arrow-image"
		}, null, 8, _hoisted_25)], 34)) : createCommentVNode("", !0),
		Z.hasCarouselItems && q.nextArrow ? (openBlock(), createElementBlock("div", {
			key: 3,
			class: normalizeClass(["custom-arrow custom-next", { active: X.isNextActive }]),
			onMousedown: G[6] ||= (s) => Z.setActive("next", !0),
			onMouseup: G[7] ||= (s) => Z.setActive("next", !1),
			onMouseleave: G[8] ||= (s) => Z.setActive("next", !1),
			onTouchstart: G[9] ||= (s) => Z.setActive("next", !0),
			onTouchend: G[10] ||= (s) => Z.setActive("next", !1),
			onClick: G[11] ||= (...s) => Z.nextSlide && Z.nextSlide(...s)
		}, [createElementVNode("img", {
			src: q.nextArrow,
			alt: "右箭头",
			class: "arrow-image"
		}, null, 8, _hoisted_26)], 34)) : createCommentVNode("", !0)
	]);
}
var BannerCarousel_default = /* @__PURE__ */ __plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e22ccaba"]]), component = [
	button_default,
	Imagebox_default,
	menu_default,
	BannerCarousel_default
], bytecoderUI_default = { install(s) {
	component.forEach((I) => {
		s.component(I.name, I);
	});
} };
export { BannerCarousel_default as BannerCarousel, button_default as Button, Imagebox_default as Imagebox, menu_default as Menu, bytecoderUI_default as default };
