import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/auth";
import store from '@/store.js';
import router from '@/router.js';
import { dbService } from '@/helper/db.service.js';
import firebaseConfig from './../../firebase.config.js';
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const headToLoginPage = () => router.push('/login');
const trackTodayRecord = () => dbService.trackTodayRecord();

export const firstTimeLoggedIn = new Promise((resolve, reject) =>
{
	firebase.auth().onAuthStateChanged(user =>
	{
		user && trackTodayRecord();
		store.commit('SET_LOGIN_STATE', user ? true : false);
		resolve && resolve(user ? true : false);
		!user && headToLoginPage();
	},
	error => {
		reject && reject(false);
		console.error('FirebaseError: onAuthStateChanged, Fail to detect login')
	});
});

export const db = firebase.database();
export const getLoggedUser = () => firebase.auth().currentUser;

Vue.prototype.$auth = firebase.auth;