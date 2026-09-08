// Migrar desde: frontend/login.html + frontend/js/modules/login.js (313 líneas)
// Complejidad: MEDIA. Ojo con la lógica de roles (login.js línea ~116-118):
// redirige a admin.html o home.html según el rol del usuario. En React,
// esto se resuelve seteando el usuario en AuthContext (useAuth) y usando
// <Navigate> de react-router-dom en vez de window.location.href.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";

function Login() {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [usuarioGuardado, setUsuarioGuardado] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje({ texto: "Verificando credenciales...", tipo: "" });

    try {
      const usuarioLogueado = await login(identificador, password);

      if (!usuarioLogueado) {
        setMensaje({ texto: "Usuario o contraseña incorrectos.", tipo: "danger" });
        return;
      }

      setMensaje({ texto: "¡Inicio de sesión exitoso!", tipo: "success" });
      setUsuarioGuardado(usuarioLogueado);
      setShowSuccessModal(true);
    } catch {
      setMensaje({ texto: "No se pudo conectar con el servidor. ¿Está corriendo el backend?", tipo: "danger" });
    }
  }

  const handleAceptarSuccessModal = () => {
    setShowSuccessModal(false);
    if (usuarioGuardado) {
      navigate(usuarioGuardado.rol === "admin" ? "/admin" : "/");
    }
  };

  const handleAutocompletarAdmin = () => {
    setIdentificador("admin");
    setPassword("admin123");
    setMensaje({ texto: "Credenciales de Administrador cargadas en el formulario.", tipo: "info" });
  };

  return (
    <main className="auth-bg d-flex flex-column min-vh-100 font-montserrat text-white justify-content-center align-items-center py-5">
      <div className="w520 w-100 px-3">
        <div className="mb-4 text-start">
          <Link to="/">
            <img
              src="/assets/img/LogoTicketApp.png"
              alt="Logo TicketApp"
              className="img-fluid object-fit-contain"
              width="180"
            />
          </Link>
        </div>
        <h1 className="h2 fw-bold text-uppercase mb-4 text-start lh-sm spacing05">
          COMPRÁ TICKETS AL INSTANTE<br />EN UN SOLO LUGAR
        </h1>

        {/* Cartel informativo de Modo Demostración */}
        <div className="demo-credentials-card mb-4 p-3 text-start">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="demo-badge">DEMO</span>
              <span className="fw-semibold text-white small">Credenciales de Prueba</span>
            </div>
            <button
              type="button"
              className="btn btn-sm demo-btn-autofill py-1 px-2 d-flex align-items-center gap-1 rounded-pill"
              onClick={handleAutocompletarAdmin}
              title="Cargar credenciales de administrador automáticamente"
            >
              <i className="bx bx-bolt-circle text-warning"></i>
              <span>Autocompletar Admin</span>
            </button>
          </div>

          <div className="demo-credentials-body p-2 rounded-2 mb-2">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 small">
              <div>
                <span className="text-white-50 me-1">Rol:</span>
                <strong className="text-white">Admin</strong>
              </div>
              <div>
                <span className="text-white-50 me-1">Usuario:</span>
                <code className="bg-transparent p-0">admin</code>
              </div>
              <div>
                <span className="text-white-50 me-1">Contraseña:</span>
                <code className="bg-transparent p-0">admin123</code>
              </div>
            </div>
          </div>

          <p className="demo-note mb-0 text-white-50">
            <i className="bx bx-info-circle text-info me-1"></i>
            Esta plataforma es un proyecto de demostración. Podés ingresar con el rol <strong>Admin</strong> para gestionar partidos y ver auditorías, o <Link to="/registro" className="text-brand fw-bold text-decoration-none">crear tu propia cuenta</Link> para probar la experiencia como <strong>usuario regular</strong>.
          </p>
        </div>

        <div className="d-flex align-items-center text-white-70 mb-4 fs-6 opacity-75">
          <i className="bx bx-user me-2 fs-5"></i> Ingresá a tu cuenta
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="username" className="form-label small fw-medium text-white-70 mb-2">
              Usuario
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><i className="bx bx-user"></i></span>
              <input
                type="text"
                className="form-control auth-input"
                id="username"
                placeholder="Ingresá tu usuario"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>
          </div>

          <PasswordInput
            id="password"
            label="Contraseña"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mensaje.texto && (
            <p className={`fw-bold small text-center mb-3 text-${mensaje.tipo || "white"}`}>
              {mensaje.texto}
            </p>
          )}

          <button type="submit" className="ta-btn-comprar w-100 py-3 fw-bold text-uppercase mb-4 shadow-sm fs-6">
            Ingresá
          </button>

          <div className="text-center small text-white-50 opacity-75">
            ¿No tenés cuenta?
            <Link to="/registro" className="text-brand fw-bold text-decoration-none ms-1">
              ¡Registrate ahora!
            </Link>
          </div>
        </form>
      </div>

      {/* Modal de éxito de inicio de sesión (Verde) */}
      {showSuccessModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1055 }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-3 shadow border-0 p-4 bg-white text-center">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">¡Ingreso Exitoso!</h5>
              <p className="text-secondary small mb-4">
                Has iniciado sesión correctamente en TicketApp.
              </p>
              <button
                type="button"
                className="btn btn-success w-100 fw-bold rounded-pill py-2"
                onClick={handleAceptarSuccessModal}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;