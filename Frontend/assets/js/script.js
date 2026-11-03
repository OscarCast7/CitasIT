const API_URL = "http://localhost:5067/api"; // Asegúrate de mantener el puerto de tu API
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

document.addEventListener("DOMContentLoaded", () => {
  updateUserUI();
  loadServices();
  loadAppointments();
});

function toggleAuthModal() {
  const modal = document.getElementById("authModal");
  modal.classList.toggle("hidden");
}

function updateUserUI() {
  const userBadge = document.getElementById("userBadge");
  const authBtn = document.getElementById("authBtn");

  if (currentUser) {
    userBadge.innerHTML = `<span class="text-blue-400 font-semibold">${currentUser.fullName}</span> (${currentUser.role})`;
    authBtn.innerHTML = `<i class="fas fa-sign-out-alt mr-1"></i> Salir`;
    authBtn.onclick = handleLogout;
  } else {
    userBadge.innerText = "Sin iniciar sesión";
    authBtn.innerHTML = `<i class="fas fa-sign-in-alt mr-1"></i> Iniciar Sesión`;
    authBtn.onclick = toggleAuthModal;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const data = await res.json();
    currentUser = data;
    localStorage.setItem("currentUser", JSON.stringify(data));

    updateUserUI();
    toggleAuthModal();
    alert(`Bienvenido/a, ${data.fullName}`);
  } catch (err) {
    alert(err.message);
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUserUI();
}

async function loadServices() {
  try {
    const res = await fetch(`${API_URL}/Services`);
    const services = await res.json();

    const select = document.getElementById("serviceSelect");
    const container = document.getElementById("servicesList");

    select.innerHTML = `<option value="">Selecciona un servicio...</option>`;
    container.innerHTML = "";

    services.forEach(s => {
      select.innerHTML += `<option value="${s.id}">${s.name} - $${s.price}</option>`;
      
      container.innerHTML += `
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-slate-200 text-sm">${s.name}</h3>
              <span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">$${s.price}</span>
            </div>
            <p class="text-xs text-slate-400 mb-3">${s.description}</p>
          </div>
          <span class="text-[10px] text-slate-500 font-mono"><i class="far fa-clock mr-1"></i> Duración: ${s.durationMinutes} mins</span>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error al cargar servicios:", err);
  }
}

async function loadAppointments() {
  try {
    const res = await fetch(`${API_URL}/Appointments`);
    const appointments = await res.json();

    const tbody = document.getElementById("appointmentsTable");
    tbody.innerHTML = "";

    appointments.forEach(a => {
      const statusBadge = getStatusBadge(a.status);
      const dateFormatted = new Date(a.date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });

      tbody.innerHTML += `
        <tr class="hover:bg-slate-900/50 transition-colors">
          <td class="p-3 font-mono text-xs text-slate-400">#${a.id}</td>
          <td class="p-3 font-medium text-slate-200">${a.clientName}</td>
          <td class="p-3 text-slate-300">${a.serviceName}</td>
          <td class="p-3 text-xs text-slate-400">${dateFormatted}</td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3 text-right">
            <select onchange="updateAppointmentStatus(${a.id}, this.value)" class="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300">
              <option value="Pending" ${a.status === 'Pending' ? 'selected' : ''}>Pendiente</option>
              <option value="Completed" ${a.status === 'Completed' ? 'selected' : ''}>Completada</option>
              <option value="Cancelled" ${a.status === 'Cancelled' ? 'selected' : ''}>Cancelada</option>
            </select>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al cargar citas:", err);
  }
}

function getStatusBadge(status) {
  if (status === "Completed") {
    return `<span class="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold">Completada</span>`;
  }
  if (status === "Cancelled") {
    return `<span class="bg-rose-500/10 text-rose-400 text-xs px-2.5 py-1 rounded-full font-semibold">Cancelada</span>`;
  }
  return `<span class="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold">Pendiente</span>`;
}

async function handleCreateAppointment(e) {
  e.preventDefault();
  
  if (!currentUser) {
    alert("Debes iniciar sesión para agendar una cita.");
    toggleAuthModal();
    return;
  }

  const serviceId = parseInt(document.getElementById("serviceSelect").value);
  const date = document.getElementById("appointmentDate").value;
  const notes = document.getElementById("appointmentNotes").value;

  try {
    const res = await fetch(`${API_URL}/Appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        date,
        notes,
        userId: currentUser.userId
      })
    });

    if (!res.ok) throw new Error("Error al agendar la cita.");

    document.getElementById("appointmentForm").reset();
    loadAppointments();
    alert("Cita agendada con éxito.");
  } catch (err) {
    alert(err.message);
  }
}

async function updateAppointmentStatus(id, newStatus) {
  try {
    await fetch(`${API_URL}/Appointments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    loadAppointments();
  } catch (err) {
    console.error("Error al actualizar estado:", err);
  }
}

// Cambiar entre pestañas de Login y Registro
function switchAuthTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");

  if (tab === 'login') {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    tabLogin.className = "flex-1 py-2 font-bold text-sm text-blue-400 border-b-2 border-blue-500";
    tabRegister.className = "flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent hover:text-slate-200";
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    tabRegister.className = "flex-1 py-2 font-bold text-sm text-emerald-400 border-b-2 border-emerald-500";
    tabLogin.className = "flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent hover:text-slate-200";
  }
}

// Handler de Registro
async function handleRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById("regFullName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${API_URL}/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al registrar el usuario");
    }

    const data = await res.json();
    currentUser = data;
    localStorage.setItem("currentUser", JSON.stringify(data));

    updateUserUI();
    toggleAuthModal();
    alert(`¡Cuenta creada con éxito! Bienvenido/a, ${data.fullName}`);
  } catch (err) {
    alert(err.message);
  }
}