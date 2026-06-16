// productosService.js - Servicio para manejar las operaciones relacionadas con los productos, con soporte para mock y API real

import { productosMock } from "@/mocks/productos.mock"

const USAR_MOCK = true

// funcion para obtener los productos, usando el mock o haciendo una peticion a la API real
export async function getProductos() {
    if (USAR_MOCK) {
        return productosMock
    }
    const res = await fetch("/api/v1/productos")
    return res.json()
}

// funcion para cambiar la disponibilidad de un producto, usando el mock o haciendo una peticion a la API real
export async function toggleDisponibilidad(id, disponible) {
    if (USAR_MOCK) {
        return { id, disponible }
    }
    const res = await fetch(`/api/v1/productos/${id}/disponibilidad`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible }),
    })
    return res.json()
}