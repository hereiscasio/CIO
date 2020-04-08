import { text, boolean, object, array } from '@storybook/addon-knobs';
import Loading from '@/components/Dialog/Loading.vue';
import Logout from '@/components/Dialog/Logout.vue';
import Settings from '@/components/Dialog/Settings.vue';
import Notification from '@/components/Dialog/Notification.vue';

export default {
	title: 'Dialog'
}

export const LoadingDefault = () => ({
	components: {
		Loading
	},
	template: `<Loading :payload='true'/>`
});
export const LogoutDefault = () => ({
	components: {
		Logout
	},
	template: `<Logout :payload='true'/>`
});
export const SettingsDefault = () => ({
	components: {
		Settings
	},
	template: `<Settings :payload='true'/>`
});
export const NotificationDefault = () => ({
	components: {
		Notification
	},
	template: `<Notification :payload='true'/>`
});