import router from '@/router.js';
import store from '@/store.js';
import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify.js'
import helper from '@/helper.js'

Vue.config.productionTip = false;

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$subscribe = require('@/utils.js').subscribe;
Vue.prototype.$fire = require('@/utils.js').fire;

Vue.use(helper);

new Vue({
	store,
	router,
	vuetify,
	render: h => h(App)
})
	.$mount('#app')
