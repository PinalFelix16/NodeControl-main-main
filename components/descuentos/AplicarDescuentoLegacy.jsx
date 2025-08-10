"use client";
import { useState, useMemo } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

export default function AplicarDescuentoLegacy({ onClose, onSuccess, defaults={}, lockDefaults=false }) {
  const [form, setForm] = useState({
    id_alumno: defaults.id_alumno || "",
    id_programa: defaults.id_programa || "",
    periodo: defaults.periodo || "",
    descuento: "",
    precio_actual: defaults.precio_actual || "",
    observaciones: "",
  });
  const FieldRO = (p) => <Field {...p} readOnly={lockDefaults} disabled={lockDefaults} />;
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const finalCalculado = useMemo(() => {
    const base = parseFloat(form.precio_actual || 0);
    const pct  = parseFloat(form.descuento || 0);
    if (!base || !pct) return 0;
    return +(base * (1 - pct / 100)).toFixed(2);
  }, [form.precio_actual, form.descuento]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(""); setOkMsg("");

    try {
      const body = new URLSearchParams({
        id_alumno: form.id_alumno,
        id_programa: form.id_programa,
        periodo: form.periodo,
        descuento: form.descuento, // el controller mapea 'descuento' -> porcentaje
        ...(form.precio_actual ? { precio_actual: form.precio_actual } : {}),
        ...(form.observaciones ? { observaciones: form.observaciones } : {}),
      });

      const res = await fetch(`${API}/descuentos`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "No se pudo aplicar el descuento");
      }

      setOkMsg("Descuento aplicado correctamente.");
      onSuccess?.();
      // onClose?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 p-2 min-w-[320px]">
      <h3 className="text-lg font-semibold">Aplicar descuento (modo legado)</h3>

      <Field label="ID Alumno" name="id_alumno" value={form.id_alumno} onChange={onChange} required />
      <Field label="ID Programa" name="id_programa" value={form.id_programa} onChange={onChange} required />
      <Field label="Periodo" name="periodo" value={form.periodo} onChange={onChange} required type="month" />
      <Field label="Descuento %" name="descuento" value={form.descuento} onChange={onChange} placeholder="ej. 10" required />
      <Field label="Precio actual (opcional)" name="precio_actual" value={form.precio_actual} onChange={onChange} placeholder="ej. 600" />
      <TextArea label="Observaciones" name="observaciones" value={form.observaciones} onChange={onChange} />

      <div className="rounded-xl border p-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Final calculado (preview):</span>
          <strong>${finalCalculado.toFixed(2)}</strong>
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {okMsg && <p className="text-sm text-green-600">{okMsg}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
        <button disabled={loading} className="px-4 py-2 rounded bg-black text-white">
          {loading ? "Guardando..." : "Aplicar descuento"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <input {...props} className="w-full mt-1 px-3 py-2 rounded border bg-white" />
    </div>
  );
}
function TextArea({ label, ...props }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <textarea {...props} rows={3} className="w-full mt-1 px-3 py-2 rounded border bg-white" />
    </div>
  );
}
