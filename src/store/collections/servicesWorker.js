import { addDoc } from "./collectionBaseWorker";

export const addService = async (data) => {
    return await addDoc({ collection: "servicos", data: data })
}