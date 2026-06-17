// src/components/shared/Loader.jsx - Componente de carga con spinner y mensaje

export default function Loader() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#EEE4DC] border-t-[#C49A6C] animate-spin"></div>
                <p className="text-[#A08070] text-sm">Cargando...</p>
            </div>
        </div>
    )
}