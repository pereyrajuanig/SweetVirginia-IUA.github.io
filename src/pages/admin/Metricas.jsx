// src/pages/admin/Metricas.jsx - Pagina de metricas para el administrador, mostrando estadisticas clave sobre pedidos y productos

import { useState, useEffect } from "react";
import { getPedidos } from "@/services/pedidosService";
import { getProductos } from "@/services/productosService";
import Loader from "@/components/shared/Loader";

// Componente Metricas que muestra estadisticas clave sobre pedidos y productos, como total de pedidos, pendientes, entregados, productos activos
// total de productos y ventas totales, asi como una lista de los ultimos pedidos realizados
export default function Metricas() {
  const [pedidos, setPedidos] = useState([]); // estado para almacenar los pedidos obtenidos del backend
  const [productos, setProductos] = useState([]); // estado para almacenar los productos obtenidos del backend
  const [cargando, setCargando] = useState(true); // estado para mostrar un loader mientras se cargan los datos

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const [pedidosData, productosData] = await Promise.all([
        getPedidos(),
        getProductos(),
      ]);
      setPedidos(pedidosData);
      setProductos(productosData);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  // se calculan las metricas a mostrar en base a los pedidos y productos obtenidos, como total de pedidos, pendientes, entregados, productos activos, total de productos y ventas totales
  const totalPedidos = pedidos.length;
  const pedidosPendientes = pedidos.filter(
    (p) => p.estado === "pendiente",
  ).length;
  const pedidosEntregados = pedidos.filter(
    (p) => p.estado === "entregado",
  ).length;
  const totalProductos = productos.length;
  const productosDisponibles = productos.filter((p) => p.disponible).length;
  const totalVentas = pedidos.reduce((acc, p) => acc + p.subtotal, 0);

  // se crea un array de objetos con la informacion de cada metrica para renderizarla en el UI, incluyendo el label, valor y estilos de color
  const metricas = [
    {
      label: "Total pedidos",
      valor: totalPedidos,
      color: "bg-[#1E1A17] text-[#C49A6C]",
    },
    {
      label: "Pendientes",
      valor: pedidosPendientes,
      color: "bg-[#88A5C1] text-white",
    },
    {
      label: "Entregados",
      valor: pedidosEntregados,
      color: "bg-[#4CAF50] text-white",
    },
    {
      label: "Productos activos",
      valor: productosDisponibles,
      color: "bg-[#C49A6C] text-[#1E1A17]",
    },
    {
      label: "Total productos",
      valor: totalProductos,
      color: "bg-[#EEE4DC] text-[#784212]",
    },
    {
      label: "Ventas totales",
      valor: `$${totalVentas.toLocaleString()}`,
      color: "bg-[#784212] text-[#FDF8F4]",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3D2B1F]">
          Métricas generales
        </h1>
        <p className="text-[#A08070] text-sm mt-1">
          Resumen de actividad de la plataforma
        </p>
      </div>

      {/* Loader o contenido */}
      {cargando ? (
        <Loader />
      ) : (
        <>
          {/* Grid de métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {metricas.map((m) => (
              <div key={m.label} className={`rounded-xl p-5 ${m.color}`}>
                <p className="text-xs font-medium uppercase tracking-wide opacity-70 mb-1">
                  {m.label}
                </p>
                <p className="text-3xl font-bold font-mono">{m.valor}</p>
              </div>
            ))}
          </div>

          {/* Últimos pedidos */}
          <div className="bg-white rounded-xl border border-[#E8DDD6] p-5">
            <h2 className="font-semibold text-[#3D2B1F] mb-4">
              Últimos pedidos
            </h2>
            <div className="flex flex-col gap-3">
              {pedidos.slice(0, 5).map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between py-2 border-b border-[#E8DDD6] last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#3D2B1F]">
                      {pedido.cliente.nombre}
                    </p>
                    <p className="text-xs text-[#A08070] font-mono">
                      {pedido.numero_orden}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#C49A6C] font-mono">
                      ${pedido.subtotal.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#A08070]">
                      {pedido.estado.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
