import Notification from '@/components/Notification'
import helper, { getCurrent, stringWithSeparator } from './../../src/helper.js'
import { render, fireEvent, wait, waitForElement } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import store from './../../src/store'
import router from './../../src/router'
import Vuetify from 'vuetify'
import axios from 'axios'
import { mockHttp } from './http-mocker'

const http = {
    install() {
        Vue.prototype.$http = axios;
    }
};
Vue.use(Vuetify)
Vue.use(helper)
Vue.use(http)
Vue.use(Router)
Vue.use(Vuex)

const installPlugins = () => {
	store.commit('RESET_ALL')
	return ({vuetify: new Vuetify(), store, router})
}

/**
 * @include #UC10US1A
 */
it(`#UC1US1B Notification will be hided after he close it`, async () =>
{
	const props = { mode: 'greeting', content: 'Hello, 0966001596' }
	const { queryByText } = render(Notification, { props }, installPlugins)
	const $buttonToTurnOff = queryByText('close')
	const $notification = () => queryByText(props.content, { exact: false })

	expect($notification()).toBeInTheDocument()

	await fireEvent.click($buttonToTurnOff)

	expect($notification()).not.toBeInTheDocument()
})