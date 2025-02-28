import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

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