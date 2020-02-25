/**
 *
 * @param this : typescript feature, this only work for ts itself only, we can't access this parameter in actual
 * @param eventName
 * @param cb
 */
export function subscribe (eventName, cb)
{
	this.$eventBus.$on(eventName, cb);

	this.$once('hook:beforeDestroy', () => {
		$eventBus.$off(eventName, cb);
	});
}

export function fire (eventName, payload)
{
	this.$eventBus.$emit(eventName, payload);
}