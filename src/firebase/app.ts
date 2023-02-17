import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCi6WuYafys_fL-ivnE7w3xrXG_f18r7s",
  authDomain: "insta-reels-clone-65a4b.firebaseapp.com",
  projectId: "insta-reels-clone-65a4b",
  storageBucket: "insta-reels-clone-65a4b.appspot.com",
  messagingSenderId: "830018947446",
  appId: "1:830018947446:web:fe3efcc70b96680d4c5257"
};

const app = initializeApp(firebaseConfig);
console.log("Initialized firebase app");

export default app;