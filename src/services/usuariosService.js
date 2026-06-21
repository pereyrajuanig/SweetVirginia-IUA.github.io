import { supabase } from "@/lib/supabase"

export async function getUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener usuarios:", error)
    return []
  }

  return data
}

export async function suspenderUsuario(id, suspendido) {
  const { data, error } = await supabase
    .from("usuarios")
    .update({ suspendido })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar usuario:", error)
    throw error
  }

  return data[0]
}

export async function actualizarUsuario(id, datos) {
  const { data, error } = await supabase
    .from("usuarios")
    .update({ nombre: datos.nombre })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar usuario:", error)
    throw error
  }

  return data[0]
}