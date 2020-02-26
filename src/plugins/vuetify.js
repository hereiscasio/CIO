import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		values: {
			next: 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
			prev: 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'
		}
	},
	breakpoint: {
		thresholds: {
		  xs: 564,
		//   sm: 540,
		//   md: 800,
		//   lg: 1280,
		}
	},
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
