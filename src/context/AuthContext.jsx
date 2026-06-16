// AuthContext.jsx - Contexto para manejar la autenticacion y el estado del usuario en toda la app

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null); // crea el contexto de autenticacion, inicialmente sin usuario

// componente proveedor del contexto, maneja el estado del usuario y las funciones de login/logout, y calcula los roles del usuario
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);

    function login(datos) { // actualiza el estado del usuario con los datos recibidos al hacer login
        setUsuario(datos);
    }

    function logout() { // limpia el estado del usuario al hacer logout
        setUsuario(null);
    }

    // calcula si el usuario tiene el rol de emprendedora o administrador
    // para facilitar la proteccion de rutas y la renderizacion condicional en los componentes
    const esEmprendedora = usuario?.roles?.includes("emprendedora");
    const esAdmin = usuario?.roles?.includes("administrador");

    return ( // provee el contexto con el usuario, las funciones de login/logout y los roles calculados para que los componentes puedan acceder a ellos
        <AuthContext.Provider
            value={{ usuario, login, logout, esEmprendedora, esAdmin }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// hook personalizado para acceder al contexto de autenticacion desde cualquier componente
// devuelve el valor del contexto que incluye el usuario, las funciones de login/logout y los roles calculados
export function useAuth() {
    return useContext(AuthContext);
}
