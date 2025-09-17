import React from "react";
import Link from "next/link";

export default function AlumnoCard({
  name = "",
  id = "",
  bDate = "",
  studentPhone = "",
  phone1 = "",
  phone2 = "",
  parent1 = "",
  parent2 = "",
  status = "",
  medical = "",
  // NUEVO: una de estas dos para mostrar el botón
  editHref,          // string, e.g. `/administrador/alumnos/3/edit`
  onEdit,            // function, e.g. () => router.push(...)
}) {
  const fmt = (v) => (v ? String(v) : "—");
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      if (isNaN(date)) return fmt(d);
      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fmt(d);
    }
  };

  // Corrige booleanos y normaliza estado
  const statusText = (() => {
    if (typeof status === "boolean") return status ? "Activo" : "Inactivo";
    const s = (status || "").toString().trim();
    if (!s) return "Sin estado";
    return s[0].toUpperCase() + s.slice(1);
  })();

  const statusStyle = (() => {
    const s = statusText.toLowerCase();
    if (["activo", "al corriente"].includes(s))
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (["inactivo", "baja", "moroso", "adeudo"].includes(s))
      return "bg-rose-50 text-rose-700 ring-rose-200";
    return "bg-slate-50 text-slate-700 ring-slate-200";
  })();

  const tel = studentPhone || phone1 || phone2 || "";
  const wa = tel ? `https://wa.me/${tel.replace(/[^\d]/g, "")}` : null;
  const telHref = tel ? `tel:${tel}` : null;

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Cabecera */}
      <div className="bg-lightBlue-50/60 px-6 pt-8 pb-6 text-center">
        <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center ring-4 ring-lightBlue-100 bg-white text-lightBlue-700 shadow">
          <i className="fas fa-user-graduate text-xl" aria-hidden />
        </div>

        <h2 className="mt-3 text-2xl font-semibold text-slate-900">{fmt(name)}</h2>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ring-1 ${statusStyle}`}
          >
            <i className="fas fa-check-circle" />
            {statusText}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 px-3 py-1 rounded-full ring-1 ring-slate-200 bg-white">
            <i className="fas fa-hashtag" /> ID: {fmt(id)}
          </span>
        </div>

        <div className="mt-3 flex gap-2 justify-center">
          {telHref && (
            <a
              href={telHref}
              className="text-xs px-3 py-1 rounded-md border border-lightBlue-300 text-lightBlue-700 hover:bg-lightBlue-50 transition"
            >
              <i className="fas fa-phone mr-1" /> Llamar
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1 rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition"
            >
              <i className="fab fa-whatsapp mr-1" /> WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Cuerpo en 2 columnas */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <i className="fas fa-book-open text-lightBlue-600" />
          <span>Información Personal</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Field icon="fas fa-birthday-cake" label="Fecha de nacimiento" value={fmtDate(bDate)} />
          <Field icon="fas fa-mobile-alt" label="Celular del alumno" value={fmt(studentPhone)} />
          <Field icon="fas fa-phone" label="Teléfono 1" value={fmt(phone1)} />
          <Field icon="fas fa-phone-alt" label="Teléfono 2" value={fmt(phone2)} />
          <Field icon="fas fa-user-friends" label="Tutor 1" value={fmt(parent1)} />
          <Field icon="fas fa-user-friends" label="Tutor 2" value={fmt(parent2)} />
        </div>

        {/* Observaciones a ancho completo */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <i className="fas fa-notes-medical text-lightBlue-600" />
            <span>Médico histórico / Observaciones</span>
          </div>
          <div className="mt-2 min-h-[56px] whitespace-pre-line text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            {fmt(medical)}
          </div>
        </div>
      </div>

      {/* FOOTER: botón Editar */}
      {(onEdit || editHref) && (
        <div className="px-6 pb-6 pt-3 border-t border-slate-200 flex justify-end">
          {editHref ? (
            <Link
              href={editHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-lightBlue-600 hover:bg-lightBlue-700 text-white text-sm shadow"
            >
              <i className="fas fa-edit" /> Editar alumno
            </Link>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-lightBlue-600 hover:bg-lightBlue-700 text-white text-sm shadow"
            >
              <i className="fas fa-edit" /> Editar alumno
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <i className={`${icon} mt-1.5 text-lightBlue-600 text-sm`} />
      <div className="flex-1">
        <div className="text-[12px] uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-900">{value}</div>
      </div>
    </div>
  );
}
