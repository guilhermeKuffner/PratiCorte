import { addDoc, getDoc } from "./collectionBaseWorker";
import { where } from "firebase/firestore"

export const addUser = async (data) => {
    await addDoc({ collection: "usuarios", data: data })
}

export const getUserByEmail = async (email) => {
   return await getDoc({
        collection: "usuarios",
        queries: [
            where("email", "==", email),
        ]
    })
}