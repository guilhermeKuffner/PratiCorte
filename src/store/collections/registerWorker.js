import { collection, addDoc } from "firebase/firestore";
import { db } from '../../config/firebase'

export const addEstablishment = async (data) => {
    await addDoc(collection(db, "estabelecimentos"), data)
}