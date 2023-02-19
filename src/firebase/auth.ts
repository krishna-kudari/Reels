import { getAuth, GoogleAuthProvider} from "firebase/auth";
import app from './app';

//Initialized authentication and get reference to the service.
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider};