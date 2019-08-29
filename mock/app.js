var _ = require('lodash-core');
var express = require('express');
var fs = require('fs');
var app = express();
var db = require('./data/db.json')
var usersRouter = require('./routes/users');



/**
 * Advanced:
 */
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var indexRouter = require('./routes/index');
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);
// app.use(logger('dev'));

/**
 * @note we don't need to use `bodyParser.json()` anymore, but it's part of `bodyParser`
 * To handle requests : POST, PATCH, PUT
 */
app.use(express.json());

/**
 * Application-level middleware
 * @note it's part of `bodyParser`, parse URL-encoded bodies
 */
app.use(express.urlencoded({ extended: false }));

/**
 * Remove user account
 * Application-level middleware
 */
app.use('/user/:phoneNumber/*', (req, res, next) =>
{
	const phoneNumber = req.params.phoneNumber
	if (
		phoneNumber.length === 10
	) {
		next() // pass control to next middleware
	} else {
		res.status(400).jsonp({
			error: 'invalid identifier to find user'
		})
	}
})

app.use('/users', usersRouter);

/**
 * Add a new record ✅
 * @note this middleware mount on below certain path
 */
app.post('/user/:phoneNumber/record', (req, res, next) =>
{
	const phoneNumber = req.params.phoneNumber
	const [record, date] = [req.body, Number(req.body.date)]
	const callback = () => res.status(200).send(record)

	db.records[phoneNumber][date] = record
	db.dates[phoneNumber] = _.union(db.dates[phoneNumber], [date])

	writeToDB(db, callback)
})

/**
 * Retrieve a record on certain date ✅
 */
app.get('/user/:phoneNumber/record/:date', (req, res, next) =>
{
	const {date, phoneNumber} = req.params
	const recordOnCertainDate = db.records[phoneNumber][date]

	res.status(200).send(recordOnCertainDate || {})
})

/**
 * Retrieve all records in certain month ✅
 */
app.get('/user/:phoneNumber/records/:monthWithYear', (req, res, next) =>
{
	const recordSet = []
	const {monthWithYear, phoneNumber} = req.params
	const allWorkingDatesOfThisUser = db.dates[phoneNumber]

	allWorkingDatesOfThisUser.map(date =>
	{
		if (_.startsWith(date.toString(), monthWithYear))
		{
			const record = db.records[phoneNumber][date]
			recordSet.push(record)
		}
	})
	res.status(200).send(recordSet)
})

/**
 * Update record on certain date ✅
 */
app.patch('/user/:phoneNumber/record/:date', (req, res, next) =>
{
	const {date, phoneNumber} = req.params
	const editedRecord = req.body
	const callback = () => res.status(200).send(editedRecord)

	db.records[phoneNumber][date] = editedRecord

	writeToDB(db, callback)
})

/**
 * Delete all data of certain user ✅
 * @note
 * 204 = No Content: request was successful but has no content to return
 */
app.delete('/user/:phoneNumber', (req, res, next) =>
{
	const phoneNumber = req.params.phoneNumber
	const callback = () => res.status(204).end()

	_.pull(db.users, phoneNumber)
	delete db.records[phoneNumber]
	delete db.dates[phoneNumber]

	writeToDB(db, callback)
})

function writeToDB(data, callback) {
	console.warn('writeToDB');
	fs.writeFile(__dirname + "/data/db.json", JSON.stringify(data), 'utf8', err =>
	{
		if (err) {
			return console.log(err);
		}
		callback()
	});
}

/**
 * handle 404
 * make sure put this script at the very bottom of the stack
 */
app.use(function (req, res, next) {
	res.status(404).send("404: Sorry can't find that!")
})

module.exports = app;
