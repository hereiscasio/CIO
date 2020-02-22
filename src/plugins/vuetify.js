import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
	theme: {
		options: {
			/**
			 * Enable to use Vuetify CSS variable in <style>
			 */
			customProperties: true
		},
		themes: {
			light: {
				primary: '#3D5AFE',
				secondary: '#03A9F4',
				accent: '#7B2B07',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107'
			}
		}
	}
})
