# 🎟️ TicketApp — *Tu pasión en primera fila*

> **Plataforma web interactiva para la compra y gestión integral de entradas a partidos de fútbol internacional, con selección visual de butacas en estadio por sectores, flujo de compra guiado y un panel de administración con analíticas y métricas en tiempo real.**

Esta página fue desarrollada en grupo, como uno de los proyectos finales del Bootcamp de **Mediapila**.

*(Grupo 01 — Mediapila)*
* **Aramayo Liberata**
* **Escarlon Milagros**
* **Madera Chiara**
* **Gorosito Mailen**
* **Mesa Fiama**
* **Alave Mailen**
* **Grandotti Lourdes Priscila**

---

## 🔗 Demostración y Enlaces

* 🌐 **[Sitio Web / Demo en Vercel](https://mediapila-ticket-app.vercel.app/)**
* 📁 **[Repositorio en GitHub](https://github.com/milagros888/Mediapila_TicketApp)**

### 🔑 Credenciales de Acceso Demo

| Rol | Usuario | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **🛡️ Administrador** | `admin` | `admin123` | Acceso completo al Panel de Control (`/admin`), gestión de partidos, estadísticas en tiempo real y auditoría. |
| **👤 Usuario Regular** | *Registro libre* | *A elección* | Se puede registrar libremente cualquier usuario nuevo para probar el flujo de selección de butacas, carrito y compra. |

---

## 📌 Tabla de Contenidos
1. [Sobre el Proyecto](#-sobre-el-proyecto)
2. [El Origen y la Propuesta: Proyecto Integrador Mediapila](#-el-origen-y-la-propuesta-proyecto-integrador-mediapila)
3. [Toma de Decisiones de Diseño y UX/UI](#-toma-de-decisiones-de-diseño-y-uxui)
4. [Stack Tecnológico y Decisiones de Arquitectura](#-stack-tecnológico-y-decisiones-de-arquitectura)
5. [Nuevas Ideas Implementadas (Calidad de Vida y Experiencia de Usuario)](#-nuevas-ideas-implementadas-calidad-de-vida-y-experiencia-de-usuario)
6. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 📖 Sobre el Proyecto

**TicketApp** es una solución web integral diseñada para transformar la experiencia de adquisición de entradas deportivas y optimizar el control logístico de eventos masivos de fútbol mundialista.

El sistema fue concebido bajo dos pilares interconectados:

* **Experiencia del Hincha (Client-Side):** Un recorrido intuitivo para explorar el fixture por fases (`16avos`, `8vos`, `4tos`, `Semis`, `Final`), visualizar las tribunas del estadio en un mapa interactivo, seleccionar butacas exactas en tiempo real, procesar pagos mediante un *stepper* de checkout guiado y acceder instantáneamente a sus tickets digitales en su perfil.
* **Centro de Gestión y Auditoría (Admin Hub):** Un panel administrativo integral con KPIs en vivo (asistencia por partido, total recaudado, ocupación porcentual), gráficos interactivos (Chart.js), control total de partidos (creación, edición de estados, reprogramación y precios dinámicos por sector) y una tabla de auditoría sincronizada al instante.

---

## 💡 El Origen y la Propuesta: Proyecto Integrador Mediapila

El punto de partida de este proyecto fue la consigna del **Proyecto Integrador Final del Bootcamp de la Fundación Mediapila**, cuyo propósito pedagógico era integrar todos los conocimientos técnicos adquiridos a lo largo del curso (maquetación semántica, interactividad dinámica con JavaScript, consumo de APIs, manejo de estados, autenticación de usuarios y persistencia).

### 🏟️ La Elección de la Temática (Mundial 2026)
La consigna brindaba la libertad de elegir entre diferentes rubros de reserva y venta de entradas (cines, teatros, recitales o eventos deportivos). Como equipo, decidimos orientarlo a un **estadio de fútbol inspirado en la Copa Mundial 2026**: vimos una oportunidad ideal para aprovechar la pasión y la cercanía de este evento global, creando una experiencia inmersiva para los hinchas.

### 📋 Requisitos Principales de la Consigna
* **Vistas de Usuario / Cliente:**
  * Catálogo de partidos con fechas, fases y países participantes.
  * Selector interactivo de sectores del estadio con mapa visual y selección de butacas individuales.
  * Carrito de compras reactivo con resumen de precios y formulario de checkout.
  * Sistema de autenticación (Login y Registro) con panel de usuario para consultar los tickets adquiridos.
* **Panel de Administración:**
  * Gestor CRUD para dar de alta nuevos partidos, modificar horarios, fases y cancelar/reprogramar encuentros.
  * Configuración personalizada de precios por cada sector del estadio (Palco, Platea, Tribunas).
  * Monitoreo y métricas de recaudación, asistencia y butacas ocupadas.
* **Backend y Persistencia:**
  * Servidor REST en Node.js + Express con base de datos MongoDB para autenticación y roles de usuario (`admin` y `user`).

---

## 🎨 Toma de Decisiones de Diseño y UX/UI

Cada vista y elemento interactivo fue diseñado para transmitir la adrenalina y claridad que requiere una plataforma de eventos en vivo:

### 1. Paleta de Colores e Identidad Visual
* **Rojo Marca e Interacción (`#ed194d` / `#dc3545`):** Utilizado estratégicamente en botones de acción principal (*CTA*), indicadores de fase activa y barras de progreso de ocupación, transmitiendo la energía y pasión del deporte.
* **Modo Oscuro Inmersivo (`#0b0d17`, `#16192b`):** Fondos oscuros elegantes con contraste de grises suaves para hacer resaltar el mapa del estadio, las tarjetas de partidos y las métricas estadísticas.
* **Semántica de Estados:** Verde éxito 🟢 (`#198754`) para confirmaciones de inicio de sesión y compras aprobadas; blanco y rojo 🔴⚪ para avisos informativos y restricciones amigables.

### 2. Mapa Interactivo del Estadio y Butacas
* División clara en 4 sectores oficiales: **Palco (VIP)**, **Platea**, **Tribuna Norte** y **Tribuna Sur**.
* Grilla de asientos interactiva con feedback visual por colores (disponible, seleccionada, ocupada/no disponible) y cálculo de precios en tiempo real según la zona elegida.

---

## 💻 Stack Tecnológico y Decisiones de Arquitectura

* **Frontend:**
  * **React 19:** Componentes funcionales, modularización estricta y reactividad con Hooks.
  * **Vite:** Entorno de desarrollo ultrarrápido y empaquetado optimizado para producción.
  * **React Router v7:** Navegación SPA fluida sin recargas de página (`/`, `/partidos`, `/estadio`, `/asientos`, `/carrito`, `/perfil`, `/admin`, etc.).
  * **Bootstrap 5 + Bootstrap Icons + CSS3 Custom:** Estructura responsiva reforzada con estilos personalizados (`styles.css`, `admin.css`, `carrito.css`).
  * **Chart.js:** Gráficos dinámicos (barras y donas) reactivos a las compras y filtros aplicados.
* **Backend & Autenticación:**
  * **Node.js + Express:** API REST para administración de usuarios (`/api/usuarios`).
  * **MongoDB + Mongoose:** Base de datos NoSQL para gestión de credenciales y perfiles.
  * **CORS & Dotenv:** Seguridad y parametrización de variables de entorno (`VITE_API_URL`).
* **Estado y Sincronización:**
  * **Context API (`AuthContext`, `CartContext`):** Manejo global del estado de autenticación y carrito de compras.
  * **Custom Hooks (`useAdmin`, `useSeating`, `useCheckout`):** Aislamiento absoluto de la lógica de negocio fuera de los componentes visuales.
  * **Base de Datos Unificada con Proxy:** Implementación de un Proxy de JavaScript sobre `localStorage` para que cualquier cambio realizado por el administrador (modificación de precios, cancelación o reprogramación) se refleje al instante en el calendario, carrusel y mapa del estadio de los clientes.

---

## ✨ Nuevas Ideas Implementadas (Calidad de Vida y Experiencia de Usuario)

Con la autorización de mis compañeras he realizado modificaciones para agregar funcionalidad y mejorar la experiencia de usuario, entre ellas destaco las siguientes:

* **Métricas reales y barra de ocupación interactiva:** Reemplazo de valores estáticos por cálculo en vivo de asientos vendidos vs. capacidad del estadio (3.552 butacas) con barra de progreso visual en la tabla de gestión.
* **Filtro de fases en el gráfico de recaudación:** Selector dinámico en Chart.js para auditar ingresos por etapa del torneo (`Todos`, `16avos`, `8vos`, `4tos`, `Semis`, `Final`) evitando gráficos apiñados y facilitando el análisis gerencial.
* **Navegación inteligente con scroll automático:** Botón *"Ver mis tickets"* en la pantalla de éxito que traslada al usuario directamente a la sección de tickets en su perfil.
* **Blindaje y disponibilidad automática:** Los partidos de fases finalizadas pasan automáticamente a estado `"no disponible"`, deshabilitando compras accidentales tanto en las tarjetas como en rutas directas del estadio.
* **Soporte internacional ampliado:** Inclusión de nuevas selecciones como Egipto con renderizado automático de banderas en el administrador y el calendario.
* **Carrusel filtrado dinámico:** El Home muestra exclusivamente los partidos activos (`"proximo"` o `"reprogramado"`), ofreciendo placeholders amigables si no hay eventos inmediatos.
* **Modal de Login Exitoso (Verde 🟢):** Brinda confirmación visual inmediata y amigable tras iniciar sesión con éxito antes de redirigir.
* **Modal de Restricción en Home (Blanco y Rojo 🔴⚪):** Si un usuario no registrado intenta comprar, se despliega un diálogo limpio invitándolo a iniciar sesión o crear cuenta con botones de acceso directo, sin interrumpir abruptamente su navegación.
* **Auto-Desplazamiento Post-Compra:** Al finalizar el pago, el usuario cuenta con el botón *"Ver mis tickets"*, que lo traslada al perfil ejecutando un desplazamiento suave (*smooth scroll*) directo a la sección de tickets adquiridos.
* * **Auto-completado para el Admin:** El log in ahora cuenta con un autocompletado para el administrador, facilitando así el acceso al mismo en la página desplegada.

---

## 📂 Estructura del Proyecto

```text
TicketApp/
├── backend/                  # Servidor Node.js + Express + MongoDB
│   ├── config/               # Conexión a la base de datos (db.js)
│   ├── controllers/          # Controladores de usuarios
│   ├── models/               # Modelos Mongoose (Usuario.js)
│   ├── routes/               # Rutas API (/api/usuarios)
│   └── server.js             # Punto de entrada del backend
│
├── src/                      # Frontend en React 19 + Vite
│   ├── assets/               # Imágenes, logos y recursos estáticos
│   ├── components/           # Componentes reutilizables de UI
│   │   ├── admin/            # Dashboard, Gestor de Partidos, Auditoría y Modales
│   │   ├── checkout/         # Stepper, Formulario de Pago y Resumen
│   │   ├── Navbar.jsx        # Barra de navegación principal
│   │   ├── MatchCard.jsx     # Tarjeta de partido para calendario
│   │   └── HistorialCompras  # Listado de tickets comprados
│   ├── context/              # Contextos globales (AuthContext, CartContext)
│   ├── data/                 # Base de datos de partidos (partidos.js) y estadio
│   ├── hooks/                # Custom Hooks (useAdmin, useSeating, useCheckout)
│   ├── pages/                # Vistas principales (Home, Partidos, Estadio, Admin, etc.)
│   ├── services/             # Cliente API (api.js, usuariosService.js)
│   └── utils/                # Funciones auxiliares y formateadores
│
├── vercel.json               # Configuración de despliegue y SPA rewrites en Vercel
├── vite.config.js            # Configuración de Vite
└── package.json              # Dependencias y scripts del frontend
```
