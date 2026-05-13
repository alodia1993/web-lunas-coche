// Lógica del Slider de la sección de Servicios
document.addEventListener('DOMContentLoaded', () => {
  const serviceBlocks = document.querySelectorAll('.service-block');

  serviceBlocks.forEach(block => {
    const slides = block.querySelectorAll('.carousel-slide');
    const prevBtn = block.querySelector('.carousel-btn.prev');
    const nextBtn = block.querySelector('.carousel-btn.next');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    const dotsContainer = block.querySelector('.carousel-dots');

    // Generar puntos dinámicamente si el contenedor existe
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = block.querySelectorAll('.dot');

    function goToSlide(index) {
      // Ocultar actual
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      
      // Actualizar indice
      currentSlide = index;
      
      // Mostrar nuevo
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  });

  // --- Lógica del Menú Hamburguesa ---
  const hamburger = document.querySelector('.navbar-hamburger');
  const navMenu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.navbar-menu a');
  const dropdowns = document.querySelectorAll('.navbar-item.dropdown');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Bloquear scroll del body cuando el menú está abierto
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Solo si no es un toggle de dropdown en móvil (opcional, pero mejor cerrar si es un ancla)
        if (!link.parentElement.classList.contains('dropdown') || window.innerWidth > 900) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    });

    // Manejo de dropdowns en móvil (clic en lugar de hover)
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault(); // Evitar navegación inmediata si hay submenú
          dropdown.classList.toggle('active');
        }
      });
    });
  }

  // --- Manejo del Formulario de Contacto (AJAX) ---
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.btn-submit');
      
      // Feedback visual de carga
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      formResponse.style.display = 'none';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        formResponse.style.display = 'block';
        if (result.status === 'success') {
          formResponse.style.backgroundColor = '#d4edda';
          formResponse.style.color = '#155724';
          formResponse.style.border = '1px solid #c3e6cb';
          formResponse.textContent = result.message;
          contactForm.reset();
        } else {
          formResponse.style.backgroundColor = '#f8d7da';
          formResponse.style.color = '#721c24';
          formResponse.style.border = '1px solid #f5c6cb';
          formResponse.textContent = result.message || 'Hubo un error al enviar el mensaje.';
        }
      } catch (error) {
        formResponse.style.display = 'block';
        formResponse.style.backgroundColor = '#f8d7da';
        formResponse.style.color = '#721c24';
        formResponse.style.border = '1px solid #f5c6cb';
        formResponse.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
      }
    });
  }
});

