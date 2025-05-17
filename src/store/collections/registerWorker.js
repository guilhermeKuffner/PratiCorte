import { addDoc } from "./collectionBaseWorker";

export const addEstablishment = async (data) => {
    return await addDoc({ collection: "estabelecimentos", data: data })
}