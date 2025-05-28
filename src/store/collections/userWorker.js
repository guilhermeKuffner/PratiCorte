import { addDoc, getDoc, getAllDocs, updateDoc, deleteDoc } from "./collectionBaseWorker";
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

export const getUsers = async (id) => {
    return await getAllDocs({
        collection: "usuarios",
        queries: [
            where("estabelecimentoId", "==", id),
        ]
    })
}

export const updateUser = async (data) => {
    return await updateDoc({ collection: "usuarios", data: data })
}

export const deleteUser = async (data) => {
    return await deleteDoc({ collection: "usuarios", data: data })
}