import { addDoc } from "./collectionBaseWorker";
import { db } from '../../config/firebase'

export const addUser = async (data) => {
    await addDoc({ collection: "usuarios", data: data })
}