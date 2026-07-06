/**
 * 📂 Archivo: src/components/admin/AdminAudit.jsx
 * 📝 Propósito: Pestaña de Auditoría Financiera y Recaudación de Ventas para el Administrador.
 * 💡 Descripción: Muestra las métricas clave de recaudación, asientos ocupados y tickets vendidos.
 *    Integra la biblioteca externa Chart.js mediante referencias (useRef) para dibujar gráficos
 *    interactivos de barras y dona, garantizando su correcta destrucción al desmontar el componente.
 */

import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { obtenerEstadoReal, obtenerSimulacionVentasSector } from "../../utils/adminHelpers.jsx";

function AdminAudit({ partidos }) {
  const [filtroFaseChart, setFiltroFaseChart] = useState("todos");

  // Refs para los canvas de Chart.js
  const canvasBarrasRef = useRef(null);
  const canvasDonaRef = useRef(null);
  const chartBarrasRef = useRef(null);
  const chartDonaRef = useRef(null);

  // Helper para clasificar sector de asiento
  const getSectorFromSeatId = (seatId) => {
    if (!seatId) return "Sur";
    const parts = seatId.split('-');
    const sector = parts[0] || '';
    const firstChar = sector.charAt(0).toUpperCase();
    if (firstChar === 'A') return "Palco";
    if (firstChar === 'D') return "Platea";
    
    const num = parseInt(sector.substring(1), 10);
    if (firstChar === 'B') {
      return num <= 4 ? "Norte" : "Sur";
    }
    if (firstChar === 'C') {
      return num <= 5 ? "Norte" : "Sur";
    }
    return "Norte";
  };

  // Cargamos las compras reales
  const compras = JSON.parse(localStorage.getItem("compras")) || [];
  const partidosActivosIds = new Set(partidos.filter(p => obtenerEstadoReal(p) !== 'cancelado').map(p => String(p.id)));
  const comprasPartidosActivos = compras.filter(c => partidosActivosIds.has(String(c.id_partido)));

  const totalRecaudado = comprasPartidosActivos.reduce((sum, c) => sum + (c.monto_total || 0), 0);
  const totalTickets = comprasPartidosActivos.reduce((sum, c) => sum + (c.asientos ? c.asientos.length : 0), 0);

  const totalCapacidad = partidosActivosIds.size * 3552;
  const promedioOcupacion = totalCapacidad > 0 ? Math.min(100, Math.round((totalTickets / totalCapacidad) * 100)) : 0;

  const formatMonto = (monto) => {
    if (monto >= 1000000) {
      return `$${(monto / 1000000).toFixed(2)}M`;
    }
    return `$${monto.toLocaleString()}`;
  };

  // Efecto para dibujar y actualizar gráficos de Auditoría (Chart.js)
  useEffect(() => {
    if (!canvasBarrasRef.current || !canvasDonaRef.current) {
      return;
    }

    // Destruimos instancias previas para evitar el error "Canvas already in use"
    if (chartBarrasRef.current) {
      chartBarrasRef.current.destroy();
    }
    if (chartDonaRef.current) {
      chartDonaRef.current.destroy();
    }

    const partidosActivos = partidos.filter(p => obtenerEstadoReal(p) !== "cancelado");

    const partidosFiltradosBarras = partidos.filter(p => {
      const cumpleFase = filtroFaseChart === "todos" || String(p.fase).toLowerCase() === filtroFaseChart.toLowerCase();
      return cumpleFase && obtenerEstadoReal(p) !== "cancelado";
    });

    // --- 1. CONFIGURACIÓN DEL GRÁFICO DE BARRAS ---
    const etiquetasBarras = partidosFiltradosBarras.map(p => `${p.nombreEquipo1} vs ${p.nombreEquipo2}`);
    const datosRecaudacion = partidosFiltradosBarras.map(p => {
      const comprasPartido = compras.filter(c => String(c.id_partido) === String(p.id));
      return comprasPartido.reduce((sum, c) => sum + (c.monto_total || 0), 0);
    });

    const ctxBarras = canvasBarrasRef.current.getContext("2d");
    chartBarrasRef.current = new Chart(ctxBarras, {
      type: 'bar',
      data: {
        labels: etiquetasBarras,
        datasets: [{
          label: 'Recaudación ($)',
          data: datosRecaudacion,
          backgroundColor: '#ed194d',
          hoverBackgroundColor: '#d1103e',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Montserrat' } }
          },
          y: {
            beginAtZero: true,
            ticks: { font: { family: 'Montserrat' } }
          }
        }
      }
    });

    // --- 2. CONFIGURACIÓN DEL GRÁFICO DE DONA ---
    const resumenSectores = {
      "Palco": 0,
      "Platea": 0,
      "Norte": 0,
      "Sur": 0
    };
    comprasPartidosActivos.forEach(c => {
      if (c.asientos) {
        c.asientos.forEach(seatId => {
          const secNombre = getSectorFromSeatId(seatId);
          resumenSectores[secNombre] = (resumenSectores[secNombre] || 0) + 1;
        });
      }
    });

    const etiquetasDona = Object.keys(resumenSectores);
    const datosDona = Object.values(resumenSectores);
    const coloresDona = ['#ed194d', '#4d4d4d', '#999999', '#e6e6e6'];

    const ctxDona = canvasDonaRef.current.getContext("2d");
    chartDonaRef.current = new Chart(ctxDona, {
      type: 'doughnut',
      data: {
        labels: etiquetasDona,
        datasets: [{
          data: datosDona,
          backgroundColor: coloresDona,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '70%'
      }
    });

    // Limpieza de gráficos al desmontar
    return () => {
      if (chartBarrasRef.current) {
        chartBarrasRef.current.destroy();
        chartBarrasRef.current = null;
      }
      if (chartDonaRef.current) {
        chartDonaRef.current.destroy();
        chartDonaRef.current = null;
      }
    };
  }, [partidos, filtroFaseChart]);

  // Cálculos locales para la leyenda del gráfico de dona
  const resumenSectoresLegend = {
    "Palco": 0,
    "Platea": 0,
    "Norte": 0,
    "Sur": 0
  };
  comprasPartidosActivos.forEach(c => {
    if (c.asientos) {
      c.asientos.forEach(seatId => {
        const secNombre = getSectorFromSeatId(seatId);
        resumenSectoresLegend[secNombre] = (resumenSectoresLegend[secNombre] || 0) + 1;
      });
    }
  });

  const etiquetasDona = Object.keys(resumenSectoresLegend);
  const datosDona = Object.values(resumenSectoresLegend);
  const totalVentasGlobal = datosDona.reduce((a, b) => a + b, 0);
  const coloresDona = ['#ed194d', '#4d4d4d', '#999999', '#e6e6e6'];

  return (
    <div>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <h2 className="fw-bold">Recaudación y Ventas</h2>
      </div>

      {/* Cajas de estadísticas de Auditoría */}
      <div className="row g-3 mb-4">
        {/* Monto Total Recaudado */}
        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm border-0 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase text-muted xsmall fw-bold">Monto Total Recaudado</span>
                <h3 className="fw-bold my-1">{formatMonto(totalRecaudado)}</h3>
              </div>
              <span className="badge bg-success-subtle text-success p-2 fs-6 rounded">
                <i className="bi bi-cash"></i>
              </span>
            </div>
          </div>
        </div>

        {/* Tickets Vendidos */}
        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm border-0 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase text-muted xsmall fw-bold">Tickets Vendidos</span>
                <h3 className="fw-bold my-1">{totalTickets.toLocaleString()}</h3>
              </div>
              <span className="badge bg-success-subtle text-success p-2 fs-6 rounded">
                <i className="bi bi-ticket-perforated"></i>
              </span>
            </div>
          </div>
        </div>

        {/* Porcentaje de Asientos Ocupados */}
        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm border-0 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase text-muted xsmall fw-bold">Asientos Ocupados</span>
                <h3 className="fw-bold my-1">{promedioOcupacion}%</h3>
              </div>
              <span className="badge bg-info-subtle text-info p-2 fs-6 rounded">
                <i className="bi bi-percent"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de Auditoría con Chart.js */}
      <div className="row g-4 mb-4">
        {/* Gráfico de Barras */}
        <div className="col-12 col-lg-8">
          <div className="card p-3 shadow-sm h-100 border-0 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold m-0">Monto Recaudado por Partido</h6>
              <select 
                className="form-select form-select-sm w-auto" 
                value={filtroFaseChart} 
                onChange={(e) => setFiltroFaseChart(e.target.value)}
              >
                <option value="todos">Todas las fases</option>
                <option value="16avos">16avos</option>
                <option value="8vos">8vos</option>
                <option value="4tos">4tos</option>
                <option value="semis">Semis</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div className="position-relative chart-container-barras">
              <canvas id="grafico-barras" ref={canvasBarrasRef}></canvas>
            </div>
          </div>
        </div>

        {/* Gráfico de Dona */}
        <div className="col-12 col-lg-4">
          <div className="card p-3 shadow-sm h-100 border-0 bg-white">
            <h6 className="fw-bold mb-3">Distribución por Sector</h6>
            <div className="position-relative mb-3 chart-container-dona">
              <canvas id="grafico-dona" ref={canvasDonaRef}></canvas>
            </div>
            <ul className="list-unstyled small m-0" id="grafico-leyenda-sectores">
              {etiquetasDona.length === 0 ? (
                <li className="text-muted text-center py-2">No hay datos de sectores</li>
              ) : (
                etiquetasDona.map((sectorNombre, indice) => {
                  const cantidad = datosDona[indice];
                  const porcentaje = totalVentasGlobal > 0 ? Math.round((cantidad / totalVentasGlobal) * 100) : 0;
                  const color = coloresDona[indice % coloresDona.length];

                  return (
                    <li key={sectorNombre} className="d-flex justify-content-between align-items-center py-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="legend-color-dot" style={{ backgroundColor: color }}></span>
                        <span className="fw-semibold text-dark small">{sectorNombre}</span>
                      </div>
                      <span className="text-muted fw-bold small">{porcentaje}%</span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAudit;
