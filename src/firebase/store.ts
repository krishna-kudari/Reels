import { getFirestore, Timestamp, GeoPoint } from "firebase/firestore";
import app from './app';

//Initialoze Firestore
const firestore = getFirestore(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { firestore , Timestamp , GeoPoint , db};
