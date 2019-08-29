import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import helper from './helper.js'
import axios from 'axios'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.eventBus = new Vue()
Vue.use(helper)

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
