import { collection, addDoc } from "firebase/firestore";
import { db } from '../../config/firebase'

export const addUser = async (data) => {
    await addDoc(collection(db, "usuarios"), data)
}