// Login.jsx - Pagina de inicio de sesion para el panel de gestion de Sweet Virginia

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { login as loginService } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Componente de inicio de sesion
export default function Login() {
    const [telefono, setTelefono] = useState("") // telefono se usa como identificador unico para el login
    const [password, setPassword] = useState("") // contraseña del usuario
    const [error, setError] = useState(null) // mensaje de error en caso de fallo en el login
    const [cargando, setCargando] = useState(false) // estado para indicar que se esta procesando el login

    const { login } = useAuth()  // funcion para actualizar el contexto 
    const navigate = useNavigate() // hook para redirigir a otras paginas

    // se ejecuta al enviar el formulario de login
    async function handleSubmit(e) {
        e.preventDefault() // evita que el formulario recargue la pagina
        setError(null) // resetea el mensaje de error

        if (!telefono.trim() || !password.trim()) { // valida que se hayan ingresado ambos campos
            setError("Por favor ingresa tu teléfono y contraseña.")
            return
        }

        setCargando(true) // indica que se esta procesando el login

        // llama al servicio de login con el telefono y la contraseña ingresados
        const resultado = await loginService(telefono, password)

        // si el login fue exitoso, actualiza el contexto con los datos del usuario y redirige segun su rol
        if (resultado.ok) {
            login(resultado.usuario)
            if (resultado.usuario.roles.includes("administrador")) {
                navigate("/admin/metricas")
            } else {
                navigate("/pedidos")
            }
        } else {
            setError(resultado.mensaje)
        }

        setCargando(false) // indica que se termino de procesar el login
    }

    // renderiza el formulario de login con estilos personalizados y muestra mensajes de error o estado de carga
    return (
        <div className="min-h-screen bg-[#1E1A17] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full border-2 border-[#C49A6C] flex items-center justify-center mb-4">
                        <span className="text-[#C49A6C] text-2xl italic font-serif">SV</span>
                    </div>
                    <h1 className="text-[#C49A6C] text-sm tracking-[0.15em] font-medium uppercase">
                        Sweet Virginia
                    </h1>
                    <p className="text-[#7A6A5E] text-xs mt-1">Panel de gestión</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="bg-[#2A2420] rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-[#A08070] text-xs">Teléfono</Label>
                        <Input
                            type="tel"
                            placeholder="+5493412345678"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="bg-[#1E1A17] border-[#3A2F26] text-[#F0E8DF] placeholder:text-[#5A4A3E]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-[#A08070] text-xs">Contraseña</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#1E1A17] border-[#3A2F26] text-[#F0E8DF] placeholder:text-[#5A4A3E]"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17] font-medium mt-2"
                    >
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </Button>
                </form>

                {/* Hint para pruebas */}
                <p className="text-[#5A4A3E] text-xs text-center mt-4">
                    Emprendedora: +5493412345678 · Admin: +5493410000000 · Pass: 123456
                </p>

            </div>
        </div>
    )
}