// AuthContext.jsx - Contexto para manejar la autenticacion y el estado del usuario en toda la app

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null) // crea un contexto para la autenticacion

// Componente proveedor del contexto de autenticacion, maneja el estado del usuario y proporciona funciones para login y logout
export function AuthProvider(props) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    // al montar el componente, intenta recuperar el usuario del localStorage y actualizar el estado, luego marca que ya no esta cargando
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("sv_usuario")
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado))
        }
        setCargando(false)
    }, [])

    // funcion para iniciar sesion, guarda el usuario en el estado y en el localStorage
    function login(datos) {
        setUsuario(datos)
        localStorage.setItem("sv_usuario", JSON.stringify(datos))
    }

    // funcion para cerrar sesion, elimina el usuario del estado y del localStorage
    function logout() {
        setUsuario(null)
        localStorage.removeItem("sv_usuario")
    }

    // calcula si el usuario tiene el rol de emprendedora o administrador para usarlo en la proteccion de rutas
    const esEmprendedora = usuario?.roles?.includes("emprendedora")
    const esAdmin = usuario?.roles?.includes("administrador")

    // si el estado de cargando es true, muestra un loader mientras se recupera el usuario del localStorage
    if (cargando) {
        return (
            <div className="min-h-screen bg-[#1E1A17] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#3A2F26] border-t-[#C49A6C] animate-spin"></div>
            </div>
        )
    }

    // proporciona el contexto de autenticacion a los componentes hijos, incluyendo el usuario, las funciones de login y logout, y los roles
    return (
        <AuthContext.Provider value={{ usuario, login, logout, esEmprendedora, esAdmin }}>
            {props.children}
        </AuthContext.Provider>
    )
}

// hook personalizado para usar el contexto de autenticacion en los componentes, devuelve el valor del contexto
export function useAuth() {
    return useContext(AuthContext)
}
