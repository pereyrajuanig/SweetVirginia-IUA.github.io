// pedidos.mock.js - Mock de pedidos para pruebas y desarrollo sin necesidad de una API real

export const pedidosMock = [
    {
        id: 1,
        numero_orden: "ORD-20250601-001",
        cliente: {
            nombre: "Juan Pérez",
            telefono: "+5493412345678",
        },
        estado: "pendiente",
        items: [
            { nombre_producto: "Torta de chocolate", cantidad: 1, precio_unitario: 4500 },
            { nombre_producto: "Alfajores x6", cantidad: 2, precio_unitario: 1800 },
        ],
        subtotal: 8100,
        created_at: "2025-06-01T10:30:00",
    },
    {
        id: 2,
        numero_orden: "ORD-20250601-002",
        cliente: {
            nombre: "María García",
            telefono: "+5493416789012",
        },
        estado: "confirmado",
        items: [
            { nombre_producto: "Cheesecake maracuyá", cantidad: 1, precio_unitario: 3200 },
        ],
        subtotal: 3200,
        created_at: "2025-06-01T11:15:00",
    },
    {
        id: 3,
        numero_orden: "ORD-20250601-003",
        cliente: {
            nombre: "Carlos Rodríguez",
            telefono: "+5493419876543",
        },
        estado: "en_preparacion",
        items: [
            { nombre_producto: "Tiramisu", cantidad: 2, precio_unitario: 2900 },
        ],
        subtotal: 5800,
        created_at: "2025-06-01T12:00:00",
    },
    {
        id: 4,
        numero_orden: "ORD-20250601-004",
        cliente: {
            nombre: "Laura Martínez",
            telefono: "+5493413456789",
        },
        estado: "listo",
        items: [
            { nombre_producto: "Budín de limón", cantidad: 1, precio_unitario: 1500 },
            { nombre_producto: "Torta de chocolate", cantidad: 1, precio_unitario: 4500 },
        ],
        subtotal: 6000,
        created_at: "2025-06-01T09:00:00",
    },
    {
        id: 5,
        numero_orden: "ORD-20250601-005",
        cliente: {
            nombre: "Diego López",
            telefono: "+5493417654321",
        },
        estado: "entregado",
        items: [
            { nombre_producto: "Alfajores x6", cantidad: 3, precio_unitario: 1800 },
        ],
        subtotal: 5400,
        created_at: "2025-05-31T16:30:00",
    },
]
