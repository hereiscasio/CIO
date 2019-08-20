import { mount, shallowMount } from '@vue/test-utils'
import Home from '@/components/Home.vue'
import Vuetify from "vuetify"
/**
 * below 2 lines are important to solve the unit test error when run Jest currently
 * see more below :
 * http://nidkil.me/2019/01/18/vuetify-multiple-instances-of-vue-detected/
 */
import Vue from 'vue'
Vue.use(Vuetify)


describe.skip('Home.vue', () => {

  beforeEach(()=>{

    // wrapper = shallowMount(Home, { // will not render child component
    //   localVue
    // });
  })
  it('renders a vue instance', () => {
    const wrapper = mount(Home)
    expect(wrapper.isVueInstance()).toBe(true);
   });

  it('Checks the data-title', () => {
    const wrapper = mount(Home, {
      // propsData: {
      //   title: 'Foobar',
      // },
    })
    expect(wrapper.vm.title).toMatch('Weather App')
  })

  // it('has an h2', ()=>{
  //   expect(wrapper.contains('h2')).toBe(true)
  // })
})