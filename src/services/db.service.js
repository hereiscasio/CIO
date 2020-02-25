import store from '@/store.js';
import { db, getLoggedUser } from '@/plugins/firebase';
import { format, getDaysInMonth, addMonths, subMonths } from 'date-fns'




class DbService
{

	_todayRecordAutoResetter = undefined;

	_reTrackRecordsInFocusedMonth()
	{
		const getDateOfToday = () => format(new Date(), 'yyyyLLdd');
		const dateOfToday = getDateOfToday();

		this._todayRecordAutoResetter = setInterval(() =>
		{
			if (eval(getDateOfToday() - dateOfToday) > 0)
			{
				clearInterval(this._todayRecordAutoResetter);
				this._todayRecordAutoResetter = undefined;
				this.trackRecordsInFocusedMonth();
			}
		},
		3000);
	}

	/**
	 *
	 * @param {String} yearWithMonth: '2009-03'
	 */
	getRecordsInCertainMonth(yearWithMonth)
	{
		return new Promise((resolve, reject) =>
		{
			const onError = e => console.error('Fail to get data', e);
			const cb = snapshot =>
			{
				resolve(snapshot.val());
			};
			const path = getLoggedUser().phoneNumber + '/' + yearWithMonth;
			db.ref(path).once('value', cb, onError);
		});
	}

	trackRecordsInFocusedMonth ()
	{
		return new Promise((resolve, reject) =>
		{
			const onError = e => console.error('Fail to track data', e);
			const cb = snapshot =>
			{
				store.commit('SET_TRACKED_RECORDS', snapshot.val());
				resolve(); // don't change this line order
				this._reTrackRecordsInFocusedMonth();
			}
			const path = getLoggedUser().phoneNumber + '/' + format(Date.now(), 'yyyy-LL');
			console.warn('path ==== ', path);
			db.ref(path).on('value', cb, onError);
		});
	}

	/**
	 *
	 * @param {Object} record: {clockIn?, clockOut?, date}
	 */
	updateRecord (record)
	{
		const date = record.date;
		const yearAndMonth = date.slice(0, 7);
		const phoneNumber = getLoggedUser().phoneNumber;
		const path = `${phoneNumber}/${yearAndMonth}/${date}`;

		db.ref(path).update(record);
	}
}

export default new DbService();