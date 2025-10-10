// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoadingScreen();
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initSkillsInteraction();
    initContactForm();
    initScrollSpy();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove loading screen from DOM after transition
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
}

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Smooth scroll to section
            scrollToSection(targetId);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scroll function
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const texts = [
        "🚀 Sedang membuka project freelance kecil!",
        "💻 Terbuka untuk kolaborasi Laravel & Android",
        "📬 Hubungi via email atau Instagram!"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isWaiting) {
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                typeWriter();
            }, 2000);
            return;
        }

        if (!isDeleting && charIndex <= currentText.length) {
            typingElement.innerHTML = currentText.slice(0, charIndex) + '<span class="typing-cursor">|</span>';
            charIndex++;
        } else if (isDeleting && charIndex >= 0) {
            typingElement.innerHTML = currentText.slice(0, charIndex) + '<span class="typing-cursor">|</span>';
            charIndex--;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isWaiting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(typeWriter, typingSpeed);
    }

    typeWriter();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate skill progress bars
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    const targetWidth = progressBar.getAttribute('data-width');
                    setTimeout(() => {
                        progressBar.style.width = targetWidth + '%';
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .expertise-item, .about-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Skills Interaction
function initSkillsInteraction() {
    const skillCards = document.querySelectorAll('.skill-card');
    const modal = document.getElementById('skill-modal');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal) return;

    const modalIcon = document.getElementById('modal-skill-icon');
    const modalName = document.getElementById('modal-skill-name');
    const modalProgress = document.getElementById('modal-progress');
    const modalDesc = document.getElementById('modal-skill-desc');

    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            const skillName = card.getAttribute('data-skill');
            const skillLevel = card.getAttribute('data-level');
            const skillDesc = card.getAttribute('data-desc');
            const skillIcon = card.querySelector('img').src;

            // Update modal content
            modalIcon.src = skillIcon;
            modalIcon.alt = skillName + ' icon';
            modalName.textContent = skillName;
            modalDesc.textContent = skillDesc;
            
            // Show modal
            modal.classList.add('active');
            
            // Animate progress bar
            setTimeout(() => {
                modalProgress.style.width = skillLevel + '%';
            }, 300);
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        modalProgress.style.width = '0%';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        // Show success message
        alert(`Terima kasih ${name}! Pesan Anda telah diterima. Saya akan segera menghubungi Anda di ${email}.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Scroll Spy for Navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.9)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Smooth scroll for buttons
window.scrollToSection = scrollToSection;

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.02;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations can be added here
}, 100));