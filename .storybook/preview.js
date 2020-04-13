import { addDecorator } from '@storybook/vue'
import { withA11y } from '@storybook/addon-a11y'
import { withKnobs } from '@storybook/addon-knobs'
import { withTemplate } from './addon-show-vue-markup'
import { withVuetify } from './addon-vuetify'
// import 'cypress-storybook/react'; // error

addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withTemplate);
addDecorator(withVuetify);