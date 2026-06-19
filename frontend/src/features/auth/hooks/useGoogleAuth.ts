import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { authApi } from "../api/auth.api";

export const useGoogleAuth = () => {
    const navigate = useNavigate();
    const {login} = useAuthStore();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const idTokenGoogle = credentialResponse.credential;

            const token = await authApi.loginWithGoogle(idTokenGoogle);

            login(token);

            navigate("/home");
        } catch (error) {
            console.error("Error al autenticar con el backend", error);
            alert("Hubo un problema al iniciar sesión. Asegúrate de usar un correo de la UCB.");
        }
    };

    const handleGoogleError = () => {
        console.log("Login Failed");
    }

    return{
        handleGoogleSuccess,
        handleGoogleError
    }
}