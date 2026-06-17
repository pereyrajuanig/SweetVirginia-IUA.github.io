import { AuthProvider } from "@/context/AuthContext"
import AppRouter from "@/router/AppRouter"
import { Toaster } from "sonner"

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <AppRouter />
    </AuthProvider>
  )
}

export default App