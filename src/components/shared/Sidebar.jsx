// barra lateral del dashboard, muestra el logo, el nombre del usuario y los links de navegación

import { NavLink, useNavigate } from "react-router-dom" // navLink se usa para los links de navegacion para aplicar estilos activos
import { useAuth } from "@/context/AuthContext" // useAuth se usa para obtener la informacion del usuario y la funcion de logout, así como para determinar si es admin o emprendedora
import { Button } from "@/components/ui/button" // Button se usa para el boton de logout

// Links de navegacion para emprendedora y admin
const navEmprendedora = [
    { path: "/pedidos", label: "Pedidos" },
    { path: "/productos", label: "Productos" },
    { path: "/perfil", label: "Perfil" },
]
// El admin tiene acceso a metricas, gestión de emprendedoras y usuarios
const navAdmin = [
    { path: "/admin/metricas", label: "Métricas" },
    { path: "/admin/emprendedoras", label: "Emprendedoras" },
    { path: "/admin/usuarios", label: "Usuarios" },
]

// Componente Sidebar que se muestra en el dashboard, con el logo, el nombre del usuario y los links de navegacion según su rol (admin o emprendedora)
export default function Sidebar() {
    const { usuario, logout, esAdmin } = useAuth()
    const navigate = useNavigate()

    const nav = esAdmin ? navAdmin : navEmprendedora // Se elige el set de links segun el rol del usuario

    function handleLogout() { // funcion para cerrar sesion la cual llama a la funcion de logout del contexto y luego redirige al login
        logout()
        navigate("/login")
    }

    // Se renderiza la barra lateral con el logo, el nombre del usuario y los links de navegacion, 
    // aplicando estilos activos a los links segun la ruta actual, y un boton de logout al final
    return (
        <aside className="w-56 min-h-screen bg-[#1E1A17] border-r border-[#3A2F26] flex flex-col">

            {/* seccion del logo con un circulo con las iniciales de sweet virginia y el nombre debajo */}
            {/* aplicando estilos para que se vea bien en la barra lateral */}
            {/* Logo */}
            <div className="flex flex-col items-center py-8 border-b border-[#3A2F26]">
                <div className="w-12 h-12 rounded-full border border-[#C49A6C] flex items-center justify-center mb-2">
                    <span className="text-[#C49A6C] text-base italic font-serif">SV</span>
                </div>
                <p className="text-[#C49A6C] text-xs tracking-[0.12em] uppercase">Sweet Virginia</p>
            </div>

            {/* seccion del usuario con el nombre y el rol, aplicando estilos para que se vea bien en la barra lateral
            // y truncando el texto si es muy largo para evitar que se desborde */}
            {/* Usuario */}
            <div className="px-4 py-4 border-b border-[#3A2F26]">
                <p className="text-[#F0E8DF] text-sm font-medium truncate">{usuario?.nombre}</p>
                <p className="text-[#7A6A5E] text-xs truncate">
                    {esAdmin ? "Administrador" : usuario?.nombre_negocio}
                </p>
            </div>

            {/* seccion de navegacion con los links correspodientes al rol del usuario, aplicando estilos
            // activos a los links segun la ruta actual, y un boton de logout al final */}
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

            {/* seccion de logout con un boton que llama a la funcion de logout del contexto y redirige al login */}
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