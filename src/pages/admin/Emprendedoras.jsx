// src/pages/admin/Emprendedoras.jsx - Pagina de administracion para gestionar las emprendedoras registradas en la plataforma, con funcionalidades para aprobar o rechazar solicitudes pendientes y visualizar el estado actual de cada emprendedora

import { useState, useEffect } from "react"
import { getEmprendedoras, cambiarEstadoEmprendedora } from "@/services/emprendedorasService"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { toast } from "sonner"

// Estilos para los estados de las emprendedoras

const badgeEstilo = {
    activa: "bg-[#4CAF50] text-white",
    pendiente: "bg-[#88A5C1] text-white",
    suspendida: "bg-[#E53935] text-white",
    baja: "bg-[#EEE4DC] text-[#7A6A5E]",
}

// Componente principal de la pagina de emprendedoras, muestra una lista de emprendedoras con opciones para aprobar o rechazar solicitudes pendientes y visualizar el estado actual de cada una
export default function Emprendedoras() {
    const [emprendedoras, setEmprendedoras] = useState([])
    const [cargando, setCargando] = useState(true)

    // al cargar el componente, se obtienen las emprendedoras desde el backend y se guardan en el estado, mostrando un loader mientras se cargan los datos
    useEffect(() => {
        setCargando(true)
        getEmprendedoras()
            .then(setEmprendedoras)
            .finally(() => setCargando(false))
    }, [])

    // Funcion para manejar la decision de aprobar o rechazar una solicitud de emprendedora, llama al servicio para actualizar el estado en el backend y luego actualiza el estado local para reflejar el cambio
    async function handleDecision(id, decision) {
        await cambiarEstadoEmprendedora(id, decision)
        setEmprendedoras((prev) =>
            prev.map((e) =>
                e.id === id
                    ? { ...e, estado: decision === "aprobada" ? "activa" : "suspendida" }
                    : e
            )
        )
        if (decision === "aprobada") {
            toast.success("Emprendedora aprobada.")
        } else {
            toast.error("Emprendedora rechazada.")
        }
    }

    // Funcion para manejar la suspension o reactivacion de una emprendedora, dependiendo de su estado actual
    // llama al servicio para actualizar el estado en el backend y luego actualiza el estado local para reflejar el cambio
    async function handleToggleSuspension(id, estadoActual) {
        const nuevoEstado = estadoActual === "suspendida" ? "activa" : "suspendida"
        await cambiarEstadoEmprendedora(id, nuevoEstado === "activa" ? "aprobada" : "rechazada")
        setEmprendedoras((prev) =>
            prev.map((e) => (e.id === id ? { ...e, estado: nuevoEstado } : e))
        )
        toast(nuevoEstado === "activa" ? "Emprendedora reactivada." : "Emprendedora suspendida.", {
            type: nuevoEstado === "activa" ? "success" : "error",
        })
    }

    // Separa las emprendedoras en dos grupos: las que tienen solicitudes pendientes y el resto, para mostrarlas en secciones diferentes
    const pendientes = emprendedoras.filter((e) => e.estado === "pendiente")
    const resto = emprendedoras.filter((e) => e.estado !== "pendiente")

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#3D2B1F]">Emprendedoras</h1>
                <p className="text-[#A08070] text-sm mt-1">{emprendedoras.length} registradas en la plataforma</p>
            </div>

            {/* Loader o contenido */}
            {cargando ? (
                <Loader />
            ) : (
                <>
                    {/* Solicitudes pendientes */}
                    {pendientes.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-sm font-medium text-[#A08070] uppercase tracking-wide mb-3">
                                Solicitudes pendientes ({pendientes.length})
                            </h2>
                            <div className="flex flex-col gap-3">
                                {pendientes.map((e) => (
                                    <div
                                        key={e.id}
                                        className="bg-[#FDF6F0] border border-[#C49A6C] rounded-xl p-5 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-[#3D2B1F]">{e.nombre_negocio}</p>
                                            <p className="text-sm text-[#A08070]">{e.usuario.nombre} · {e.usuario.telefono}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleDecision(e.id, "aprobada")}
                                                className="bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs"
                                            >
                                                Aprobar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDecision(e.id, "rechazada")}
                                                className="border-[#E53935] text-[#E53935] hover:bg-[#FFEBEE] text-xs"
                                            >
                                                Rechazar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Todas las emprendedoras */}
                    <h2 className="text-sm font-medium text-[#A08070] uppercase tracking-wide mb-3">
                        Todas las emprendedoras
                    </h2>
                    <div className="bg-white rounded-xl border border-[#E8DDD6] overflow-hidden">
                        {resto.map((e, i) => (
                            <div
                                key={e.id}
                                className={`flex items-center justify-between p-4 ${i !== resto.length - 1 ? "border-b border-[#E8DDD6]" : ""
                                    }`}
                            >
                                <div>
                                    <p className="font-medium text-[#3D2B1F]">{e.nombre_negocio}</p>
                                    <p className="text-sm text-[#A08070]">{e.usuario.nombre} · {e.usuario.telefono}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeEstilo[e.estado]}`}>
                                        {e.estado}
                                    </span>
                                    {e.estado !== "pendiente" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleSuspension(e.id, e.estado)}
                                            className={`text-xs ${e.estado === "suspendida"
                                                ? "border-[#4CAF50] text-[#4CAF50] hover:bg-[#E8F5E9]"
                                                : "border-[#E53935] text-[#E53935] hover:bg-[#FFEBEE]"
                                                }`}
                                        >
                                            {e.estado === "suspendida" ? "Reactivar" : "Suspender"}
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