import TableToShowHistory from '@/components/TableToShowHistory'
import helper, { getCurrent } from './../../src/helper.js'
import { render, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom/extend-expect'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.use(helper)

const installVuetify = () => ({vuetify: new Vuetify()});

describe('TableToShowHistory ➡️ ', () => // name of unit under test
{
    it(``, () => expect(1).toBe(1))
})