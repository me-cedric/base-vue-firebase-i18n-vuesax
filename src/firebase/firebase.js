import firebase from 'firebase'
import config from './config'
export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
