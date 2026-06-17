// src/pages/admin/Usuarios.jsx - Pagina de administracion para gestionar los usuarios registrados en la plataforma, con opciones de busqueda, filtrado por rol y suspension de usuarios

import { useState, useEffect } from "react"
import { getUsuarios, suspenderUsuario } from "@/services/usuariosService"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"

// Estilos para los roles
const rolEstilo = {
    cliente: "bg-[#EEE4DC] text-[#7A6A5E]",
    emprendedora: "bg-[#C49A6C] text-[#1E1A17]",
    administrador: "bg-[#1E1A17] text-[#C49A6C]",
}
// Opciones de filtro por rol
const filtros = ["todos", "cliente", "emprendedora", "administrador"]

// Componente principal
export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [filtro, setFiltro] = useState("todos")
    const [busqueda, setBusqueda] = useState("")
    const [cargando, setCargando] = useState(true)

    useEffect(() => { // Obtener usuarios al cargar la página
        setCargando(true)
        getUsuarios()
            .then(setUsuarios)
            .finally(() => setCargando(false))
    }, [])

    async function handleSuspender(id) { // Suspender usuario y actualizar la lista
        await suspenderUsuario(id)
        setUsuarios((prev) => prev.filter((u) => u.id !== id))
    }

    const usuariosFiltrados = usuarios // Aplicar filtros y busqueda
        .filter((u) => filtro === "todos" || u.roles.includes(filtro))
        .filter((u) =>
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.telefono.includes(busqueda)
        )

    return (
        <div className="w-full max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#3D2B1F]">Usuarios</h1>
                <p className="text-[#A08070] text-sm mt-1">{usuarios.length} usuarios registrados</p>
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 bg-white border border-[#E8DDD6] rounded-lg px-3 py-2 text-sm text-[#3D2B1F] placeholder:text-[#A08070] focus:outline-none focus:border-[#C49A6C]"
                />
                <div className="flex gap-2 flex-wrap">
                    {filtros.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filtro === f
                                ? "bg-[#C49A6C] text-[#1E1A17]"
                                : "bg-[#EEE4DC] text-[#8B6F5E] hover:bg-[#E0D0C0]"
                                }`}
                        >
                            {f === "todos" ? "Todos" : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loader o contenido */}
            {cargando ? (
                <Loader />
            ) : (
                <>
                    {/* Tabla */}
                    <div className="bg-white rounded-xl border border-[#E8DDD6] overflow-hidden">
                        {/* Header tabla */}
                        <div className="hidden sm:grid grid-cols-4 px-4 py-3 bg-[#EEE4DC] text-xs font-medium text-[#7A6A5E] uppercase tracking-wide">
                            <span>Nombre</span>
                            <span>Teléfono</span>
                            <span>Rol</span>
                            <span></span>
                        </div>

                        {usuariosFiltrados.length === 0 && (
                            <p className="text-[#A08070] text-sm text-center py-12">
                                No se encontraron usuarios.
                            </p>
                        )}

                        {usuariosFiltrados.map((usuario, i) => (
                            <div
                                key={usuario.id}
                                className={`flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-0 px-4 py-4 ${i !== usuariosFiltrados.length - 1 ? "border-b border-[#E8DDD6]" : ""
                                    }`}
                            >
                                <p className="font-medium text-[#3D2B1F] text-sm">{usuario.nombre}</p>
                                <p className="text-[#A08070] text-sm font-mono">{usuario.telefono}</p>
                                <div className="flex gap-1 flex-wrap">
                                    {usuario.roles.map((rol) => (
                                        <span
                                            key={rol}
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${rolEstilo[rol]}`}
                                        >
                                            {rol}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    {!usuario.roles.includes("administrador") && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSuspender(usuario.id)}
                                            className="border-[#E53935] text-[#E53935] hover:bg-[#FFEBEE] text-xs"
                                        >
                                            Suspender
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}