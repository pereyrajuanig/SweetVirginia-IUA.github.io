import { supabase } from "@/lib/supabase"

export async function getPedidos(emprendedoraId = null) {
  let query = supabase
    .from("pedidos")
    .select("*, detalle_pedido(*)")
    .order("created_at", { ascending: false })

  if (emprendedoraId) {
    query = query.eq("emprendedora_id", emprendedoraId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener pedidos:", error)
    return []
  }

  // Adaptamos la forma de los datos para que coincida con lo que ya usan los componentes
  return data.map((p) => ({
    id: p.id,
    numero_orden: `ORD-${p.id.toString().padStart(6, "0")}`,
    cliente: { nombre: p.cliente_nombre, telefono: p.cliente_telefono },
    estado: p.estado,
    subtotal: p.subtotal,
    items: p.detalle_pedido.map((item) => ({
      nombre_producto: item.nombre_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
    })),
    created_at: p.created_at,
    notas: p.notas,
  }))
}

export async function cambiarEstadoPedido(id, nuevoEstado) {
  const { data, error } = await supabase
    .from("pedidos")
    .update({ estado: nuevoEstado })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al cambiar estado del pedido:", error)
    throw error
  }

  return data[0]
}

export async function crearPedido(pedido) {
  const { data: pedidoCreado, error: errorPedido } = await supabase
    .from("pedidos")
    .insert([{
      emprendedora_id: pedido.emprendedora_id,
      cliente_nombre: pedido.cliente_nombre,
      cliente_telefono: pedido.cliente_telefono,
      estado: "pendiente",
      subtotal: pedido.subtotal,
      notas: pedido.notas,
    }])
    .select()

  if (errorPedido) {
    console.error("Error al crear pedido:", errorPedido)
    throw errorPedido
  }

  const pedidoId = pedidoCreado[0].id

  const itemsConPedidoId = pedido.items.map((item) => ({
    pedido_id: pedidoId,
    producto_id: item.producto_id,
    nombre_producto: item.nombre_producto,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }))

  const { error: errorItems } = await supabase
    .from("detalle_pedido")
    .insert(itemsConPedidoId)

  if (errorItems) {
    console.error("Error al crear los items del pedido:", errorItems)
    throw errorItems
  }

  return pedidoCreado[0]
}

export async function actualizarPedido(id, pedido) {
  const { data: pedidoActualizado, error: errorPedido } = await supabase
    .from("pedidos")
    .update({
      cliente_nombre: pedido.cliente_nombre,
      cliente_telefono: pedido.cliente_telefono,
      subtotal: pedido.subtotal,
      notas: pedido.notas,
    })
    .eq("id", id)
    .select()

  if (errorPedido) {
    console.error("Error al actualizar pedido:", errorPedido)
    throw errorPedido
  }

  // Borramos los items anteriores y creamos los nuevos
  const { error: errorBorrar } = await supabase
    .from("detalle_pedido")
    .delete()
    .eq("pedido_id", id)

  if (errorBorrar) {
    console.error("Error al borrar items anteriores:", errorBorrar)
    throw errorBorrar
  }

  const itemsConPedidoId = pedido.items.map((item) => ({
    pedido_id: id,
    producto_id: item.producto_id,
    nombre_producto: item.nombre_producto,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }))

  const { error: errorItems } = await supabase
    .from("detalle_pedido")
    .insert(itemsConPedidoId)

  if (errorItems) {
    console.error("Error al crear los nuevos items:", errorItems)
    throw errorItems
  }

  return pedidoActualizado[0]
}