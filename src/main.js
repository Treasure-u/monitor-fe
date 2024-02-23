import "@babel/polyfill";
import "mutationobserver-shim";

import 'bootstrap';
import "./plugins/utils";
import "./plugins/http-client";
import "./plugins/vxe-table";

import "./plugins/echarts";
import "./assets/scss/style.scss";

import 'view-design/dist/styles/iview.css';
import Vue from "vue";

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import "echarts";
import App from "./App.vue";
import store from "./store/Store";
import router from "./router/Router";

import PrimeVue from 'primevue/config';
Vue.use(PrimeVue);

Vue.config.productionTip = false;

import ViewUI from 'view-design';
Vue.use(ViewUI);

import * as custom from './plugins/filter'

Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount("#app");
