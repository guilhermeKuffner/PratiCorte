import { db } from '../../config/firebase'
import { doc, setDoc, updateDoc as firebaseUpdateDoc } from "firebase/firestore";
import { v7 as uuidv7 } from 'uuid'
import { collection as fbCollection, getDocs, query, where} from "firebase/firestore";
import { getUsuario } from '../../config/auth';

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

export const updateDoc = async ({ collection, data }) => {
    if (!data.id) {
        console.error("updateDoc: id não informado")
        return false
    }

    data.updatedAt = new Date()
    data.updatedBy = getUsuario()

    try {
        const ref = doc(db, collection, data.id)
        await firebaseUpdateDoc(ref, data)
        return true
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getDoc = async ({ collection, field, equals }) => {
    const q = query(fbCollection(db, collection), where(field, "==", equals))
    const querySnapshot = await getDocs(q)
    const itens = querySnapshot.docs.map(doc => doc.data())
    return itens[0]
}
