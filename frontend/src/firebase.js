import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyCDUZNzlJpQJpO52-8OSjuveW4HbXLIhB8",
    authDomain: "server-services-50a49.firebaseapp.com",
    projectId: "server-services-50a49",
    storageBucket: "server-services-50a49.appspot.com",
    messagingSenderId: "484734300353",
    appId: "1:484734300353:web:e114a73b06c46823c72440",
    measurementId: "G-SJVFBE0VY0",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
