// AppRouter.jsx - Define las rutas de la aplicacion y protege las rutas segun el rol del usuario

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/shared/DashboardLayout"

import Login from "@/pages/auth/Login"
import PanelPedidos from "@/pages/emprendedora/PanelPedidos"
import Productos from "@/pages/emprendedora/Productos"
import Perfil from "@/pages/emprendedora/Perfil"
import Emprendedoras from "@/pages/admin/Emprendedoras"
import Usuarios from "@/pages/admin/Usuarios"
import Metricas from "@/pages/admin/Metricas"
import NotFound from "@/pages/NotFound"


// componente para proteger las rutas segun el rol del usuario, redirige a login si no esta autenticado o no tiene el rol requerido
function RutaProtegida({ children, rol }) {
    const { usuario } = useAuth()

    if (!usuario) { // si no hay usuario autenticado, redirige a login
        return <Navigate to="/login" replace />
    }

    if (rol && !usuario.roles.includes(rol)) { // si se especifica un rol y el usuario no lo tiene, redirige a login
        return <Navigate to="/login" replace />
    }

    return <DashboardLayout>{children}</DashboardLayout>
}

function RutaPublica({ children }) {
    const { usuario, esAdmin } = useAuth()

    if (usuario) { // si hay usuario autenticado, redirige a la pagina principal segun su rol
        if (esAdmin) return <Navigate to="/admin/metricas" replace />
        return <Navigate to="/pedidos" replace />
    }

    return children
}

// componente principal del router de la aplicacion, define las rutas y los componentes que se renderizan en cada una
// usando RutaProtegida para proteger las rutas segun el rol del usuario
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />

                <Route path="/pedidos" element={<RutaProtegida rol="emprendedora"><PanelPedidos /></RutaProtegida>} />
                <Route path="/productos" element={<RutaProtegida rol="emprendedora"><Productos /></RutaProtegida>} />
                <Route path="/perfil" element={<RutaProtegida rol="emprendedora"><Perfil /></RutaProtegida>} />

                <Route path="/admin/metricas" element={<RutaProtegida rol="administrador"><Metricas /></RutaProtegida>} />
                <Route path="/admin/emprendedoras" element={<RutaProtegida rol="administrador"><Emprendedoras /></RutaProtegida>} />
                <Route path="/admin/usuarios" element={<RutaProtegida rol="administrador"><Usuarios /></RutaProtegida>} />

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}