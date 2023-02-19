import {getStorage, ref} from 'firebase/storage';
import app from './app';

//Initialize storage
const storage = getStorage(app);

export { storage, ref};