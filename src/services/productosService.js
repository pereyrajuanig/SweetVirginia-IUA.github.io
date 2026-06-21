import { supabase } from "@/lib/supabase"

export async function getProductos(emprendedoraId = null) {
  let query = supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false })

  if (emprendedoraId) {
    query = query.eq("emprendedora_id", emprendedoraId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener productos:", error)
    return []
  }

  return data
}

export async function crearProducto(producto) {
  const { data, error } = await supabase
    .from("productos")
    .insert([producto])
    .select()

  if (error) {
    console.error("Error al crear producto:", error)
    throw error
  }

  return data[0]
}

export async function toggleDisponibilidad(id, disponible) {
  const { data, error } = await supabase
    .from("productos")
    .update({ disponible })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar disponibilidad:", error)
    throw error
  }

  return data[0]
}

export async function actualizarProducto(id, producto) {
  const { data, error } = await supabase
    .from("productos")
    .update({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_desde: producto.precio_desde,
      precio_hasta: producto.precio_hasta,
      categoria: producto.categoria,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar producto:", error)
    throw error
  }

  return data[0]
}

export async function eliminarProducto(id) {
  const { data, error } = await supabase
    .from("productos")
    .update({ activo: false })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al eliminar producto:", error)
    throw error
  }

  return data[0]
}