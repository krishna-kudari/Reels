import { getFirestore, Timestamp, GeoPoint } from "firebase/firestore";
import app from './app';

//Initialoze Firestore
const firestore = getFirestore(app);

export { firestore , Timestamp , GeoPoint};
