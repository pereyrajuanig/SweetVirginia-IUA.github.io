// src/mocks/usuarios.mock.js - Mock de usuarios para pruebas y desarrollo

export const usuariosMock = [
    {
        id: 1,
        nombre: "Ana García",
        telefono: "+5493412345678",
        roles: ["emprendedora"],
        verificado: true,
        suspendido: false,
        created_at: "2025-01-15T10:00:00",
    },
    {
        id: 2,
        nombre: "Marta López",
        telefono: "+5493416789012",
        roles: ["emprendedora"],
        verificado: true,
        suspendido: true,
        created_at: "2025-02-20T14:00:00",
    },
    {
        id: 3,
        nombre: "Juan Pérez",
        telefono: "+5493419876543",
        roles: ["cliente"],
        verificado: true,
        suspendido: false,
        created_at: "2025-03-05T09:00:00",
    },
    {
        id: 4,
        nombre: "María García",
        telefono: "+5493413456789",
        roles: ["cliente"],
        verificado: true,
        suspendido: false,
        created_at: "2025-04-10T11:00:00",
    },
    {
        id: 5,
        nombre: "Admin Sweet Virginia",
        telefono: "+5493410000000",
        roles: ["administrador"],
        verificado: true,
        suspendido: false,
        created_at: "2025-01-01T00:00:00",
    },
]