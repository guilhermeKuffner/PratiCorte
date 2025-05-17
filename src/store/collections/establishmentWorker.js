import { getDoc } from "./collectionBaseWorker";

export const getEstablishmentByUser = async (user) => {
    return await getDoc({ collectionName: "estabelecimentos", field: "estabelecimentoId", equals: user.estabelecimentoId });
}

