import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import Element from "element-ui";
import "babel-polyfill";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/element-variables.scss";
import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";
import message from "./components/Message/index";
import i18n from "./lang"; // Internationalization
import "./icons"; // icon
import "./errorLog"; // error log
import "./permission"; // permission control
//import './mock' // simulation data
import "./views/templateTool/compoent.scss";
import "@/assets/icon/iconfont.css"; //  icon custem css
import "@/assets/component_icon/iconfont.css"; //  icon custem css
import "./../static/style/baominIconfont.css"; // 慈善会 icon
// import '@/assets/icon/xiaochengxu/iconfont.css';
//import "@/assets/icon/iconfont1.css"; //  icon custem css
import axios from "axios";
// import $ from "jquery";
Vue.prototype.$http = axios;
import * as filters from "./filters"; // global filters
Vue.prototype.$Message = message;
Vue.use(Element, { size: "mini", zIndex: 3000 });

/**
 * 百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系互转 插件
 */
import coordtransform from "coordtransform";
Vue.use(coordtransform);

/* 投票拖拽 */
import vueDragging from "../static/awe-dnd/vue-dragging.es5";
Vue.use(vueDragging);
/**
 *  ueditor
 */

import "../static/UE/ueditor.config.js";
import "../static/UE/ueditor.all.min.js";
import "../static/UE/lang/zh-cn/zh-cn.js";
import "../static/UE/ueditor.parse.min.js";

// import VueKindEditor from "vue-kindeditor";
// import "kindeditor/kindeditor-all-min.js";
// import "kindeditor/themes/default/default.css";
// import "@/assets/icon/iconfont.css"; //  icon custem css
// Vue.use(VueKindEditor);

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    i18n,
    template: "<App/>",
    components: { App }
});