import firebase from 'firebase-admin'
import serviceAccountKey from './serviceAccountKey.json'

firebase.initializeApp({
    credential : firebase.credential.cert(serviceAccountKey)
})

export { firebase }