import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/image.png";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Inicio", href: "/home" },
  { label: "Subir Documento", href: "/workspace" },
  { label: "Mis Documentos", href: "/workflow" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3">
      <div className="max-w-9xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-4">
          <div className="w-80 h-20 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center shrink-0">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <ul className="hidden md:flex items-center gap-30">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-blue-600 font-medium text-md tracking-wide transition-colors duration-200 hover:text-yellow-400 px-1 py-1"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

      <div className="flex gap-8">
        {isAuthenticated ? (
          <>
            <button
                onClick={() => navigate("/profile")}
                className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 hover:bg-yellow-400 hover:text-blue-900"
              >
                  Mi Perfil
            </button>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
          </>
        ) : (
          <a
            href="/login"
            className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 hover:bg-yellow-400 hover:text-blue-900"
          >
            Login
          </a>
        )}
      </div>

        {/* Hamburger menu mobile */}
        <button
          className="md:hidden text-blue-600 hover:text-yellow-400 transition-colors duration-200 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-100">
          <ul className="flex flex-col gap-1 pt-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="block text-blue-600 font-medium text-sm px-4 py-2 rounded-md transition-colors duration-200 hover:text-yellow-400 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="px-4 pt-2">
              <a
                href="#"
                className="block text-center bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors duration-200 hover:bg-yellow-400 hover:text-blue-900"
              >
                Opciones
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}