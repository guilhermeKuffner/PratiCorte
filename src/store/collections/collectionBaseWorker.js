import { db } from '../../config/firebase'
import { doc, setDoc } from "firebase/firestore";
import { v7 as uuidv7 } from 'uuid'

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
