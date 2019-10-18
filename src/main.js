import 'normalize.css'
import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import helper from '@/helper.js'
import axios from 'axios'
import Vlf from 'vlf'
import router from '@/router'
import firebaseRTDB from '@/plugins/firebaseRTDB'

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.eventBus = new Vue()

Vue.use(Vlf)
Vue.use(helper)
Vue.use(firebaseRTDB)

new Vue({
	router,
	vuetify,
	async created() {
		this.uid = await this.$vlf.getItem('phoneNumber')
	},
	render: h => h(App)
})
	.$mount('#app')
