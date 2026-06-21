import { supabase } from "@/lib/supabase"

export async function login(telefono, password) {
  // Simplificación para la demo: contraseña fija hasta integrar bcrypt + JWT real
  if (password !== "123456") {
    return { ok: false, mensaje: "Credenciales incorrectas." }
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("*, emprendedoras(*)")
    .eq("telefono", telefono)
    .single()

  if (error || !data) {
    return { ok: false, mensaje: "Usuario no encontrado." }
  }

  const usuario = {
    id: data.id,
    nombre: data.nombre,
    telefono: data.telefono,
    roles: [data.rol],
    nombre_negocio: data.emprendedoras?.[0]?.nombre_negocio || null,
  }

  return { ok: true, usuario }
}