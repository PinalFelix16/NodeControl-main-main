// components/utils/pagosUI.js

/** Meses en español para el periodo */
const MESES_ES = [
  "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
  "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE",
];

/** $x.xx MXN */
export function formatCurrency(value) {
  const n = Number(value ?? 0);
  if (!isFinite(n)) return "$0.00";
  try {
    return n.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

/** DD/MM/AAAA */
export function formatFecha(input) {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** “MES/AAAA” a partir de distintas fuentes */
export function periodoFrom(item = {}) {
  const directo = item.periodo ?? item.periodo_text;
  if (directo) return String(directo).toUpperCase();

  let mes = item.periodo_mes ?? item.mes;
  let anio = item.periodo_anio ?? item.anio;

  if (!mes || !anio) {
    const f = item.fecha ?? item.fecha_pago ?? item.created_at;
    if (f) {
      const d = new Date(f);
      if (!Number.isNaN(d.getTime())) {
        mes = d.getMonth() + 1;
        anio = d.getFullYear();
      }
    }
  }

  if (!mes || !anio) return "";
  const idx = Number(mes) - 1;
  const nombreMes = MESES_ES[idx] ?? "";
  if (!nombreMes) return "";
  return `${nombreMes}/${anio}`;
}

/** Obtiene el monto numérico real desde múltiples posibles claves */
export function amountFromPago(p = {}) {
  const candidatos = [
    "importe","importe_total","total","monto","monto_total",
    "cantidad","cantidad_pago","importacion","importación",
  ];
  for (const k of candidatos) {
    const v = p?.[k];
    if (v != null && v !== "") {
      const n = Number(String(v).replace(/[^0-9.-]/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

/** Heurística: ¿es un pago real (no un adeudo/cotización)? */
export function esPagoReal(p = {}) {
  const concepto = String(p.concepto ?? p.tipo ?? p.tipo_pago ?? "").toUpperCase();
  const conceptoOK = ["MENSUALIDAD", "INSCRIPCION", "INSCRIPCIÓN", "RECARGO"].includes(concepto);
  const tieneFechaPago = Boolean(p.fecha_pago); // adeudos/cotizaciones rara vez la traen
  const monto = amountFromPago(p);
  return conceptoOK && tieneFechaPago && monto > 0;
}

/** Normalización de un pago a un shape común */
export function normalizePago(p = {}) {
  const importeNumber = amountFromPago(p);
  return {
    recibo: p.recibo ?? p.folio ?? p.id_recibo ?? p.id ?? "",
    fecha: formatFecha(p.fecha ?? p.fecha_pago ?? p.created_at ?? p.updated_at),
    programa: p.programa ?? p.programa_nombre ?? p.nombre_programa ?? p.program ?? "",
    periodo: periodoFrom(p),
    concepto: String(p.concepto ?? p.tipo ?? p.tipo_pago ?? "").toUpperCase(),
    importe: formatCurrency(importeNumber),
    importeNumber,
  };
}

/** Lista normalizada */
export function normalizePagos(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizePago);
}

/** Extrae id / nombre del alumno desde distintos posibles campos */
export function alumnoIdFrom(p = {}) {
  return p.alumno_id ?? p.id_alumno ?? p.alumnoId ?? p.idAlumno ?? null;
}
export function alumnoNombreFrom(p = {}) {
  return p.alumno_nombre ?? p.nombre_alumno ?? p.alumno?.nombre ?? p.nombre ?? null;
}

/** Llave estable para detectar duplicados */
export function pagoDedupKey(p = {}) {
  const recibo = p.recibo ?? p.folio ?? p.id_recibo ?? p.id ?? "";
  if (recibo) return `R|${recibo}`;
  const f = p.fecha_pago ?? p.fecha ?? p.created_at ?? "";
  const c = (p.concepto ?? p.tipo ?? p.tipo_pago ?? "").toUpperCase();
  const m = amountFromPago(p);
  const per = p.periodo ?? `${p.periodo_mes ?? ""}-${p.periodo_anio ?? ""}`;
  return `F|${f}|C|${c}|M|${m}|P|${per}`;
}

export default normalizePago;
