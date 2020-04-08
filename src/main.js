
import router from '@/router.js';
import store from '@/store.js';
import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify.js';
import '@/helper/utils.js';

Vue.config.productionTip = false;

const preRenderHandler = () => document.dispatchEvent(new Event("x-app-rendered"));

new Vue({
	store,
	router,
	vuetify,
	render: h => h(App),
  	mounted: preRenderHandler
})
	.$mount('#app');
