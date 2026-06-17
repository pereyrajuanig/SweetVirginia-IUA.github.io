// src/pages/NotFound.jsx - Pagina de error 404 personalizada 
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

// Componente principal
export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#1E1A17] flex items-center justify-center p-4">
            <div className="flex flex-col items-center text-center gap-6">

                {/* Logo */}
                <div className="w-16 h-16 rounded-full border border-[#C49A6C] flex items-center justify-center">
                    <span className="text-[#C49A6C] text-xl italic font-serif">SV</span>
                </div>

                {/* Error */}
                <div>
                    <p className="text-[#C49A6C] text-6xl font-bold font-mono mb-2">404</p>
                    <p className="text-[#F0E8DF] text-lg font-medium mb-1">Página no encontrada</p>
                    <p className="text-[#7A6A5E] text-sm">
                        La página que buscás no existe o fue movida.
                    </p>
                </div>

                {/* Botón */}
                <Button
                    onClick={() => navigate(-1)}
                    className="bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17] font-medium"
                >
                    Volver atrás
                </Button>

            </div>
        </div>
    )
}