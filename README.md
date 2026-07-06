# Resumen en la práctica

### 1. ¿Qué le pedí a la IA y por qué?

- **Análisis del código original**: Le di acceso a mis archivos viejos de JavaScript y HTML para que entendiera cómo funcionaba mi lógica del Administrador.
- **Migración paso a paso**: Le ordené explícitamente que no me diera un “choclazo” de código, sino que dividiera la migración en pasos pequeños para poder entender el porqué de cada cambio.
- **Modularización por tamaño**: Le puse una regla estricta: si el archivo principal pasaba las 150-200 líneas, debía detenerse y enseñarme a dividir el código en archivos más chicos. Sólo había una excepción: podía ser más largo si había código que era importante y no se podía obviar en determinados jsx.

### 2. ¿Cómo solucioné algunos problemas y qué decisiones tomé?

- **Frené un archivo gigante**: En un momento, la IA intentó meter toda la lógica junta en un solo archivo (específicamente en el `Admin.jsx` ) y tenía más de 800 líneas. Intervení a tiempo y le ordené reestructurar todo.
- **Creación de subcomponentes**: Siguiendo mis indicaciones, la IA me guio para desarmar ese bloque gigante y crear componentes independientes para el **Dashboard**, el **Gestor de Partidos**, la **Auditoría** y el **Modal de Alertas**.
- **Uso de un Custom Hook (`useAdmin`)**: Para dejar el archivo principal ultra limpio (en unas 150 líneas), le pedí extraer toda la lógica de los estados y funciones de negocio a un archivo llamado `useAdmin.js`, logrando separar la vista de la lógica.

### 3. ¿Qué aprendí utilizando la IA en este proceso?

- **A no copiar código a ciegas**: Aprendí que si dejas a la IA libre, genera archivos monstruosos difíciles de mantener. Ponerle límites obliga a la IA a diseñar de forma modular y limpia.
- **Conceptos clave de React**: Gracias a las explicaciones paso a paso, entendí cómo reemplazar la manipulación manual del HTML por el uso de **Estados (`useState`)** y **Efectos (`useEffect`)** para manejar los datos de los partidos de forma reactiva.
- **Estructura profesional**: Logré que mi sección tuviera carpetas de utilidades (`utils`), componentes (`components`) y ganchos (`hooks`), quedando perfectamente alineada con la arquitectura que usaron mis compañeras.
- **A utilizar la terminal:** Último y no menos importante, me gustaría destacar el hecho de haber tenido que aprender a usar la terminal. Comando como el **npm install y npm run dev.** Algo que me “costó” era desconfigurar mi reflejo de usar el “Live Server” y reemplazarlo por esto de arrancar el Vite, para después abrir el localhost correspondiente.

### 📈 Resumen en una Tabla

| **Lo que tenía antes (HTML/JS)** | **Lo que logré con la IA en React** | **Razón Técnica Explicada Simple** |
| --- | --- | --- |
| Un archivo `admin.html` gigante y scripts sueltos. | Una página principal (`Admin.jsx`) que coordina 4 subcomponentes pequeños. | El código es más ordenado, fácil de leer y cada pieza se encarga de una sola cosa. |
| Inyección de texto manual con `innerHTML`. | Uso de **Estados (`useState`)**. | La pantalla se actualiza sola e instantáneamente cuando cambia un dato. |
| Lógica mezclada con los botones. | Un archivo de lógica aislado (`useAdmin.js`). | Separa por completo lo que el usuario ve de los cálculos matemáticos y persistencia. |