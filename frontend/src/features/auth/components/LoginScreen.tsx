import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

type Mode = 'login' | 'register';

export const LoginScreen = () => {
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();
  const { handleLogin, isLoading: isLoginLoading, error: loginError } = useLogin();
  const { handleRegister, isLoading: isRegisterLoading, error: registerError } = useRegister();

  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginCredentials>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterCredentials>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const PasswordToggle = () => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        <div className="bg-yellow-400 px-10 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Biblioteca Virtual</h1>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
              mode === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${
              mode === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            Registrarse
          </button>
        </div>

        <div className="px-8 py-7">

          {mode === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="usuario@ucb.edu.bo"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-10"
                  />
                  <PasswordToggle />
                </div>
                <div className="text-right mt-1">
                  <button className="text-xs text-blue-500 hover:text-yellow-500 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {loginError}
                </p>
              )}

              <button
                onClick={() => handleLogin(loginForm)}
                disabled={isLoginLoading}
                className="w-full bg-blue-600 hover:bg-yellow-400 text-white hover:text-blue-900 font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoginLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="usuario@ucb.edu.bo"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-10"
                  />
                  <PasswordToggle />
                </div>
              </div>

              {registerError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {registerError}
                </p>
              )}

              <button
                onClick={() => handleRegister(registerForm)}
                disabled={isRegisterLoading}
                className="w-full bg-blue-600 hover:bg-yellow-400 text-white hover:text-blue-900 font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegisterLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">o continua con</span>
            <div className="flex-1 h-px bg-gray-200" />
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

          <p className="text-center text-xs text-gray-400 mt-5">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-blue-500 hover:text-yellow-500 font-semibold transition-colors"
                >
                  Registrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-500 hover:text-yellow-500 font-semibold transition-colors"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};