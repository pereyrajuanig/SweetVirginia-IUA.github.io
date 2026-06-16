// badge con lo diferentes estilos y etiquetas para los diferentes estados

const estilos = {
    pendiente: "bg-[#E3F0FA] text-[#1565C0]",
    confirmado: "bg-[#EEE4DC] text-[#7A6A5E]",
    en_preparacion: "bg-[#FFF3E0] text-[#E65100]",
    listo: "bg-[#E8F5E9] text-[#2E7D32]",
    entregado: "bg-[#4CAF50] text-white",
    cancelado: "bg-[#FFEBEE] text-[#C62828]",
    no_retirado: "bg-[#F3E5F5] text-[#6A1B9A]",
}

const etiquetas = {
    pendiente: "Pendiente",
    confirmado: "Confirmado",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregado: "Entregado",
    cancelado: "Cancelado",
    no_retirado: "No retirado",
}

// Componente que recibe el estado y muestra el badge correspondiente con el estilo y etiqueta adecuada
export default function BadgeEstado({ estado }) {
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estilos[estado] || "bg-gray-100 text-gray-600"}`}>
            {etiquetas[estado] || estado}
        </span>
    )
}

