// Conveniently import this file anywhere to use db

import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_TOKEN,
  authDomain: "hackcities2020-lapaz.firebaseapp.com",
  databaseURL: "https://hackcities2020-lapaz.firebaseio.com",
  projectId: "hackcities2020-lapaz",
  storageBucket: "hackcities2020-lapaz.appspot.com",
  messagingSenderId: "553853632033",
  appId: "1:553853632033:web:6d02910ce126cfbe3fed60"
};

export const db = firebase.initializeApp(firebaseConfig).firestore()


// Export types that exists in Firestore - Uncomment if you need them in your app
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }
