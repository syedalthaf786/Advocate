const typewriterText = "J. RAJASHEKAR YADAV";
const typewriterElement = document.getElementById('typewriter-name');
const cursorElement = document.getElementById('cursor');

let charIndex = 0;

function typeWriter() {
    if (!typewriterElement || !cursorElement) return;

    if (charIndex < typewriterText.length) {
        typewriterElement.textContent += typewriterText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80);
    } else {
        cursorElement.style.display = 'none';
    }
}

window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const offcanvasMenu = document.getElementById('offcanvas-menu');
const offcanvasBackdrop = document.getElementById('offcanvas-backdrop');
const offcanvasClose = document.getElementById('offcanvas-close');

function openOffcanvas() {
    if (!offcanvasMenu || !offcanvasBackdrop) return;
    offcanvasMenu.classList.add('active');
    offcanvasBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOffcanvas() {
    if (!offcanvasMenu || !offcanvasBackdrop) return;
    offcanvasMenu.classList.remove('active');
    offcanvasBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openOffcanvas);
if (offcanvasClose) offcanvasClose.addEventListener('click', closeOffcanvas);
if (offcanvasBackdrop) offcanvasBackdrop.addEventListener('click', closeOffcanvas);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeOffcanvas();
        closeModal();
    }
});

document.querySelectorAll('.offcanvas-nav-link').forEach((link) => {
    link.addEventListener('click', closeOffcanvas);
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        closeOffcanvas();
    }
});

const quotes = [
    'Justice delayed is justice denied',
    'Let justice be done though the heavens fall',
    'The law is reason, free from passion'
];

let currentQuote = 0;
const quoteText = document.getElementById('quote-text');
const quoteDots = document.querySelectorAll('.quote-dot');

function showQuote(index) {
    if (!quoteText) return;
    quoteText.style.opacity = '0';
    setTimeout(() => {
        quoteText.textContent = `"${quotes[index]}"`;
        quoteText.style.opacity = '1';
        quoteDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }, 300);
}

quoteDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentQuote = index;
        showQuote(currentQuote);
    });
});

setInterval(() => {
    currentQuote = (currentQuote + 1) % quotes.length;
    showQuote(currentQuote);
}, 4000);

const heroStackCards = document.querySelectorAll('.stack-card');
const heroStackDots = document.querySelectorAll('.hero-stack-dot');
let currentHeroStack = 0;

function updateHeroStack(index) {
    heroStackCards.forEach((card, cardIndex) => {
        card.classList.remove('active', 'next', 'prev');

        if (cardIndex === index) {
            card.classList.add('active');
        } else if (cardIndex === (index + 1) % heroStackCards.length) {
            card.classList.add('next');
        } else if (cardIndex === (index - 1 + heroStackCards.length) % heroStackCards.length) {
            card.classList.add('prev');
        }
    });

    heroStackDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
    });
}

heroStackDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentHeroStack = index;
        updateHeroStack(currentHeroStack);
    });
});

setInterval(() => {
    currentHeroStack = (currentHeroStack + 1) % heroStackCards.length;
    updateHeroStack(currentHeroStack);
}, 3500);

updateHeroStack(currentHeroStack);

const carousel3d = document.getElementById('carousel-3d');
const carouselContainer = document.getElementById('carousel-3d-container');
const cards3d = document.querySelectorAll('.carousel-3d-card');
const dots3d = document.querySelectorAll('.carousel-3d-dot');
const totalCards = cards3d.length;
let currentIndex3d = 0;
let autoRotateInterval;
let isDragging = false;
let dragStartX = 0;
let dragStartRotation = 0;
let currentRotation = 0;
let isHovering = false;

function update3dCarousel() {
    const angle = 360 / totalCards;
    cards3d.forEach((card, index) => {
        const rotateY = angle * index + currentRotation;
        const translateZ = window.innerWidth < 640 ? 140 : 180;
        card.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        const normalizedAngle = ((rotateY % 360) + 360) % 360;
        if (normalizedAngle < 45 || normalizedAngle > 315) {
            card.style.opacity = '1';
            card.style.zIndex = '10';
        } else if (normalizedAngle < 135 || normalizedAngle > 225) {
            card.style.opacity = '0.3';
            card.style.zIndex = '1';
        } else {
            card.style.opacity = '0.6';
            card.style.zIndex = '5';
        }
    });

    dots3d.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex3d);
    });
}

function rotateToIndex(index) {
    currentIndex3d = index;
    currentRotation = -(360 / totalCards) * index;
    update3dCarousel();
}

function startAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        if (!isDragging && !isHovering) {
            rotateToIndex((currentIndex3d + 1) % totalCards);
        }
    }, 3000);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

dots3d.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoRotate();
        rotateToIndex(index);
        setTimeout(startAutoRotate, 500);
    });
});

if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    carouselContainer.addEventListener('mouseleave', () => {
        isHovering = false;
    });
}

function handleDragStart(clientX) {
    isDragging = true;
    dragStartX = clientX;
    dragStartRotation = currentRotation;
    stopAutoRotate();
}

function handleDragMove(clientX) {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX;
    const sensitivity = 0.5;
    currentRotation = dragStartRotation + deltaX * sensitivity;
    update3dCarousel();
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    const angle = 360 / totalCards;
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    currentIndex3d = Math.round(normalizedRotation / angle) % totalCards;
    currentIndex3d = (totalCards - currentIndex3d) % totalCards;
    rotateToIndex(currentIndex3d);
    setTimeout(startAutoRotate, 500);
}

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        isHovering = true;
        handleDragStart(e.touches[0].clientX);
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
        if (isDragging && Math.abs(e.touches[0].clientX - dragStartX) > 5) {
            e.preventDefault();
        }
        handleDragMove(e.touches[0].clientX);
    }, { passive: false });

    carouselContainer.addEventListener('touchend', () => {
        handleDragEnd();
        setTimeout(() => {
            isHovering = false;
        }, 1000);
    });

    carouselContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    });
}

document.addEventListener('mousemove', (e) => {
    handleDragMove(e.clientX);
});

document.addEventListener('mouseup', handleDragEnd);

update3dCarousel();
startAutoRotate();

const carousel = document.getElementById('services-carousel');
const prevBtn = document.getElementById('services-prev');
const nextBtn = document.getElementById('services-next');
const slides = document.querySelectorAll('.service-card');
let servicesAutoRotateInterval;

function updateCarouselButtons() {
    if (window.innerWidth < 768 || !carousel || !prevBtn || !nextBtn) return;
    prevBtn.disabled = carousel.scrollLeft <= 0;
    nextBtn.disabled = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
}

function scrollCarousel(direction) {
    if (window.innerWidth < 768 || !carousel || slides.length === 0) return;
    const slideWidth = slides[0].offsetWidth + 24;
    const scrollAmount = direction === 'next' ? slideWidth : -slideWidth;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(updateCarouselButtons, 350);
}

function startServicesAutoRotate() {
    if (window.innerWidth < 768 || servicesAutoRotateInterval || !carousel) return;
    servicesAutoRotateInterval = setInterval(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth - 10;
        if (carousel.scrollLeft >= maxScroll) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollCarousel('next');
        }
        setTimeout(updateCarouselButtons, 350);
    }, 3500);
}

function stopServicesAutoRotate() {
    if (servicesAutoRotateInterval) {
        clearInterval(servicesAutoRotateInterval);
        servicesAutoRotateInterval = null;
    }
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        stopServicesAutoRotate();
        scrollCarousel('prev');
        setTimeout(startServicesAutoRotate, 800);
    });
    nextBtn.addEventListener('click', () => {
        stopServicesAutoRotate();
        scrollCarousel('next');
        setTimeout(startServicesAutoRotate, 800);
    });
}

if (carousel) {
    carousel.addEventListener('mouseenter', stopServicesAutoRotate);
    carousel.addEventListener('mouseleave', startServicesAutoRotate);
    carousel.addEventListener('scroll', updateCarouselButtons);
}

window.addEventListener('resize', () => {
    updateCarouselButtons();
    if (window.innerWidth >= 768) {
        startServicesAutoRotate();
    } else {
        stopServicesAutoRotate();
    }
});

updateCarouselButtons();
if (window.innerWidth >= 768) {
    startServicesAutoRotate();
}

document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', function () {
        const serviceName = this.getAttribute('data-service');
        openModal(serviceName);
    });
});

const modal = document.getElementById('inquiry-modal');
const openBtns = [
    document.getElementById('open-inquiry-btn'),
    document.getElementById('open-inquiry-btn-2')
];
const closeBtn = document.getElementById('close-inquiry-btn');

function openModal(preselectedService = '') {
    closeOffcanvas();
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (preselectedService) {
        const caseType = document.getElementById('modal-case-type');
        if (caseType) caseType.value = preselectedService;
    }
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const form = document.getElementById('modal-inquiry-form');
    if (form) form.reset();
}

openBtns.forEach((btn) => {
    if (btn) {
        btn.addEventListener('click', () => openModal());
    }
});

if (closeBtn) closeBtn.addEventListener('click', closeModal);

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });
}

window.addEventListener('load', () => {
    if (!sessionStorage.getItem('inquiryModalShown')) {
        setTimeout(() => {
            openModal();
            sessionStorage.setItem('inquiryModalShown', 'true');
        }, 2000);
    }
});

function handleFormSubmit(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const caseType = formData.get('case-type') || 'Not specified';
        const message = formData.get('message');

        const whatsappMessage = `*New Legal Inquiry*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Case Type:* ${caseType}%0A%0A*Details:*%0A${message}%0A%0A---%0ASent from website`;
        const whatsappUrl = `https://wa.me/918341760104?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');

        if (formId === 'modal-inquiry-form') {
            closeModal();
        } else {
            form.reset();
        }
    });
}

handleFormSubmit('contact-form');
handleFormSubmit('modal-inquiry-form');

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    let current = '';
    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();