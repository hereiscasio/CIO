import { action } from '@storybook/addon-actions';
import { text, boolean, object, array } from '@storybook/addon-knobs';
import Loading from '@/components/Dialog/Loading.vue';
import Logout from '@/components/Dialog/Logout.vue';
import Settings from '@/components/Dialog/Settings.vue';
import Notification from '@/components/Dialog/Notification.vue';

export default {
	title: 'Dialog'
}

const onHideDialogMethod = {
	onHideDialog: action('hide dialog')
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
	methods: onHideDialogMethod,
	template: `<Logout :payload='true' @onHideDialog='onHideDialog'/>`
});
export const SettingsDefault = () => ({
	components: {
		Settings
	},
	methods: onHideDialogMethod,
	template: `<Settings :payload='true' @onHideDialog='onHideDialog'/>`
});
export const NotificationDefault = () => ({
	components: {
		Notification
	},
	methods: onHideDialogMethod,
	template: `<Notification :payload='true' @onHideDialog='onHideDialog'/>`
});