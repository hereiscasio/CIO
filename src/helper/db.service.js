import store from '@/store.js';
import { db, getLoggedUser } from '@/plugins/firebase';
import format from 'date-fns/format';

class DbService
{
	_temporaryTrackingDataRef = undefined;

	/**
	 * TODO: try use `child_added` instead of `value`
	 * @param {String} monthWitYear: '2020-03'
	 */
	trackRecordsInFocusedMonth (monthWitYear)
	{
		const cb = (resolve, reject) =>
		{
			this._temporaryTrackingDataRef && this._temporaryTrackingDataRef.off();

			const onError = e => console.error('Fail to track data', e);
			const cb = snapshot =>
			{
				const records = snapshot.val();
				store.commit('SET_MONTH_RECORDS', records === null ? undefined : records);

				resolve();
			}
			const monthWithYear = monthWitYear || format(Date.now(), 'yyyy-LL');
			const path = `${getLoggedUser().phoneNumber}/${monthWithYear}`;

			db.ref(path).on('value', cb, onError);
			this._temporaryTrackingDataRef = db.ref(path);
		};
		return new Promise(cb);
	}

	_todayRecordAutoResetter = undefined;

	_reTrackTodayRecord()
	{
		const getDateOfToday = () => format(Date.now(), 'yyyyLLdd');
		const dateOfToday = getDateOfToday();
		const isToday = () => eval(getDateOfToday() - dateOfToday) <= 0;
		const THREE_SECONDS = 3000;
		const cb = () =>
		{
			if (isToday()) return;
			clearInterval(this._todayRecordAutoResetter);
			this._todayRecordAutoResetter = undefined;
			this.trackTodayRecord();
		};
		this._todayRecordAutoResetter = setInterval(cb, THREE_SECONDS);
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
		const dateOfToday = this._getDateOfToday();
		const monthWithYear = dateOfToday.slice(0, 7);
		const path = `${getLoggedUser().phoneNumber}/${monthWithYear}/${dateOfToday}`;

		db.ref(path).on('value', cb, onError);
	}

	_getDateOfToday () {
		return format(Date.now(), 'yyyy-LL-dd');
	}

	/**
	 *
	 * @param {Object} record: {clockIn?, clockOut?, date}
	 */
	updateRecord (record)
	{
		const date = record.date;
		const monthWithYear = date.slice(0, 7);
		const path = `${getLoggedUser().phoneNumber}/${monthWithYear}/${date}`;

		db.ref(path).update(record);
	}
}
const dbService = new DbService();

export {
	dbService
}