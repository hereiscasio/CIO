// Imports
import Vue from 'vue'
import Vuetify from 'vuetify'
import { makeDecorator } from '@storybook/addons'

// Utilities
import deepmerge from 'deepmerge'

// Vuetify
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

/**
 * Global import prefer `vuetifyConfig`
 * instead import it to every stories
 * by something like:
 * `
 *	export default {
 *		title: 'BaseCard',
 *		parameters: {
 *			vuetify: vuetifyConfig
 *		}
 *	}
 * `
 *
 * but the way below is workaround, we should try
 * to import `vuetifyConfig` in preview.js
*/
import { vuetifyConfig } from '@/plugins/vuetify.js';

Vue.use(Vuetify)

export default makeDecorator({
  name: 'withVuetify',
  parameterName: 'vuetify',
  wrapper: (storyFn, context, { parameters = vuetifyConfig }) => {
    // Reduce to one new URL?
    const searchParams = new URL(window.location).searchParams
    const dark = searchParams.get('eyes-variation') === 'dark'
    const rtl = searchParams.get('eyes-variation') === 'rtl'
    const vuetify = new Vuetify(deepmerge({
      rtl,
      theme: { dark },
    }, parameters))
    const WrappedComponent = storyFn(context)

    return Vue.extend({
      vuetify,
      components: { WrappedComponent },
      template: `
        <v-app>
          <v-container fluid>
            <wrapped-component />
          </v-container>
        </v-app>
      `,
    })
  },
})
