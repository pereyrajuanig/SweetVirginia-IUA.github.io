// src/pages/emprendedora/Perfil.jsx - Pagina de perfil para la emprendedora donde puede ver su informacion personal y de su negocio, y cerrar sesion

import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

// Componente Perfil que muestra la informacion del usuario y su negocio, con un boton para cerrar sesion
export default function Perfil() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() { // funcion para cerrar sesion la cual llama a la funcion de logout del contexto y luego redirige al login
        logout()
        navigate("/login")
    }

    // Se renderiza la informacion del usuario y su negocio en una card, con un avatar con la inicial del nombre, y un boton para cerrar sesion al final
    return (
        <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#3D2B1F]">Mi perfil</h1>
                <p className="text-[#A08070] text-sm mt-1">Información de tu cuenta y negocio</p>
            </div>

            {/* Card perfil */}
            <div className="bg-white rounded-xl border border-[#E8DDD6] p-6 mb-4">

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#C49A6C] flex items-center justify-center">
                        <span className="text-[#1E1A17] text-xl font-semibold">
                            {usuario?.nombre?.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-[#3D2B1F] text-lg">{usuario?.nombre}</p>
                        <p className="text-[#A08070] text-sm">{usuario?.nombre_negocio}</p>
                    </div>
                </div>

                {/* Datos */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-[#A08070] uppercase tracking-wide">Teléfono</p>
                        <p className="text-[#3D2B1F] font-mono">{usuario?.telefono}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-[#A08070] uppercase tracking-wide">Rol</p>
                        <div className="flex gap-2">
                            {usuario?.roles?.map((rol) => (
                                <span
                                    key={rol}
                                    className="text-xs px-2.5 py-1 rounded-full bg-[#EEE4DC] text-[#7A6A5E] font-medium"
                                >
                                    {rol}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-[#A08070] uppercase tracking-wide">Nombre del negocio</p>
                        <p className="text-[#3D2B1F]">{usuario?.nombre_negocio}</p>
                    </div>
                </div>
            </div>

            {/* Cerrar sesión */}
            <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-[#E8DDD6] text-[#7A6A5E] hover:bg-[#EEE4DC]"
            >
                Cerrar sesión
            </Button>

        </div>
    )
}