import { FirebaseApp, initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};

declare global {
  var app: FirebaseApp | undefined;
}

let app: FirebaseApp;
if (process.env.NODE_ENV == "production") {
  app = initializeApp(firebaseConfig);
} else {
  // @ts-ignore 7017
  if (!global.app) {
    // @ts-ignore 7017
    global.app = initializeApp(firebaseConfig);
    console.log("Initialized firebase app");
  }
  // @ts-ignore 7017
  app = global.app;
}
// const app = initializeApp(firebaseConfig);

export default app;
