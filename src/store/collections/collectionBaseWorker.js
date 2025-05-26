import { db } from '../../config/firebase'
import { doc, setDoc } from "firebase/firestore";
import { v7 as uuidv7 } from 'uuid'
import { collection as fbCollection, getDocs, query,} from "firebase/firestore";
import { getUsuario, getEstabelecimento } from '../../config/auth';
import { isEmpty } from "../../shared/utils";

export const addDoc = async ({ collection, data }) => {
    if (!data.id) {
        const id = uuidv7()
        data.id = id
    }
    if (!data.estabelecimentoId) {
        try {
            const establishment = getEstabelecimento()
            data.estabelecimentoId = establishment.id
        } catch (error) {
            console.error(error)
            data.estabelecimentoId = null
        }
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

export const updateDoc = async ({ collection, data }) => {
    if (!data.id) {
        console.error("updateDoc: id não informado")
        return false
    }
    data.updatedAt = new Date()
    data.updatedBy = getUsuario()
    try {
        const ref = doc(db, collection, data.id)
        await setDoc(ref, data, { merge: true })
        return true
    } catch (error) {
        console.error(error)
        return null
    }
}


export const getDoc = async ({ collection, queries }) => {
    try {
        if (isEmpty(collection)) {
            alert("getCountByQueries: Collection is null or empty")
            return null
        }
        var qs = queries?.filter(e => e !== false)
        if (isEmpty(qs)) {
            return null
        }
        const q = query(fbCollection(db, collection), ...qs)
        const querySnapshot = await getDocs(q)
        const itens = querySnapshot.docs.map(doc => doc.data()).filter(item => item.isDeleted !== true)
        return itens[0]
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllDocs = async ({ collection, queries }) => {
    try {
        if (isEmpty(collection)) {
            alert("getCountByQueries: Collection is null or empty")
            return []
        }
        var qs = queries?.filter(e => e !== false)
        if (isEmpty(qs)) {
            return []
        }
        const q = query(fbCollection(db, collection), ...qs)
        const querySnapshot = await getDocs(q)
        const itens = querySnapshot.docs.map(doc => doc.data()).filter(item => item.isDeleted !== true)
        return itens
    } catch (error) {
        console.log(error)
        return []
    }
}

export const deleteDoc = async ({ collection, data }) => {
    if (!data.id) {
        console.error("updateDoc: id não informado")
        return false
    }
    data.deletedAt = new Date()
    data.deletedBy = getUsuario()
    data.isDeleted = true
    try {
        const ref = doc(db, collection, data.id)
        await setDoc(ref, data, { merge: true })
        return true
    } catch (error) {
        console.error(error)
        return null
    }
}
