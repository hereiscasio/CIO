import Vue from 'vue';

Vue.prototype.$eventBus = new Vue();

Vue.prototype.$subscribe = function (eventName, cb)
{
	this.$eventBus.$on(eventName, cb);

	this.$once('hook:beforeDestroy', () =>
	{
		this.$eventBus.$off(eventName, cb);
	});
};

Vue.prototype.$fire = function  (eventName, ...payload)
{
	this.$eventBus.$emit(eventName, ...payload);
};


