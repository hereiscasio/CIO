import router from '@/router.js';
import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify.js'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import helper from '@/helper.js'
import Vlf from 'vlf'

import '@/plugins/firebaseInit.js';

Vue.config.productionTip = false

Vue.prototype.eventBus = new Vue()

Vue.use(Vlf)
Vue.use(helper)

new Vue({
	router,
	vuetify,
	async created() {
		this.uid = await this.$vlf.getItem('phoneNumber')
	},
	render: h => h(App)
})
	.$mount('#app')
