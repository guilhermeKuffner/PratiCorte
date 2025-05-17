import { db } from '../../config/firebase'
import { doc, setDoc } from "firebase/firestore";
import { v7 as uuidv7 } from 'uuid'
import { collection, getDocs, query, where} from "firebase/firestore";

export const addDoc = async ({ collection, data }) => {
    if (!data.id) {
        const id = uuidv7()
        data.id = id
    }
    data.createdAt = new Date()
    data.isDeleted = false
    try {
        await setDoc(doc(db, collection, data.id), data)       
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getDoc = async ({ collectionName, field, equals }) => {
    const q = query(collection(db, collectionName), where(field, "==", equals))
    const querySnapshot = await getDocs(q)
    const itens = querySnapshot.docs.map(doc => doc.data())
    return itens[0]
};
