import { Link } from "react-router-dom";

// Portado de renderizarCompraExitosa() en cart.js.
export default function CompraExitosa({ numeroOrden }) {
  return (
    <div className="success-container">
      <div className="success-icon-wrapper">
        <i className="bx bx-check" />
      </div>
      <h1 className="success-title">¡COMPRA EXITOSA!</h1>
      <p className="success-subtitle">
        Tu pago fue procesado correctamente. Ya podés disfrutar del partido.
      </p>

      <div className="order-number-box">
        <div className="order-number-label">Número de orden</div>
        <div className="order-number-val">{numeroOrden}</div>
        <div className="order-number-note">Guardá este número para tus registros</div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
        <Link to="/" className="btn-success-home mb-0">
          Volver al inicio
        </Link>
        <Link 
          to="/perfil" 
          state={{ scrollToTickets: true }} 
          className="btn btn-dark rounded-pill fw-bold text-uppercase d-inline-flex align-items-center text-decoration-none"
          style={{ padding: "0.75rem 2.5rem" }}
        >
          Ver mis tickets
        </Link>
      </div>
    </div>
  );
}