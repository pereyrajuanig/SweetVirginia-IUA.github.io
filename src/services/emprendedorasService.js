// src/services/emprendedorasService.js - Servicio para manejar las solicitudes relacionadas con las emprendedoras, incluyendo obtener la lista de emprendedoras y cambiar su estado (aprobada/suspendida)

import { emprendedorasMock } from "@/mocks/emprendedoras.mock"

const USAR_MOCK = true

export async function getEmprendedoras() {
    if (USAR_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return emprendedorasMock
    }
    const res = await fetch("/api/v1/emprendedoras")
    return res.json()
}

export async function cambiarEstadoEmprendedora(id, decision) {
    if (USAR_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { id, estado: decision === "aprobada" ? "activa" : "suspendida" }
    }
    const res = await fetch(`/api/v1/emprendedoras/solicitud/${id}/decision`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
    })
    return res.json()
}