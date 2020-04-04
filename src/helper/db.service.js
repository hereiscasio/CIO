import store from '@/store.js';
import { db, getLoggedUser } from '@/plugins/firebase';
import format from 'date-fns/format';

class DbService
{
	removePreviousTrackingRefAndData()
	{
		if (this._temporaryTrackingDataRef)
		{
			this._temporaryTrackingDataRef.off();
			store.commit('DEL_MONTH_RECORDS');
		}
	}

	_temporaryTrackingDataRef = undefined;

	/**
	 * TODO: try use `child_added` instead of `value`
	 * @param {String} monthWitYear: '2020-03'
	 */
	trackRecordsInFocusedMonth (monthWitYear)
	{
		return new Promise((resolve, reject) =>
		{
			this.removePreviousTrackingRefAndData();

			const onError = e => console.error('Fail to track data', e);
			const cb = snapshot =>
			{
				const records = snapshot.val();
				store.commit('SET_MONTH_RECORDS', records === null ? undefined : records);

				resolve();
			}
			const strOfMonthWitYear = monthWitYear || format(Date.now(), 'yyyy-LL');
			const path = getLoggedUser().phoneNumber + '/' + strOfMonthWitYear;

			db.ref(path).on('value', cb, onError);
			this._temporaryTrackingDataRef = db.ref(path);
		});
	}

	_todayRecordAutoResetter = undefined;

	_reTrackTodayRecord()
	{
		const getDateOfToday = () => format(Date.now(), 'yyyyLLdd');
		const dateOfToday = getDateOfToday();

		this._todayRecordAutoResetter = setInterval(() =>
		{
			if (eval(getDateOfToday() - dateOfToday) > 0)
			{
				clearInterval(this._todayRecordAutoResetter);
				this._todayRecordAutoResetter = undefined;
				this.trackTodayRecord();
			}
		},
		3000);
	}

	trackTodayRecord ()
	{
		const onError = e => console.error('Fail to track data', e);
		const cb = snapshot =>
		{
			const record = snapshot.val();
			store.commit('SET_TODAY_RECORD', record === null ? undefined : record);
			this._reTrackTodayRecord();
		};
		const dateOfToday = format(Date.now(), 'yyyy-LL-dd');
		const todayMonthWithYear = dateOfToday.slice(0, 7);
		const path = `${getLoggedUser().phoneNumber}/${todayMonthWithYear}/${dateOfToday}`;

		db.ref(path).on('value', cb, onError);
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