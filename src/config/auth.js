import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db} from "../config/firebase";


export const handleLogin = async (email, password, setLoading) => {
    setLoading(true)
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log("Usuário logado:", userCredential.user)
        alert("Login realizado com sucesso!")
        window.location.href = "/home"
    } catch (error) {
        let errorMessage = error.message

        if (errorMessage === "Firebase: Error (auth/invalid-credential).") {
            errorMessage = "Email ou senha inválidos, tente novamente"
        }
        alert(`Erro no login: ${errorMessage}`);
        setLoading(false)
    }
}

export const handleLogout = async () => {
    try {
        await signOut(auth);    
        window.location.href = "/";
    } catch (error) {
        console.error("Erro ao deslogar:", error.message);
        alert(`Erro ao deslogar: ${error.message}`);
    }
}

export const checkUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user = auth.currentUser
    if (user) {
        window.location.href = "/home"
    } 
}

export const getEstablishmentByUser = async (email) => {
    const querySnapshot = await getDocs(query(collection(db, "estabelecimentos"), where("email", "==", email)));
    var item = querySnapshot.docs.map(doc => doc.data()); 
    if (item.length === 0) {
        alert("Estabelecimento não encontrado com esse email, tente novamente ou entre em contato com o suporte.")
        handleLogout()
        return null
    } else {
        console.log(item)
        return item[0]
    }
}