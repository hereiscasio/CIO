import { text, boolean, object, array } from '@storybook/addon-knobs';
import SuccessLogin from '@/components/LoginProcess/SuccessLogin.vue';
import BeforeLogin from '@/components/LoginProcess/BeforeLogin.vue';
import StartLogin from '@/components/LoginProcess/StartLogin.vue';


export default {
	title: 'Login'
}

export const SuccessLoginDefault = () => ({
	components: {
		SuccessLogin
	},
	template: `<SuccessLogin/>`
});

export const StartLoginDefault = () => ({
	components: {
		StartLogin
	},
	template: `<StartLogin/>`
});

export const BeforeLoginDefault = () => ({
	components: {
		BeforeLogin
	},
	template: `<BeforeLogin/>`
});