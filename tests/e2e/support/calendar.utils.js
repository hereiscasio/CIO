import {format, addDays, addMonths} from 'date-fns';

const UID = `users/${Cypress.env('TEST_UID')}`

export { remove_data_of_test_user_in_rtdb } from './clock_page.utils.js';

export const head_to_history_dashboard = function () {
	cy
		.findByText('HISTORY', {exact: false})
		.click({force: true});
};

export const record_shown_in_this_month =  () =>
{
	cy
		.get('.green.lighten-1')
		.parent()
		.siblings('.v-btn__content')
		.as('dateWithRecord');
	cy
		.get('@dateWithRecord')
		.should('contain.text', getRecordData().current.day)
};

export const switch_to_next_month = function () {
	cy
		.get('.v-date-picker-header > button')
		.last()
		.click({force: true});
};

export const record_shown_in_next_month =  () => {
	cy
		.wait(1000); // @TODO: hack
	cy
		.get('@dateWithRecord')
		.should('contain.text', getRecordData().next.day);
}

export const add_records_in_rtdb = function ()
{
	__add_an_record_in_this_month();
	__add_an_record_in_next_month();
};

export const getRecordData = () =>
{
	const nextMonth = addMonths(Date.now(), 1);
	const dateInNextMonth = addDays(nextMonth, 1);
	return {
		current: {
			date: format(Date.now(), 'yyyy-LL-dd'),
			monthWithYear: format(Date.now(), 'yyyy-LL'),
			monthInEnglishAndYear: format(Date.now(), 'yyyy LLL'),
			day: format(Date.now(), 'dd'),
			time: '12:37'
		},
		next: {
			date: format(dateInNextMonth, 'yyyy-LL-dd'),
			monthWithYear: format(dateInNextMonth, 'yyyy-LL'),
			monthInEnglishAndYear: format(dateInNextMonth, 'yyyy LLL'),
			day: format(dateInNextMonth, 'dd'),
			time: '22:33'
		}
	}
};

const __add_an_record_in_this_month = function ()
{
	const { current } = getRecordData();
	const record = {
		date: current.date,
		clockIn: current.time
	};
	cy
		.callRtdb(
			'update',
			`${UID}/${current.monthWithYear}/${current.date}`,
			record
		);
};

const __add_an_record_in_next_month = function ()
{
	const { next } = getRecordData();
	const record = {
		date: next.date,
		clockIn: next.time
	};
	cy
		.callRtdb(
			'update',
			`${UID}/${next.monthWithYear}/${next.date}`,
			record
		);
};


