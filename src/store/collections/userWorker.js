import { addDoc, getDoc } from "./collectionBaseWorker";

export const addUser = async (data) => {
    await addDoc({ collection: "usuarios", data: data })
}

export const getUserByEmail = async (email) => {
    return await getDoc({ collectionName: "usuarios", field: "email", equals: email });
}