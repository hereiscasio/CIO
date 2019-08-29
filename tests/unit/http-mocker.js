import axios from 'axios'
import { getCurrent, stringWithSeparator } from './../../src/helper'

export const mockHttp = {
	GET: () => {
		const clockIn = getCurrent().time()

		axios.get = jest.fn(() => Promise.resolve({
			data: {date: getCurrent().date(), clockIn, clockOut: ''}
		}))

		return stringWithSeparator(clockIn, ':')
	},
	POST: () => {
		axios.post = jest.fn(() => Promise.resolve({
			data: {date: getCurrent().date(), clockIn: getCurrent().time(), clockOut: ''}
		}))
	},
	PATCH: () => {
		axios.patch = jest.fn(() => Promise.resolve({
			data: {date: getCurrent().date(), clockIn: getCurrent().time(), clockOut: getCurrent().time()}
		}))
	},
	DELETE: () => axios.delete = jest.fn(() => Promise.resolve({}))
}