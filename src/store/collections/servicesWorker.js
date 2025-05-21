import { addDoc, getAllDocs, updateDoc } from "./collectionBaseWorker";
import { where } from "firebase/firestore"

export const addService = async (data) => {
    return await addDoc({ collection: "servicos", data: data })
}

export const updateService = async (data) => {
    return await updateDoc({ collection: "servicos", data: data })
}

export const getServices = async (id) => {
    return await getAllDocs({
         collection: "servicos" ,
         queries: [
            where("estabelecimentoId", "==", id)
        ]
    })
}