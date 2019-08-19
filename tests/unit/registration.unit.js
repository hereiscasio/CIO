import AppHomePage from '@/components/Registration/AppHomePage';
import Notification from '@/components/Notification';

//import OtpVerification from '@/components/Registration/OtpVerification';
import { mount } from '@vue/test-utils';
import Vuetify from "vuetify";
import Vue from 'vue';
//import mockAxios from 'jest-mock-axios';
// const eventBus = {
//     install(v) {
//         v.prototype.eventBus = new Vue();
//     }
// };
Vue.use(Vuetify);
// Vue.use(eventBus)
/**
 * TODO: can't log `wrapper.vm`, `wrapper.element`
 */
describe.skip('registration', function() {
    describe('send OTP API out & receive response', function() {
        // afterEach(function() {
        //     mockAxios.reset();
        // });

        //it('should send OTP-request API after pressing button--send-mobile-number', async () => {
        it('should show button for requesting OTP after enter valid phone number', async function() {
            let mobileNumber = ['0966', '001', '596'];
            const wrapper    = mount(AppHomePage);

            expect(wrapper.find({ref: 'buttonForRequestOTP'}).exists()).toBe(false)

            // mockAxios.mockResponse({data: OtpCode});
            wrapper.setData({mobileNumber});
            await Vue.nextTick();
            expect(wrapper.find({ref: 'buttonForRequestOTP'}).exists()).toBe(true)
            // await Vue.nextTick();
            // wrapper.find({ref: 'buttonForRequestOTP'}).trigger('click');
            // expect(mockAxios.post).toHaveBeenCalledWith('/otp', {id: mobileNumber.join('')});
        });

        it('should show OTP to user if receive it', function() {
            const propsData = {otpCode: '0000', mode: 'otpProvider'};
            let wrapper = mount(Notification);
            let otpPresenter = wrapper.html();

            expect(otpPresenter).toBe(undefined);

            wrapper = mount(Notification, {propsData});
            otpPresenter = wrapper.html();
            expect(otpPresenter).not.toBe(undefined);
        });
    });
    it('', () => {
        // 為了要有 disable button，為了讓 e2e 通過，這時要寫的 unit test 似乎已經涉及
        // 去測一個非 public api 的東西，outside-in TDD 似乎出現缺陷了
    });
    test.skip('should send OTP API after pressing button--send-mobile-number', () =>
    {

        // wrapper.setData({toggleVisibilityOfButton: true});
        // expect(wrapper.vm.toggleVisibilityOfButton).toBe(true);




        // const mockFu = jest.fn();
        // wrapper.setMethods({_requestToReceiveOTP: mockFu});
        // console.log(wrapper.element, wrapper.vm);
        // console.log(wrapper.classes())
        //console.log(wrapper.html());
        //expect(wrapper.find('img').exists()).toBe(false)
        //expect(wrapper.attributes('id')).toBe('out-most-bounder--app-home-page');
        Vue.nextTick().then(() => {
            wrapper.find({ref: 'buttonForRequestOTP'}).trigger('click');
            // expect(wrapper.name()).toBe('AppHomePage')
            // expect(wrapper.emitted().requestToReceiveOTP).toBeTruthy();
            //expect(mockFu).toBeCalledWith('0966001596');
            expect(wrapper.find('img').isEmpty()).toBe(true);
            expect(wrapper.find('button').exists()).toBe(true);
            expect(wrapper.find('button').is('button')).toBe(true);
            expect(wrapper.find('button').text()).toBe('arrow_forward');

        });
    });
});