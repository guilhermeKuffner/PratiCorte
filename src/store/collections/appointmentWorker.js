import { addDoc, getDoc, updateDoc } from "./collectionBaseWorker";
import { where } from "firebase/firestore"

export const addAppointment = async (data) => {
    return await addDoc({ collection: "agendamentos", data: data })
}

export const updateAppointment = async (data) => {
    return await updateDoc({ collection: "agendamentos", data: data })
}

export const getAppointment = async (id) => {
    return await getDoc({
         collection: "agendamentos" ,
         queries: [
            where("estabelecimentoId", "==", id)
        ]
    })
}