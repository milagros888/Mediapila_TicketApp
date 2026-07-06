// Migrar desde: frontend/home.html + frontend/js/main.js (130 líneas) + js/modules/script.js (151 líneas)
// Complejidad: BAJA — buen punto de partida para quien recién arranca con React.
// Contiene: hero banner, buscador de partidos, algunas cards destacadas.



// src/pages/Home.jsx
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MatchCardHome from "../components/MatchCardHome.jsx";
import partidos from "../data/partidos.js";

function Home() {
  const { usuario } = useAuth();
  const carouselRef = useRef(null);
  const [mostrarBotonIzq, setMostrarBotonIzq] = useState(false);
  const [showRestriccionModal, setShowRestriccionModal] = useState(false);
  const navigate = useNavigate();

  const destinoCompra = usuario ? "/partidos" : "#";

  // Solo mostrar los partidos con estado "proximo" o "reprogramado"
  const proximosPartidos = partidos.filter(
    (p) => p.estado === "proximo" || p.estado === "reprogramado"
  );

  const handleComprarEntradasClick = (e) => {
    if (!usuario) {
      e.preventDefault();
      setShowRestriccionModal(true);
    }
  };

  // Portado de script.js: avanzar el carrusel, salvo que ya esté al final
  // (ahí el link "Ver más" navega normal a /partidos)
  const handleScrollRight = (e) => {
    if (!usuario) {
      e.preventDefault();
      setShowRestriccionModal(true);
      return;
    }
    const carousel = carouselRef.current;
    if (!carousel) return;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft < maxScrollLeft - 10) {
      e.preventDefault();
      const anchoCard = carousel.querySelector(".card")?.offsetWidth ?? 0;
      carousel.scrollBy({ left: anchoCard + 24, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const anchoCard = carousel.querySelector(".card")?.offsetWidth ?? 0;
    carousel.scrollBy({ left: -(anchoCard + 24), behavior: "smooth" });
  };

  const handleScroll = () => {
    setMostrarBotonIzq((carouselRef.current?.scrollLeft ?? 0) > 5);
  };

  return (
    <div>
      <section className="hero-section d-flex justify-content-center align-items-center text-center px-3 py-5 w-100">
        <div className="d-flex flex-column align-items-center py-5 my-5 col-12 col-md-8">
          <span className="badge bg-brand rounded-pill px-3 py-2 mb-4">WORLD CUP 2026</span>
          <h1 className="display-3 fw-bold text-uppercase mb-4">
            SIENTE LA PASIÓN DEL JUEGO MÁS GRANDE DEL MUNDO
          </h1>
          <p className="lead mb-5 col-10">
            Asegura tu lugar en la historia. Entradas oficiales disponibles para todos los estadios y fases del torneo.
          </p>
          <Link
            to={destinoCompra}
            onClick={handleComprarEntradasClick}
            className="ta-btn-comprar text-uppercase px-5 py-3 fs-5"
          >
            Comprar entradas
          </Link>
        </div>
      </section>

      <section className="container-fluid px-4 mt-5 mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-uppercase fw-bold mb-1 text-brand">Próximos partidos</h2>
            <p className="mb-0 text-muted">No te pierdas los encuentros más emocionantes de la semana</p>
          </div>
        </div>

        <div id="carousel-wrapper" className="position-relative">
          <div
            className={`position-absolute top-0 start-0 h-100 d-flex align-items-center z-3 carousel-btn-overlay-left pe-none width120 ${mostrarBotonIzq ? "" : "hidden"
              }`}
          >
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-left z-n1"></div>
            <button
              type="button"
              onClick={handleScrollLeft}
              className="btn rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center ms-3 pe-auto wh"
              style={{ backgroundColor: "#ed194d", color: "#fff", border: "none" }}
            >
              <i className="bx bx-chevron-left fs-3"></i>
            </button>
          </div>

          <div
            id="matches-carousel"
            ref={carouselRef}
            onScroll={handleScroll}
            className="d-flex flex-nowrap gap-4 overflow-auto pb-4 px-1"
          >
            {proximosPartidos.length === 0 ? (
              <div className="text-center w-100 py-5 text-muted">
                <i className="bi bi-calendar-x fs-1 mb-3 d-block text-secondary"></i>
                <p className="fw-semibold mb-0">No hay próximos partidos programados en este momento.</p>
              </div>
            ) : (
              proximosPartidos.slice(0, 5).map((partido) => (
                <MatchCardHome
                  key={partido.id}
                  partido={partido}
                  logueado={!!usuario}
                  onShowRestriccionModal={() => setShowRestriccionModal(true)}
                />
              ))
            )}

            <div className="position-sticky end-0 d-flex align-items-center z-3 carousel-btn-overlay ps-5">
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-right z-n1"></div>
              <Link
                to="/partidos"
                onClick={handleScrollRight}
                className="ta-btn-comprar rounded-pill shadow-lg d-flex align-items-center gap-2 me-3 text-nowrap"
              >
                Ver más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de restricción (Blanco con Rojo 🔴⚪) */}
      {showRestriccionModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1055 }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content rounded-3 shadow border-0 p-4 bg-white text-center">
              <div className="mb-3">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "3rem" }}></i>
              </div>
              <h4 className="fw-bold text-dark mb-3">Se requiere una cuenta</h4>
              <p className="text-secondary mb-4 px-2">
                Necesitás una cuenta para poder comprar entradas y ver todos los partidos del calendario.
              </p>
              
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="ta-btn-comprar py-2 fs-6 w-100 fw-bold border-0"
                  onClick={() => {
                    setShowRestriccionModal(false);
                    navigate("/login");
                  }}
                >
                  ¿Tiene cuenta? Iniciar sesión
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary py-2 fs-6 w-100 fw-bold rounded-pill"
                  onClick={() => {
                    setShowRestriccionModal(false);
                    navigate("/registro");
                  }}
                >
                  ¿No tiene cuenta? Cree una aquí
                </button>
                <button
                  type="button"
                  className="btn btn-light py-2 fs-6 w-100 fw-bold rounded-pill text-dark border-0"
                  onClick={() => setShowRestriccionModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;