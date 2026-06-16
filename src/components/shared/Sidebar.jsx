import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

const navEmprendedora = [
    { path: "/pedidos", label: "Pedidos" },
    { path: "/productos", label: "Productos" },
    { path: "/perfil", label: "Perfil" },
]

const navAdmin = [
    { path: "/admin/metricas", label: "Métricas" },
    { path: "/admin/emprendedoras", label: "Emprendedoras" },
    { path: "/admin/usuarios", label: "Usuarios" },
]

export default function Sidebar() {
    const { usuario, logout, esAdmin } = useAuth()
    const navigate = useNavigate()

    const nav = esAdmin ? navAdmin : navEmprendedora

    function handleLogout() {
        logout()
        navigate("/login")
    }

    return (
        <aside className="w-56 min-h-screen bg-[#1E1A17] border-r border-[#3A2F26] flex flex-col">

            {/* Logo */}
            <div className="flex flex-col items-center py-8 border-b border-[#3A2F26]">
                <div className="w-12 h-12 rounded-full border border-[#C49A6C] flex items-center justify-center mb-2">
                    <span className="text-[#C49A6C] text-base italic font-serif">SV</span>
                </div>
                <p className="text-[#C49A6C] text-xs tracking-[0.12em] uppercase">Sweet Virginia</p>
            </div>

            {/* Usuario */}
            <div className="px-4 py-4 border-b border-[#3A2F26]">
                <p className="text-[#F0E8DF] text-sm font-medium truncate">{usuario?.nombre}</p>
                <p className="text-[#7A6A5E] text-xs truncate">
                    {esAdmin ? "Administrador" : usuario?.nombre_negocio}
                </p>
            </div>

            {/* Navegación */}
            <nav className="flex flex-col gap-1 p-3 flex-1">
                {nav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                ? "bg-[#C49A6C] text-[#1E1A17] font-medium"
                                : "text-[#A08070] hover:text-[#F0E8DF] hover:bg-[#2A2420]"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-[#3A2F26]">
                <Button
                    variant="ghost"
                    className="w-full text-[#7A6A5E] hover:text-[#F0E8DF] hover:bg-[#2A2420] text-sm"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </Button>
            </div>

        </aside>
    )
}