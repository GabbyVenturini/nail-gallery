import { Link, NavLink } from "react-router-dom";
import frame from "../assets/NailGallery.avif";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../store/AuthContext";

const navItems = [
  { to: "/", label: "HOME" },
  { to: "/shop", label: "SHOP" },
  { to: "/sobre", label: "SOBRE" },
  { to: "/medidas", label: "MEDIDAS" },
];

export default function Header() {
  const { cartCount, settings } = useStore();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container-default flex items-center justify-between gap-5 py-4">
        <nav className="hidden items-center gap-6 text-xs font-semibold tracking-[0.22em] text-neutral-700 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-black" : "hover:text-neutral-500"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="mx-auto lg:mx-0 flex items-center gap-3 transition-transform hover:scale-105">
          <img
            src={settings.logo}
            alt="Logo Nail Gallery"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-neutral-200 object-cover shadow-sm"
          />
          <img
            src={frame}
            alt="Nail Gallery"
            className="h-7 md:h-8 w-auto object-contain opacity-90 hidden sm:block"
          />
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
          <Link to="/shop" className="hidden md:inline hover:text-black">
            Buscar
          </Link>
          <Link to="/carrinho" className="hover:text-black">
            Carrinho ({cartCount})
          </Link>
          {user ? (
            <>
              <Link to="/pedidos" className="hidden md:inline hover:text-black">
                Pedidos
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hidden md:inline hover:text-black">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="hover:text-black">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-black">
                Entrar
              </Link>
              <Link to="/cadastro" className="hidden md:inline hover:text-black">
                Cadastro
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 lg:hidden">
        <div className="container-default flex items-center justify-center gap-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-neutral-700">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-black" : "hover:text-neutral-500"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
