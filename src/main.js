import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import helper from './helper.js'
import axios from 'axios'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.eventBus = new Vue()
Vue.use(helper)

new Vue({
	created() {
		// Initialize Firebase
		firebase.initializeApp({
			apiKey: 'AIzaSyBcv7sU-C7Qlgt76IMbMQCNn6oQhdkTW6c',
			authDomain: 'ciosystem.firebaseapp.com',
			databaseURL: 'https://ciosystem.firebaseio.com',
			projectId: 'ciosystem',
			storageBucket: '',
			messagingSenderId: '110179811261',
			appId: '1:110179811261:web:8b4c411f85ce79160f1cd4'
		})
		Vue.prototype.$firebase = firebase
	},
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
