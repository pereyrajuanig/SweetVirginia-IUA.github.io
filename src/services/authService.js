// authService.js - Servicio para manejar la autenticacion de usuarios, con soporte para mock y API real
const USAR_MOCK = true

const usuariosMock = [
    {
        id: 1,
        nombre: "Ana García",
        telefono: "+5493412345678",
        roles: ["emprendedora"],
        nombre_negocio: "La Pastelería de Ana",
    },
    {
        id: 2,
        nombre: "Admin Sweet Virginia",
        telefono: "+5493410000000",
        roles: ["administrador"],
    },
]

// funcion para simular el login, busca el usuario en el mock y verifica la contraseña, o hace una peticion a la API real
export async function login(telefono, password) {
    if (USAR_MOCK) {
        const usuario = usuariosMock.find((u) => u.telefono === telefono)
        if (usuario && password === "123456") {
            return { ok: true, usuario }
        }
        return { ok: false, mensaje: "Credenciales incorrectas." }
    }
    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono, password }),
    })
    return res.json()
}