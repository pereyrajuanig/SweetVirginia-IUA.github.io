// pedidosService.js - Servicio para manejar las operaciones relacionadas con los pedidos, con soporte para mock y API real

import { pedidosMock } from "@/mocks/pedidos.mock"

const USAR_MOCK = true

// funcion para obtener los pedidos, usando el mock o haciendo una peticion a la API real
export async function getPedidos() {
    if (USAR_MOCK) {
        return pedidosMock
    }
    const res = await fetch("/api/v1/pedidos")
    return res.json()
}

// funcion para cambiar el estado de un pedido, usando el mock o haciendo una peticion a la API real
export async function cambiarEstadoPedido(id, nuevoEstado) {
    if (USAR_MOCK) {
        return { id, estado: nuevoEstado }
    }
    const res = await fetch(`/api/v1/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
    })
    return res.json()
}