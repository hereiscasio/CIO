import { getRecordData } from './calendar.utils.js';

export { remove_data_of_test_user_in_rtdb } from './clock_page.utils.js';

export { add_records_in_rtdb, head_to_history_dashboard } from './calendar.utils.js';

export const head_to_table_view = function ()
{
	cy
		.findByText('Table')
		.click();
};

export const info_shown_in_this_month = function ()
{
	cy
		.findByText(getRecordData().current.monthInEnglishAndYear);
	cy
		.findByText(getRecordData().current.time);
};

export const info_shown_in_next_month = function ()
{
	cy
		.findByText(getRecordData().next.monthInEnglishAndYear);
	cy
		.findByText(getRecordData().next.time);
};

export const switch_to_next_month = function () {
	cy
		.get('[data-cy="button-to-next-month"]')
		.as('nextMonthBtn')
		.click({force: true});
};

export const switch_to_Dec = function () {
	switch_to_prev_month();
};

export const switch_to_Jan = function () {
	switch_to_next_month();
};

export const switch_to_prev_month = function ()
{
	cy
		.get('[data-cy="button-to-prev-month"]')
		.click({force: true});
};

export const switch_to_end_of_this_year = function ()
{
	cy
		.get('[data-cy="title-of-next-month-button"]')
		.as('nextMonthButtonTitle');
	cy
		.get('@nextMonthButtonTitle')
		.invoke('text')
		.then(month =>
		{
			const monthMap = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, Jun: 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12};
			const numberOfClick = monthMap[ month.trim() ];

			for (let i = 0; i <= numberOfClick; i++) {
				switch_to_next_month();
			}
		});
};

export const show_proper_info_in_Jan = function ()
{
	cy
		.get('@nextMonthButtonTitle')
		.should('contain.text', 'Feb')
	cy
		.get('[data-cy="title-of-prev-month-button"]')
		.should('contain.text', 'Dec');

	cy
		.findByText('2021 Jan');
};

export const show_proper_info_in_Dec = function ()
{
	cy
		.get('[data-cy="title-of-next-month-button"]')
		.should('contain.text', 'Jan')
	cy
		.get('[data-cy="title-of-prev-month-button"]')
		.should('contain.text', 'Nov');
	cy
		.findByText('2020 Dec');
};