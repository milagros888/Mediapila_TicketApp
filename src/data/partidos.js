/**
 * 📂 Archivo: src/data/partidos.js
 * 📝 Propósito: Fuente dinámica unificada para partidos de fútbol.
 * 💡 Descripción: En lugar de un listado estático mockeado, implementa un Proxy
 *    que intercepta accesos a los elementos del array para leerlos en tiempo real de LocalStorage.
 *    Esto unifica las vistas de la app (Home, Calendario, Estadio, Carrito) con el panel de administración.
 */

import { PARTIDOS_MUESTRA } from "../utils/adminHelpers.jsx";

export const FASES = ["16avos", "8vos", "4tos", "Semis", "Final"];

// Convierte "2026-06-29T17:30" -> "Lunes, 29 jun"
function aFechaHumana(fechaISO) {
  if (!fechaISO) return "Lunes, 29 jun";
  try {
    const dateObj = new Date(fechaISO);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    
    const diaSemana = diasSemana[dateObj.getDay()] || "Lunes";
    const diaMes = dateObj.getDate();
    const mesStr = meses[dateObj.getMonth()] || "jun";
    return `${diaSemana}, ${diaMes} ${mesStr}`;
  } catch {
    return "Lunes, 29 jun";
  }
}

// Convierte "2026-06-29T17:30" -> "17:30 HS."
function aHoraHumana(fechaISO) {
  if (!fechaISO) return "15:00 HS.";
  try {
    const dateObj = new Date(fechaISO);
    const horas = String(dateObj.getHours()).padStart(2, "0");
    const minutos = String(dateObj.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos} HS.`;
  } catch {
    return "15:00 HS.";
  }
}

function getPartidosFromStorage() {
  const versionInicializacion = '6';
  const versionGuardada = localStorage.getItem('partidos_inicializados_version');
  let guardados = localStorage.getItem('partidos');

  if (versionGuardada !== versionInicializacion || !guardados) {
    const mapped = PARTIDOS_MUESTRA.map((p) => {
      const fase = p.fase || "16avos";
      return {
        ...p,
        fase,
        estado: fase === "16avos" ? "finalizado" : p.estado
      };
    });
    localStorage.setItem('partidos_inicializados_version', versionInicializacion);
    localStorage.setItem('partidos', JSON.stringify(mapped));
    guardados = JSON.stringify(mapped);
  }

  try {
    const array = JSON.parse(guardados);
    return array.map((m) => {
      // Determinar precios por sector del partido
      let vipPrecio = 5000;
      let plateaPrecio = 5000;
      let generalPrecio = 5000;
      let popularPrecio = 5000;

      if (m.precios) {
        vipPrecio = m.precios.VIP ?? m.precios.vip ?? m.precios.palco ?? m.precios.Palco ?? 5000;
        plateaPrecio = m.precios.platea ?? m.precios.Platea ?? 5000;
        generalPrecio = m.precios.norte ?? m.precios.Norte ?? m.precios.general ?? 5000;
        popularPrecio = m.precios.sur ?? m.precios.Sur ?? m.precios.popular ?? 5000;
      } else if (m.sectores) {
        vipPrecio = m.sectores.find(s => {
          const n = s.nombre.toLowerCase();
          return n.includes("vip") || n.includes("palco");
        })?.precio ?? 5000;
        plateaPrecio = m.sectores.find(s => s.nombre.toLowerCase().includes("platea"))?.precio ?? 5000;
        generalPrecio = m.sectores.find(s => {
          const n = s.nombre.toLowerCase();
          return n.includes("general") || n.includes("norte");
        })?.precio ?? 5000;
        popularPrecio = m.sectores.find(s => {
          const n = s.nombre.toLowerCase();
          return n.includes("popular") || n.includes("sur");
        })?.precio ?? 5000;
      }

      const minPrecio = Math.min(vipPrecio, plateaPrecio, generalPrecio, popularPrecio);

      // Determinar si está disponible (no cancelado)
      const disponible = m.estado !== "cancelado";

      return {
        id: Number(m.id),
        home: { name: m.nombreEquipo1, flag: m.codigoEquipo1 || "placeholder" },
        away: { name: m.nombreEquipo2, flag: m.codigoEquipo2 || "placeholder" },
        date: aFechaHumana(m.fecha),
        time: aHoraHumana(m.fecha),
        stadium: m.estadio || "MetLife Stadium",
        city: m.ciudad || "East Rutherford, EE.UU.",
        fase: m.fase || "16avos",
        local: m.nombreEquipo1,
        visitante: m.nombreEquipo2,
        fecha: m.fecha ? m.fecha.split("T")[0] : "2026-06-29",
        hora: m.fecha ? m.fecha.split("T")[1] || "15:00" : "15:00",
        estadio: m.estadio || "MetLife Stadium",
        ciudad: m.ciudad || "East Rutherford, EE.UU.",
        precio: minPrecio,
        price: `Desde $${minPrecio.toLocaleString("es-AR")}`,
        disponible: disponible,
        estado: m.estado || "proximo",
        precios: {
          VIP: vipPrecio,
          platea: plateaPrecio,
          general: generalPrecio,
          popular: popularPrecio,
          norte: generalPrecio,
          sur: popularPrecio
        }
      };
    });
  } catch (error) {
    console.error("Error cargando partidos desde localStorage:", error);
    return [];
  }
}

// Creamos un Proxy que simula ser un array estático, pero obtiene los datos frescos de localStorage en cada acceso
const partidos = new Proxy([], {
  get(target, prop) {
    const list = getPartidosFromStorage();
    if (prop === "length") return list.length;
    if (prop === "map") return list.map.bind(list);
    if (prop === "filter") return list.filter.bind(list);
    if (prop === "find") return list.find.bind(list);
    if (prop === "slice") return list.slice.bind(list);
    if (prop === "forEach") return list.forEach.bind(list);
    if (prop === "reduce") return list.reduce.bind(list);
    if (prop === "sort") return list.sort.bind(list);
    if (prop === "every") return list.every.bind(list);
    if (prop === "some") return list.some.bind(list);
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    return list[prop];
  }
});

export default partidos;
