// Utilities
import { storyFactory } from '../util/helpers'
import { text, boolean } from '@storybook/addon-knobs'
import Loading from '@/components/Dialog/Loading.vue';
export default { title: 'BaseCard' }

function genComponent (name) {
  return {
    name,

    render (h) {
      return h('div', this.$slots.default)
    },
  }
}
/**
 * = components: {...}
 */
const story = storyFactory({
  BaseBtn: genComponent('BaseBtn'),
  BaseCard: genComponent('BaseCard'),
})

export const LoadingDialog = () => ({
	components: {
		Loading
	},
	template: `<Loading :payload='true'>`
});

export const CardDemo = () => ({
	template: `
	<v-card
    class="mx-auto"
    max-width="344"
  >
    <v-card-text>
      <div>Word of the Day</div>
      <p class="display-1 text--primary">
        be•nev•o•lent
      </p>
      <p>adjective</p>
      <div class="text--primary">
        well meaning and kindly.<br>
        "a benevolent smile"
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
      >
        Learn More
      </v-btn>
    </v-card-actions>
  </v-card>
	`
})

export const asDefault = () => story({
  props: {
    actions: {
      default: boolean('Actions', false),
    },
    cardText: {
      default: text('Card text', 'Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Donec sodales sagittis magna. Vestibulum dapibus nunc ac augue. Donec sodales sagittis magna. Duis vel nibh at velit scelerisque suscipit.'),
    },
    divider: {
      default: boolean('Divider', false),
    },
    text: {
      default: boolean('Text', true),
    },
    title: {
      default: boolean('Show title', true),
    },
    titleText: {
      default: text('Title text', 'Card title'),
    },
  },
  template: `
    <base-card>
      <v-card-title v-if="title">{{ titleText }}</v-card-title>

      <v-card-text v-if="text">{{ cardText }}</v-card-text>

      <v-divider v-if="divider"></v-divider>

      <v-card-actions v-if="actions">
        <v-btn text>Cancel</v-btn>

        <v-spacer></v-spacer>

        <base-btn depressed>Accept</base-btn>
      </v-card-actions>
    </base-card>
  `,
})
CardDemo.story = {
	parameters: {
		notes: 'A small component',
	  },
}