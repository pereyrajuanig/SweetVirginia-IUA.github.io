import { supabase } from "@/lib/supabase"

export async function getEmprendedoras() {
  const { data, error } = await supabase
    .from("emprendedoras")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener emprendedoras:", error)
    return []
  }

  return data
}

export async function crearEmprendedora(emprendedora) {
  // Primero creamos el usuario asociado
  const { data: usuarioCreado, error: errorUsuario } = await supabase
    .from("usuarios")
    .insert([{
      nombre: emprendedora.nombre_contacto,
      telefono: emprendedora.telefono,
      rol: "emprendedora",
    }])
    .select()

  if (errorUsuario) {
    console.error("Error al crear usuario:", errorUsuario)
    throw errorUsuario
  }

  // Después creamos la emprendedora vinculada a ese usuario
  const { data, error } = await supabase
    .from("emprendedoras")
    .insert([{
      nombre_negocio: emprendedora.nombre_negocio,
      descripcion: emprendedora.descripcion,
      telefono: emprendedora.telefono,
      estado: emprendedora.estado,
      usuario_id: usuarioCreado[0].id,
    }])
    .select()

  if (error) {
    console.error("Error al crear emprendedora:", error)
    throw error
  }

  return data[0]
}

export async function cambiarEstadoEmprendedora(id, nuevoEstado) {
  const { data, error } = await supabase
    .from("emprendedoras")
    .update({ estado: nuevoEstado })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al cambiar estado:", error)
    throw error
  }

  return data[0]
}

export async function getEmprendedoraPorTelefono(telefono) {
  const { data, error } = await supabase
    .from("emprendedoras")
    .select("*")
    .eq("telefono", telefono)
    .single()

  if (error) {
    console.error("Error al buscar emprendedora:", error)
    return null
  }

  return data
}

export async function actualizarEmprendedora(id, datos) {
  const { data, error } = await supabase
    .from("emprendedoras")
    .update({
      nombre_negocio: datos.nombre_negocio,
      descripcion: datos.descripcion,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar emprendedora:", error)
    throw error
  }

  return data[0]
}