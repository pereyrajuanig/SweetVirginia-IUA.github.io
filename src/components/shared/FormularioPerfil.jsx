import { useState } from "react";
import { actualizarUsuario } from "@/services/usuariosService";
import { actualizarEmprendedora } from "@/services/emprendedorasService";
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

export default function FormularioPerfil({
  usuario,
  emprendedora,
  onPerfilActualizado,
}) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    nombreNegocio: emprendedora?.nombre_negocio || "",
    descripcion: emprendedora?.descripcion || "",
  });

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nombre.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    setGuardando(true);

    try {
      const usuarioActualizado = await actualizarUsuario(usuario.id, {
        nombre: form.nombre,
      });

      let emprendedoraActualizada = emprendedora;
      if (emprendedora) {
        emprendedoraActualizada = await actualizarEmprendedora(
          emprendedora.id,
          {
            nombre_negocio: form.nombreNegocio,
            descripcion: form.descripcion,
          },
        );
      }

      toast.success("Perfil actualizado exitosamente.");
      onPerfilActualizado(usuarioActualizado, emprendedoraActualizada);
      setOpen(false);
    } catch (error) {
      toast.error("Hubo un error al actualizar el perfil.");
    }

    setGuardando(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#C49A6C] text-[#C49A6C] hover:bg-[#FDF6F0]"
        >
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#FDF8F4] border-[#E8DDD6]">
        <DialogHeader>
          <DialogTitle className="text-[#3D2B1F]">Editar perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#7A6A5E] text-xs">Tu nombre</Label>
            <Input
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="bg-white border-[#E8DDD6]"
            />
          </div>

          {emprendedora && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[#7A6A5E] text-xs">
                  Nombre del negocio
                </Label>
                <Input
                  value={form.nombreNegocio}
                  onChange={(e) =>
                    handleChange("nombreNegocio", e.target.value)
                  }
                  className="bg-white border-[#E8DDD6]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[#7A6A5E] text-xs">Descripción</Label>
                <Textarea
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  className="bg-white border-[#E8DDD6]"
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={guardando}
            className="w-full bg-[#C49A6C] hover:bg-[#B08050] text-[#1E1A17] mt-2"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
