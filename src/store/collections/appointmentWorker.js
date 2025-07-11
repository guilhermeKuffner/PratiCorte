import { addDoc, getDoc, updateDoc, getAllDocs } from "./collectionBaseWorker";
import { startOfDay, endOfDay } from 'date-fns';
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

export const getAppointmentByProviderAndDate = async (providerId, date) => {
    console.log(startOfDay(date))
    console.log(endOfDay(date))
    return await getAllDocs({
        collection: "agendamentos",
        queries: [
            where("providerId", "==", providerId),
            where("appointmentDate", ">=", startOfDay(date)),
            where("appointmentDate", "<=", endOfDay(date))
        ]
    })
}