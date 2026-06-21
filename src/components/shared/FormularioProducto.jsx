import { useState, useEffect } from "react";
import { crearProducto, actualizarProducto } from "@/services/productosService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categorias = ["Tortas", "Postres", "Alfajores", "Budines", "Otros"];

export default function FormularioProducto({
  emprendedoraId,
  onProductoCreado,
  productoExistente,
  onProductoActualizado,
}) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precioDesde: "",
    precioHasta: "",
    categoria: "Tortas",
  });
  useEffect(() => {
    if (open && productoExistente) {
      setForm({
        nombre: productoExistente.nombre,
        descripcion: productoExistente.descripcion || "",
        precioDesde: productoExistente.precio_desde.toString(),
        precioHasta: productoExistente.precio_hasta?.toString() || "",
        categoria: productoExistente.categoria,
      });
    }
  }, [open, productoExistente]);

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nombre.trim() || !form.precioDesde) {
      toast.error("Completá al menos el nombre y el precio desde.");
      return;
    }

    setGuardando(true);

    try {
      if (productoExistente) {
        const actualizado = await actualizarProducto(productoExistente.id, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio_desde: parseFloat(form.precioDesde),
          precio_hasta: form.precioHasta ? parseFloat(form.precioHasta) : null,
          categoria: form.categoria,
        });

        toast.success("Producto actualizado exitosamente.");
        onProductoActualizado(actualizado);
      } else {
        const nuevoProducto = await crearProducto({
          emprendedora_id: emprendedoraId,
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio_desde: parseFloat(form.precioDesde),
          precio_hasta: form.precioHasta ? parseFloat(form.precioHasta) : null,
          categoria: form.categoria,
          disponible: true,
          activo: true,
        });

        toast.success("Producto creado exitosamente.");
        onProductoCreado(nuevoProducto);
      }

      setForm({
        nombre: "",
        descripcion: "",
        precioDesde: "",
        precioHasta: "",
        categoria: "Tortas",
      });
      setOpen(false);
    } catch (error) {
      toast.error(
        productoExistente
          ? "Hubo un error al actualizar el producto."
          : "Hubo un error al crear el producto.",
      );
    }

    setGuardando(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {productoExistente ? (
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-[#88A5C1] text-[#1565C0] hover:bg-[#E3F0FA]"
          >
            Editar
          </Button>
        ) : (
          <Button className="bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17]">
            + Nuevo producto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#FDF8F4] border-[#E8DDD6]">
        <DialogHeader>
          <DialogTitle className="text-[#3D2B1F]">
            {productoExistente ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#7A6A5E] text-xs">Nombre</Label>
            <Input
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Torta de chocolate"
              className="bg-white border-[#E8DDD6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[#7A6A5E] text-xs">Descripción</Label>
            <Textarea
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              placeholder="Torta húmeda de chocolate con ganache..."
              className="bg-white border-[#E8DDD6]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-[#7A6A5E] text-xs">Precio desde</Label>
              <Input
                type="number"
                value={form.precioDesde}
                onChange={(e) => handleChange("precioDesde", e.target.value)}
                placeholder="4000"
                className="bg-white border-[#E8DDD6]"
              />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-[#7A6A5E] text-xs">
                Precio hasta (opcional)
              </Label>
              <Input
                type="number"
                value={form.precioHasta}
                onChange={(e) => handleChange("precioHasta", e.target.value)}
                placeholder="7000"
                className="bg-white border-[#E8DDD6]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[#7A6A5E] text-xs">Categoría</Label>
            <select
              value={form.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
              className="bg-white border border-[#E8DDD6] rounded-md px-3 py-2 text-sm text-[#3D2B1F]"
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={guardando}
            className="w-full bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17] mt-2"
          >
            {guardando
              ? "Guardando..."
              : productoExistente
                ? "Guardar cambios"
                : "Crear producto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
