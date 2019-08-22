import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import helper from './helper.js';

Vue.config.productionTip = false;
Vue.prototype.eventBus = new Vue();
Vue.use(helper);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
