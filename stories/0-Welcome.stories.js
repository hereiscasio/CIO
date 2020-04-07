import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';

export default {
  title: 'Welcome',
  //component: Welcome,
};

export const ToStorybook = () => ({ // first story
  components: { Welcome },
  template: '<welcome :showApp="action" />',
  methods: { action: linkTo('Button') },
});

ToStorybook.story = {
  name: 'to Storybook', // change sub-file's name
};