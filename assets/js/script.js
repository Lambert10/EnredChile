// ===================== CLIENTES (Carrusel) + FORM + CHAT =====================
document.addEventListener('DOMContentLoaded', function () {
  // --- Carrusel de clientes ---
  const carouselInner = document.getElementById('carousel-inner-clientes');
  const indicators = document.getElementById('carousel-indicators-clientes');
  const carouselElement = document.getElementById('carouselClientes');

  if (carouselInner && indicators && carouselElement && window.bootstrap?.Carousel) {
    const clientes = [
      { nombre: "Cintazul", imagen: "./assets/img/Cintazul.png" },
      { nombre: "Codelco", imagen: "./assets/img/Codelco.jpg" },
      { nombre: "Fundación Chile", imagen: "./assets/img/images.png" },
      { nombre: "Andes Iron", imagen: "./assets/img/andes-iron.jpg" },
      { nombre: "BancoEstado", imagen: "./assets/img/bancoestado3.jpg" },
      { nombre: "Agrosuper", imagen: "./assets/img/Agrosuper-1.webp" },
      { nombre: "Consalud", imagen: "./assets/img/consalud.png" },
      { nombre: "Bupa", imagen: "./assets/img/Bupa.webp" },
      { nombre: "Cencosud", imagen: "./assets/img/Cencosud.webp" },
      { nombre: "Cruzblanca", imagen: "./assets/img/cruzblanca.png" },
      { nombre: "Alemana Seguros", imagen: "./assets/img/alemanaseguros.png" },
      { nombre: "Clínica Bicentenario", imagen: "./assets/img/clinicabicentenario.jpg" },
      { nombre: "Nueva Masvida", imagen: "./assets/img/nuevamasvida.png" },
      { nombre: "Avis Latam", imagen: "./assets/img/avislatam.png" },
      { nombre: "Stracon", imagen: "./assets/img/stracon_logo.png" },
      { nombre: "ADP", imagen: "./assets/img/ADP.webp" },
      { nombre: "BHP", imagen: "./assets/img/bhp.png" },
      { nombre: "SOFOFA", imagen: "./assets/img/Sofofa.png" },
      { nombre: "Municipalidad la Florida", imagen: "./assets/img/municipalidadlaflorida.png" },
      { nombre: "Municipalidad Lo Prado", imagen: "./assets/img/municipalidadloprado.png" },
      { nombre: "Guillermo Morales", imagen: "./assets/img/guillermomorales.jpg" },
      { nombre: "ING", imagen: "./assets/img/Ing.png" },
      { nombre: "Ameco", imagen: "./assets/img/ameco_south_america_logo.jpeg" },
      { nombre: "Corporación Providencia", imagen: "./assets/img/corpoprovi.png" },
    ];

    const itemsPerSlide = 4;
    const numSlides = Math.ceil(clientes.length / itemsPerSlide);

    for (let i = 0; i < numSlides; i++) {
      const grupo = clientes.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide);

      const item = document.createElement('div');
      item.className = 'carousel-item' + (i === 0 ? ' active' : '');

      const row = document.createElement('div');
      row.className = 'row justify-content-center';

      grupo.forEach(cliente => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3 mb-4 d-flex flex-column align-items-center';

        const card = document.createElement('div');
        card.className = 'client-logo text-center border rounded p-3';
        card.style.width = '100%';

        const img = document.createElement('img');
        img.src = cliente.imagen;
        img.alt = cliente.nombre;
        img.className = 'img-fluid';
        img.style.maxHeight = '80px';
        img.style.objectFit = 'contain';

        const name = document.createElement('p');
        name.className = 'text-center mt-2 small';
        name.textContent = cliente.nombre;

        card.appendChild(img);
        col.appendChild(card);
        col.appendChild(name);
        row.appendChild(col);
      });

      item.appendChild(row);
      carouselInner.appendChild(item);

      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.setAttribute('data-bs-target', '#carouselClientes');
      indicator.setAttribute('data-bs-slide-to', String(i));
      if (i === 0) indicator.classList.add('active');
      indicators.appendChild(indicator);
    }

    const carousel = new bootstrap.Carousel(carouselElement, { interval: 3500, ride: true });
    carouselElement.addEventListener('slid.bs.carousel', function (e) {
      if (e.to === numSlides - 1) {
        setTimeout(() => carousel.to(0), 3500);
      }
    });
  }

  // --- Formulario de contacto (Formspree) ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          alert('Gracias por tu mensaje. Te responderemos pronto.');
          form.reset();
        } else {
          alert('Ocurrió un error al enviar. Inténtalo más tarde.');
        }
      } catch (_) {
        alert('No fue posible enviar el formulario en este momento.');
      }
    });
  }

  // --- Chat flotante ---
  const toggleBtn = document.getElementById('chat-toggle');
  const chatWidget = document.getElementById('chat-widget');
  const closeBtn = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');

  if (toggleBtn && chatWidget && closeBtn) {
    toggleBtn.addEventListener('click', () => {
      chatWidget.style.display = (chatWidget.style.display === 'none' || chatWidget.style.display === '') ? 'block' : 'none';
    });

    closeBtn.addEventListener('click', () => {
      chatWidget.style.display = 'none';
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
});

// Envío de mensajes del chatbot (se usa arriba)
async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const output = document.getElementById('chat-output');
  if (!input || !output) return;

  const message = input.value.trim();
  if (!message) return;

  output.innerHTML += `<div><strong>Tú:</strong> ${message}</div>`;
  input.value = '';
  output.scrollTop = output.scrollHeight;

  try {
    const res = await fetch('https://enredchile.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    output.innerHTML += `<div><strong>Bot:</strong> ${data.reply}</div>`;
    output.scrollTop = output.scrollHeight;
  } catch (error) {
    output.innerHTML += `<div style="color: red;">❌ Error al conectar con el chatbot</div>`;
  }
}

// ===================== MODAL PERFIL EQUIPO (SECCIÓN #equipo) =====================
(function () {
  const modalEl = document.getElementById('teamProfileModal');
  if (!modalEl || !window.bootstrap?.Modal) return;

  const titleEl = document.getElementById('teamProfileTitle');
  const roleEl  = document.getElementById('teamProfileRole');
  const bodyEl  = document.getElementById('teamProfileBody');

  document.querySelectorAll('#equipo .team-profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.team-card');
      if (!card) return;

      const name = btn.dataset.name || card.querySelector('h6')?.textContent || 'Perfil';
      const role = btn.dataset.role || card.querySelector('p.small')?.textContent || '';
      const bio  = card.querySelector('.team-bio')?.innerHTML || '<p>Pronto más información.</p>';

      if (titleEl) titleEl.textContent = name;
      if (roleEl)  roleEl.textContent  = role;
      if (bodyEl)  bodyEl.innerHTML    = bio;

      new bootstrap.Modal(modalEl).show();
    });
  });
})();
