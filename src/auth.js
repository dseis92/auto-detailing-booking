import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPVdVmwtrQ4Wy942pkR3qQnuPfmHGtTRY",
  authDomain: "picktime-clone.firebaseapp.com",
  projectId: "picktime-clone",
  appId: "1:1068756725967:web:669dc6ec984547417947ba"
};

// Prevent double initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default auth;