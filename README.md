# 📅 CitasIT — Plataforma Web de Reservas & Servicios IT (Full Stack)

Aplicación web Full Stack para la gestión de citas técnicas y reservas de soporte IT. Desarrollada con un backend RESTful en **.NET 8 / C#** y un frontend modular en **HTML5, Tailwind CSS y JavaScript Vanilla**.

---

## 🚀 Tecnologías

### **Backend**
* **Framework:** .NET 8 Web API
* **ORM:** Entity Framework Core 9
* **Base de Datos:** SQLite (`citas.db`)
* **Documentación:** Swagger UI (OpenAPI)
* **Seguridad & CORS:** Manejo de políticas para peticiones entre orígenes.

### **Frontend**
* **Estructura & Estilos:** HTML5, Tailwind CSS (CDN), FontAwesome
* **Lógica Client-Side:** JavaScript (ES6+, `fetch` API, `localStorage`)

---

## ✨ Características

1. **Gestión de Citas:** Registro de nuevas citas especificando fecha, hora, notas del cliente y servicio deseado.
2. **Catálogo de Servicios:** Consulta dinámica de los servicios técnicos disponibles y sus tarifas.
3. **Panel Administrativo:** Control y actualización en tiempo real del estado de cada cita (`Pendiente`, `Completada`, `Cancelada`).
4. **Autenticación Simulada:** Gestión de sesiones local mediante tokens y roles (`Client` / `Admin`).

---

## 🛠️ Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/OscarCast7/CitasIT.git](https://github.com/OscarCast7/CitasIT.git)
   cd CitasIT