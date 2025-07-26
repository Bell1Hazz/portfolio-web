// Smooth scroll jika klik link menu
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Highlight menu aktif saat scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
  const skillCards = document.querySelectorAll('.skill-card');
  const modal = document.getElementById('skill-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');

  skillCards.forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.getAttribute('data-title');
      modalDesc.textContent = card.getAttribute('data-desc');
      modal.style.display = 'flex';
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Tutup modal jika klik di luar modal-content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
