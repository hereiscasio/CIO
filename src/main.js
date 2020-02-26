
import router from '@/router.js';
import store from '@/store.js';
import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify.js';
import '@/helper/utils.js';
import PortalVue from 'portal-vue';

Vue.use(PortalVue);
Vue.config.productionTip = false;

new Vue({
	store,
	router,
	vuetify,
	render: h => h(App)
})
	.$mount('#app');
