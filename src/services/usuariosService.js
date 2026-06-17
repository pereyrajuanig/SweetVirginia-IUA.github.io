// src/services/usuarioService.js - Servicio para manejar las operaciones relacionadas con los usuarios, como obtener la lista de usuarios y suspender un usuario

import { usuariosMock } from "@/mocks/usuarios.mock"

const USAR_MOCK = true

export async function getUsuarios() {
    if (USAR_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return usuariosMock
    }
    const res = await fetch("/api/v1/usuarios")
    return res.json()
}

export async function suspenderUsuario(id) {
    if (USAR_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { id, suspendido: true }
    }
    const res = await fetch(`/api/v1/usuarios/${id}/suspender`, {
        method: "PATCH",
    })
    return res.json()
}