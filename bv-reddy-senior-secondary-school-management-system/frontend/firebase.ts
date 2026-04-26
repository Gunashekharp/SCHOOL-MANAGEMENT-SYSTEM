import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCO-BuVbvYCKA6zxiqva44YaQ3W6CYrlOo',
  authDomain: 'school-ccb1f.firebaseapp.com',
  projectId: 'school-ccb1f',
  storageBucket: 'school-ccb1f.firebasestorage.app',
  messagingSenderId: '772367635823',
  appId: '1:772367635823:web:b00497ddf08f057e1f449a',
  measurementId: 'G-1R40N51KL5',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const initializeAnalytics = async () => {
  const supported = await isSupported();
  return supported ? getAnalytics(app) : null;
};
