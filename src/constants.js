import { getCurrent } from './helper'

export const TEXT = {
	USAGE_TIPS: `Click any date above to see the clock-in-out time at that day`
}

export const API =
{
	RECORD_TODAY: () => `/user/${localStorage.userId}/record/${getCurrent().date()}`,

	DELETE_MY_ACCOUNT: () => `/user/${localStorage.userId}`,

	TO_RECORD: certainDate => {
		let baseURL = `/user/${localStorage.userId}/record`
		return certainDate === undefined ? baseURL : `${baseURL}/${certainDate}`
	},

	RECORDS_IN_MONTH: monthWithYear => `/user/${localStorage.userId}/records/${monthWithYear}`
}