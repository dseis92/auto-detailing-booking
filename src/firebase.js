import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDPVdVmwtrQ4Wy942pkR3qQnuPfmHGtTRY",
  authDomain: "picktime-clone.firebaseapp.com",
  projectId: "picktime-clone",
  storageBucket: "picktime-clone.firebasestorage.app",
  messagingSenderId: "1068756725967",
  appId: "1:1068756725967:web:669dc6ec984547417947ba"
}

const app = initializeApp(firebaseConfig)
export const firebaseApp = app
const db = getFirestore(app)

export default db