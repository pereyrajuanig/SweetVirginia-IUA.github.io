import { useState, useEffect } from "react";
import { crearPedido } from "@/services/pedidosService";
import { getProductos } from "@/services/productosService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { actualizarPedido } from "@/services/pedidosService";

export default function FormularioPedido({
  emprendedoraId,
  onPedidoCreado,
  pedidoExistente,
  onPedidoActualizado,
}) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [items, setItems] = useState([]);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (open && emprendedoraId) {
      getProductos(emprendedoraId).then(setProductosDisponibles);
    }
  }, [open, emprendedoraId]);

  useEffect(() => {
    if (open && pedidoExistente) {
      setClienteNombre(pedidoExistente.cliente.nombre);
      setClienteTelefono(pedidoExistente.cliente.telefono);
      setNotas(pedidoExistente.notas || "");
      setItems(
        pedidoExistente.items.map((item) => ({
          producto_id: item.producto_id?.toString() || "",
          cantidad: item.cantidad,
          precioManual: item.precio_unitario,
        })),
      );
    }
  }, [open, pedidoExistente]);

  function agregarItem() {
    setItems((prev) => [
      ...prev,
      { producto_id: "", cantidad: 1, precioManual: null },
    ]);
  }

  function actualizarItem(index, campo, valor) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const itemActualizado = { ...item, [campo]: valor };
        if (campo === "producto_id") {
          const producto = productosDisponibles.find(
            (p) => p.id === parseInt(valor),
          );
          itemActualizado.precioManual = producto?.precio_desde || 0;
        }
        return itemActualizado;
      }),
    );
  }

  function quitarItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function calcularSubtotal() {
    return items.reduce((acc, item) => {
      return acc + (item.precioManual || 0) * item.cantidad;
    }, 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !clienteNombre.trim() ||
      !clienteTelefono.trim() ||
      items.length === 0
    ) {
      toast.error(
        "Completá los datos del cliente y agregá al menos un producto.",
      );
      return;
    }

    const itemsCompletos = items.map((item) => {
      const producto = productosDisponibles.find(
        (p) => p.id === parseInt(item.producto_id),
      );
      return {
        producto_id: producto?.id,
        nombre_producto: producto?.nombre || "Producto",
        cantidad: item.cantidad,
        precio_unitario: item.precioManual || 0,
      };
    });

    setGuardando(true);

    try {
      if (pedidoExistente) {
        const actualizado = await actualizarPedido(pedidoExistente.id, {
          cliente_nombre: clienteNombre,
          cliente_telefono: clienteTelefono,
          subtotal: calcularSubtotal(),
          items: itemsCompletos,
          notas: notas,
        });

        toast.success("Pedido actualizado exitosamente.");
        onPedidoActualizado({
          ...pedidoExistente,
          cliente: { nombre: clienteNombre, telefono: clienteTelefono },
          subtotal: calcularSubtotal(),
          items: itemsCompletos,
          notas: notas,
        });
      } else {
        const nuevoPedido = await crearPedido({
          emprendedora_id: emprendedoraId,
          cliente_nombre: clienteNombre,
          cliente_telefono: clienteTelefono,
          subtotal: calcularSubtotal(),
          items: itemsCompletos,
          notas: notas,
        });

        toast.success("Pedido creado exitosamente.");
        onPedidoCreado({
          ...nuevoPedido,
          numero_orden: `ORD-${nuevoPedido.id.toString().padStart(6, "0")}`,
          cliente: { nombre: clienteNombre, telefono: clienteTelefono },
          items: itemsCompletos,
          notas: notas,
        });
      }

      setClienteNombre("");
      setClienteTelefono("");
      setItems([]);
      setNotas("");
      setOpen(false);
    } catch (error) {
      toast.error(
        pedidoExistente
          ? "Hubo un error al actualizar el pedido."
          : "Hubo un error al crear el pedido.",
      );
    }
    setGuardando(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {pedidoExistente ? (
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-[#88A5C1] text-[#1565C0] hover:bg-[#E3F0FA]"
          >
            Editar
          </Button>
        ) : (
          <Button className="bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17]">
            + Nuevo pedido
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#FDF8F4] border-[#E8DDD6] max-h-[85vh] overflow-y-auto overflow-x-hidden w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#3D2B1F]">
            {pedidoExistente ? "Editar pedido" : "Nuevo pedido"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-2 min-w-0"
        >
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-[#7A6A5E] text-xs">
                Nombre del cliente
              </Label>
              <Input
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder="Juan Pérez"
                className="bg-white border-[#E8DDD6]"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-[#7A6A5E] text-xs">Teléfono</Label>
              <Input
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
                placeholder="+5493412345678"
                className="bg-white border-[#E8DDD6]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-[#7A6A5E] text-xs">Productos</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={agregarItem}
                className="text-xs border-[#C49A6C] text-[#C49A6C]"
              >
                + Agregar producto
              </Button>
            </div>

            {items.length === 0 && (
              <p className="text-[#A08070] text-xs text-center py-4">
                Todavía no agregaste productos.
              </p>
            )}

            {items.map((item, index) => {
              const productoSeleccionado = productosDisponibles.find(
                (p) => p.id === parseInt(item.producto_id),
              );
              const tieneRango =
                productoSeleccionado?.precio_hasta &&
                productoSeleccionado.precio_hasta !==
                  productoSeleccionado.precio_desde;

              return (
                <div
                  key={index}
                  className="flex flex-col gap-1.5 p-3 bg-white rounded-lg border border-[#E8DDD6]"
                >
                  <div className="flex flex-col gap-2">
                    <select
                      value={item.producto_id}
                      onChange={(e) =>
                        actualizarItem(index, "producto_id", e.target.value)
                      }
                      className="w-full min-w-0 max-w-full bg-white border border-[#E8DDD6] rounded-md px-3 py-2 text-sm text-[#3D2B1F]"
                    >
                      <option value="">Elegir producto...</option>
                      {productosDisponibles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} (
                          {p.precio_hasta && p.precio_hasta !== p.precio_desde
                            ? `$${p.precio_desde.toLocaleString()} - $${p.precio_hasta.toLocaleString()}`
                            : `$${p.precio_desde.toLocaleString()}`}
                          )
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <Label className="text-[#7A6A5E] text-xs whitespace-nowrap">
                        Cantidad:
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarItem(
                            index,
                            "cantidad",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-16 bg-white border-[#E8DDD6]"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => quitarItem(index)}
                        className="text-xs border-[#E53935] text-[#E53935] ml-auto"
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>

                  {item.producto_id && (
                    <div className="flex flex-col gap-1 pl-1 min-w-0">
                      <Label className="text-[#7A6A5E] text-xs">
                        Precio final{" "}
                        {tieneRango && "(según relleno/decoración)"}
                      </Label>
                      <Input
                        type="number"
                        value={item.precioManual ?? ""}
                        onChange={(e) =>
                          actualizarItem(
                            index,
                            "precioManual",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full max-w-40 bg-white border-[#E8DDD6] h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {items.length > 0 && (
            <p className="text-right text-[#C49A6C] font-mono font-medium">
              Subtotal: ${calcularSubtotal().toLocaleString()}
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#7A6A5E] text-xs">Notas (opcional)</Label>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: relleno de mousse de chocolate, decoración con flores..."
              className="bg-white border-[#E8DDD6]"
            />
          </div>
          <Button
            type="submit"
            disabled={guardando}
            className="w-full bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17] mt-2"
          >
            {guardando
              ? "Guardando..."
              : pedidoExistente
                ? "Guardar cambios"
                : "Crear pedido"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
