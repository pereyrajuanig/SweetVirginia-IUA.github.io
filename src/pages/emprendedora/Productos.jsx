// Productos.jsx - Pagina de productos para la emprendedora donde puede ver sus productos, su disponibilidad y cambiar su estado
import { useState, useEffect } from "react"
import { getProductos, toggleDisponibilidad } from "@/services/productosService"
import { Button } from "@/components/ui/button"

export default function Productos() {
    const [productos, setProductos] = useState([])
    const [filtro, setFiltro] = useState("todos")

    useEffect(() => {
        getProductos().then(setProductos)
    }, [])

    async function handleToggle(id, disponibleActual) {
        await toggleDisponibilidad(id, !disponibleActual)
        setProductos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, disponible: !disponibleActual } : p))
        )
    }

    const productosFiltrados =
        filtro === "todos"
            ? productos
            : filtro === "disponible"
                ? productos.filter((p) => p.disponible)
                : productos.filter((p) => !p.disponible)

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#3D2B1F]">Mis productos</h1>
                    <p className="text-[#A08070] text-sm mt-1">{productos.length} productos en total</p>
                </div>
                <Button className="bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17]">
                    + Nuevo producto
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6">
                {["todos", "disponible", "no_disponible"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filtro === f
                            ? "bg-[#C49A6C] text-[#1E1A17]"
                            : "bg-[#EEE4DC] text-[#8B6F5E] hover:bg-[#E0D0C0]"
                            }`}
                    >
                        {f === "todos" ? "Todos" : f === "disponible" ? "Disponibles" : "No disponibles"}
                    </button>
                ))}
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productosFiltrados.map((producto) => (
                    <div
                        key={producto.id}
                        className="bg-white rounded-xl border border-[#E8DDD6] p-5"
                    >
                        {/* Imagen placeholder */}
                        <div className="h-32 bg-[#F5E6D8] rounded-lg flex items-center justify-center mb-4">
                            <span className="text-[#C49A6C] text-3xl">🧁</span>
                        </div>

                        {/* Info */}
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="font-medium text-[#3D2B1F]">{producto.nombre}</p>
                                <p className="text-xs text-[#A08070]">{producto.categoria}</p>
                            </div>
                            <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${producto.disponible
                                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                                    : "bg-[#EEE4DC] text-[#8B6F5E]"
                                    }`}
                            >
                                {producto.disponible ? "Disponible" : "No disponible"}
                            </span>
                        </div>

                        <p className="text-sm text-[#5D6D7E] mb-3 line-clamp-2">
                            {producto.descripcion}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#E8DDD6]">
                            <p className="font-medium text-[#C49A6C] font-mono">
                                ${producto.precio.toLocaleString()}
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggle(producto.id, producto.disponible)}
                                className="text-xs border-[#E8DDD6] text-[#7A6A5E] hover:bg-[#EEE4DC]"
                            >
                                {producto.disponible ? "Pausar" : "Activar"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}