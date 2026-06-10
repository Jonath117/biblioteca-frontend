import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const LoginScreen = () => {
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Biblioteca Virtual</h1>
          <p className="text-gray-500 mt-2">Ingresa con tu correo institucional (@ucb.edu.bo)</p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap 
            shape="pill" 
            theme="outline"
          />
        </div>

      </div>
    </div>
  );
};