// PanelPedidos.jsx - Componente para mostrar y gestionar los pedidos activos en el panel de la emprendedora

import { useState, useEffect } from "react";
import { getPedidos, cambiarEstadoPedido } from "@/services/pedidosService";
import BadgeEstado from "@/components/shared/BadgeEstado";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getEmprendedoraPorTelefono } from "@/services/emprendedorasService";
import FormularioPedido from "@/components/shared/FormularioPedido";

// Definicion de las transiciones de estado de los pedidos y sus etiquetas para los botones
const transiciones = {
  pendiente: { label: "Confirmar", siguiente: "confirmado" },
  confirmado: { label: "Iniciar prep.", siguiente: "en_preparacion" },
  en_preparacion: { label: "Marcar listo", siguiente: "listo" },
  listo: { label: "Entregar", siguiente: "entregado" },
};

// Lista de filtros disponibles para mostrar los pedidos segun su estado
const filtros = [
  "todos",
  "pendiente",
  "confirmado",
  "en_preparacion",
  "listo",
  "entregado",
];

// Componente principal del panel de pedidos, muestra una lista de pedidos activos con opciones para avanzar su estado
export default function PanelPedidos() {
  const [pedidos, setPedidos] = useState([]); // estado para almacenar la lista de pedidos obtenida del servicio
  const [filtro, setFiltro] = useState("todos"); // estado para almacenar el filtro seleccionado por el usuario, por defecto muestra todos los pedidos
  const [cargando, setCargando] = useState(true); // estado para manejar la visualizacion de un loader mientras se obtienen los pedidos
  const { usuario } = useAuth(); // obtenemos el usuario autenticado desde el contexto de autenticacion
  const [emprendedoraId, setEmprendedoraId] = useState(null); // estado para almacenar el id de la emprendedora, necesario para filtrar los pedidos que le corresponden

  // useEffect para obtener el id de la emprendedora a partir del telefono del usuario autenticado, esto se hace para luego filtrar los pedidos que le corresponden
  useEffect(() => {
    if (!usuario) return;

    async function cargarDatos() {
      setCargando(true);
      const emp = await getEmprendedoraPorTelefono(usuario.telefono);
      if (emp) {
        setEmprendedoraId(emp.id);
      }
      const data = emp ? await getPedidos(emp.id) : [];
      setPedidos(data);
      setCargando(false);
    }
    cargarDatos();
  }, [usuario]);

  // Funcion para avanzar el estado de un pedido, llama al servicio para actualizarlo en el backend y luego actualiza el estado local para reflejar el cambio
  async function avanzarEstado(id, siguienteEstado) {
    await cambiarEstadoPedido(id, siguienteEstado); // llama al servicio para cambiar el estado del pedido en el backend
    setPedidos(
      (
        prev, // actualiza el estado local de los pedidos, mapeando sobre la lista y cambiando el estado del pedido que coincide con el id
      ) =>
        prev.map((p) => (p.id === id ? { ...p, estado: siguienteEstado } : p)), // si el id coincide, se crea un nuevo objeto con el mismo contenido pero con el estado actualizado, si no coincide se devuelve el pedido sin cambios
    );
    if (siguienteEstado === "cancelado") {
      toast.error("Pedido cancelado.");
    } else if (siguienteEstado === "entregado") {
      toast.success("Pedido entregado.");
    } else {
      toast.info(`Pedido actualizado a ${siguienteEstado.replace("_", " ")}.`);
    }
  }

  function actualizarPedidoLocal(pedidoActualizado) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === pedidoActualizado.id ? pedidoActualizado : p)),
    );
  }

  // filtra los pedidos segun el estado seleccionado en el filtro
  const pedidosFiltrados =
    filtro === "todos" ? pedidos : pedidos.filter((p) => p.estado === filtro);

  // renderiza la interfaz del panel de pedidos, mostrando un header con el titulo y la cantidad de pedidos
  // un conjunto de botones para seleccionar el filtro, y una lista de tarjetas para cada pedido filtrado que muestra su informacion
  // y un boton para avanzar su estado si es posible
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#3D2B1F]">
            Pedidos activos
          </h1>
          <p className="text-[#A08070] text-sm mt-1">
            {pedidos.length} pedidos en total
          </p>
        </div>
        <FormularioPedido
          emprendedoraId={emprendedoraId}
          onPedidoCreado={(nuevo) => setPedidos((prev) => [nuevo, ...prev])}
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtro === f
                ? "bg-[#C49A6C] text-[#1E1A17]"
                : "bg-[#EEE4DC] text-[#8B6F5E] hover:bg-[#E0D0C0]"
            }`}
          >
            {f === "todos" ? "Todos" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      {cargando ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          {pedidosFiltrados.length === 0 && (
            <p className="text-[#A08070] text-sm text-center py-12">
              No hay pedidos en este estado.
            </p>
          )}
          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl border border-[#E8DDD6] p-5"
            >
              {/* Cabecera del pedido */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-[#A08070] font-mono">
                    {pedido.numero_orden}
                  </p>
                  <p className="font-medium text-[#3D2B1F]">
                    {pedido.cliente.nombre}
                  </p>
                </div>
                <BadgeEstado estado={pedido.estado} />
              </div>

              {/* Items */}
              <div className="flex flex-col gap-1 mb-3">
                {pedido.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#5D6D7E]">
                      {item.cantidad}x {item.nombre_producto}
                    </span>
                    <span className="text-[#A08070] font-mono">
                      ${(item.cantidad * item.precio_unitario).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              {/* Notas */}
              {pedido.notas && (
                <p className="text-xs text-[#A08070] italic mb-3 bg-[#FDF6F0] p-2 rounded-md">
                  📝 {pedido.notas}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8DDD6]">
                <p className="font-medium text-[#C49A6C] font-mono">
                  Total: ${pedido.subtotal.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  {(pedido.estado === "pendiente" ||
                    pedido.estado === "confirmado") && (
                    <FormularioPedido
                      emprendedoraId={emprendedoraId}
                      pedidoExistente={pedido}
                      onPedidoActualizado={actualizarPedidoLocal}
                    />
                  )}
                  {transiciones[pedido.estado] && (
                    <Button
                      size="sm"
                      onClick={() =>
                        avanzarEstado(
                          pedido.id,
                          transiciones[pedido.estado].siguiente,
                        )
                      }
                      className="bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17] text-xs"
                    >
                      {transiciones[pedido.estado].label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
