import { getDoc, updateDoc } from "./collectionBaseWorker";

export const getEstablishmentByUser = async (user) => {
    return await getDoc({ collection: "estabelecimentos", field: "id", equals: user.estabelecimentoId });
}

export const updateEstablishment = async (data) => {
    return await updateDoc({ collection: "estabelecimentos", data: data});
}
