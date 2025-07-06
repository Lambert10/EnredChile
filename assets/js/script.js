document.addEventListener("DOMContentLoaded", function () {
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

  const carouselInner = document.getElementById("carousel-inner-clientes");
  const indicators = document.getElementById("carousel-indicators-clientes");

  const itemsPerSlide = 4;
  const numSlides = Math.ceil(clientes.length / itemsPerSlide);

  for (let i = 0; i < numSlides; i++) {
    const grupo = clientes.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide);

    const item = document.createElement("div");
    item.className = "carousel-item" + (i === 0 ? " active" : "");

    const row = document.createElement("div");
    row.className = "row justify-content-center";

    grupo.forEach(cliente => {
      const col = document.createElement("div");
      col.className = "col-6 col-md-3 mb-4 d-flex flex-column align-items-center";

      const card = document.createElement("div");
      card.className = "client-logo text-center border rounded p-3";
      card.style.width = "100%";

      const img = document.createElement("img");
      img.src = cliente.imagen;
      img.alt = cliente.nombre;
      img.className = "img-fluid";
      img.style.maxHeight = "80px";
      img.style.objectFit = "contain";

      const name = document.createElement("p");
      name.className = "text-center mt-2 small";
      name.textContent = cliente.nombre;

      card.appendChild(img);
      col.appendChild(card);
      col.appendChild(name);
      row.appendChild(col);
    });

    item.appendChild(row);
    carouselInner.appendChild(item);

    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#carouselClientes");
    indicator.setAttribute("data-bs-slide-to", `${i}`);
    if (i === 0) indicator.classList.add("active");
    indicators.appendChild(indicator);
  }

  const carouselElement = document.getElementById("carouselClientes");
  const carousel = new bootstrap.Carousel(carouselElement, {
    interval: 3500,
    ride: true
  });

  carouselElement.addEventListener("slid.bs.carousel", function (e) {
    if (e.to === numSlides - 1) {
      setTimeout(() => carousel.to(0), 3500);
    }
  });
});
