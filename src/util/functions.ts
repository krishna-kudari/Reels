import { storage ,ref } from "@/firebase/storage"
import { StorageReference } from "firebase/storage";


export const getStorageRef = (path:string):StorageReference =>{
    const pathRef = ref(storage,path);
    return pathRef;
}