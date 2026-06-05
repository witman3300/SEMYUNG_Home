(function () {
  'use strict';

  /* ========================
     HEADER SCROLL
  ======================== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ========================
     MOBILE NAV
  ======================== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const gnbOverlay = document.getElementById('gnbOverlay');

  function toggleNav(open) {
    hamburger.classList.toggle('active', open);
    if (open) {
      mobileNav.classList.add('open');
      gnbOverlay.style.display = 'block';
      setTimeout(() => (gnbOverlay.style.opacity = '1'), 10);
    } else {
      mobileNav.classList.remove('open');
      gnbOverlay.style.opacity = '0';
      setTimeout(() => (gnbOverlay.style.display = 'none'), 300);
    }
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    toggleNav(!isOpen);
  });

  gnbOverlay.addEventListener('click', () => toggleNav(false));

  /* ========================
     HERO SLIDER
  ======================== */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pauseBtn = document.getElementById('pauseBtn');

  let current = 0;
  let autoPlay = true;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => { if (autoPlay) goTo(current + 1); }, 5000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      startTimer();
    });
  });

  pauseBtn.addEventListener('click', () => {
    autoPlay = !autoPlay;
    pauseBtn.innerHTML = autoPlay ? '&#9646;&#9646;' : '&#9654;';
    pauseBtn.setAttribute('aria-label', autoPlay ? '자동재생 중지' : '자동재생 시작');
  });

  startTimer();

  /* ========================
     COUNT-UP ANIMATION
  ======================== */
  function countUp(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  /* ========================
     SCROLL ANIMATIONS
  ======================== */
  const animTargets = [
    document.querySelector('.about-text'),
    document.querySelector('.about-numbers'),
    document.querySelector('.business-grid'),
    document.querySelector('.news-wrapper'),
    document.querySelector('.vision-cards'),
  ].filter(Boolean);

  animTargets.forEach(el => el.classList.add('fade-in'));

  const numItems = document.querySelectorAll('.num');
  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (!counted && entry.target.classList.contains('about-numbers') ||
            entry.target.closest('.about-numbers')) {
          if (!counted) {
            counted = true;
            numItems.forEach(el => {
              const target = parseInt(el.dataset.target);
              countUp(el, target, 1800);
            });
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animTargets.forEach(el => observer.observe(el));

  /* Separate observer for numbers */
  const numSection = document.querySelector('.about-numbers');
  if (numSection) {
    const numObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        numItems.forEach(el => {
          countUp(el, parseInt(el.dataset.target), 1800);
        });
        numObserver.disconnect();
      }
    }, { threshold: 0.3 });
    numObserver.observe(numSection);
  }

  /* ========================
     QUICK MENU HOVER RIPPLE
  ======================== */
  document.querySelectorAll('.quick-list a').forEach(link => {
    link.addEventListener('mouseenter', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 4px; height: 4px;
        background: rgba(255,255,255,.2);
        border-radius: 50%;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        transform: scale(0);
        animation: rippleAnim .5s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* Ripple keyframes */
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(60); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

})();
