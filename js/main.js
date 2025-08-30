// Main JS for portfolio interactions

(function () {
  'use strict';

  // DOM helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // 1) Theme: persist preference
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  } else if (prefersLight) {
    root.setAttribute('data-theme', 'light');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // 2) Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.style.display = expanded ? 'none' : 'block';
    });
    $$('.nav-link').forEach(link => link.addEventListener('click', () => {
      if (window.innerWidth < 720) {
        navMenu.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  // 3) Smooth scroll (native via CSS, but ensure offset for sticky header)
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // 4) Typing animation for roles
  const roles = [
    'Data Analyst',
    'MIS Executive',
    'Excel Specialist',
    'Power Query Expert',
    "React.js"
  ];
  const typedEl = document.querySelector('.typed');
  let roleIndex = 0, charIndex = 0, deleting = false;
  const TYPE_SPEED = 70, DELETE_SPEED = 45, HOLD_MS = 900;
  function typeLoop() {
    if (!typedEl) return;
    const current = roles[roleIndex % roles.length];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, HOLD_MS);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex++;
      }
    }
    setTimeout(typeLoop, deleting ? DELETE_SPEED : TYPE_SPEED);
  }
  typeLoop();

  // 5) Intersection observers for fade-in and skills progress
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('skill')) {
          const level = Number(entry.target.getAttribute('data-level')) || 0;
          const bar = entry.target.querySelector('.progress span');
          if (bar) {
            bar.style.transition = 'inset-inline-end 1.2s ease';
            requestAnimationFrame(() => {
              bar.style.insetInlineEnd = `${100 - level}%`;
            });
          }
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  $$('[data-animate]').forEach(el => io.observe(el));

  // 6) Projects modal data
  const PROJECTS = {
    alpha: {
      title: 'Project Alpha',
      desc: 'A scalable real-time task manager enabling teams to collaborate instantly.',
      features: [
        'WebSocket powered live updates',
        'Role-based access controls',
        'Optimistic UI with offline support'
      ],
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" rx="24" fill="%23222"/%3E%3Ctext x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" font-size="32" font-family="Arial" fill="%23fff"%3EProject Alpha%3C/text%3E%3C/svg%3E',
      code: 'https://github.com/',
      live: '#'
    },
    beta: {
      title: 'Project Beta',
      desc: 'Analytics dashboard with dynamic charts and granular filters for insights.',
      features: [
        'Server-side rendering for SEO',
        'Lazy-loaded, accessible charts',
        'CSV export and scheduled reports'
      ],
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" rx="24" fill="%2300bcd4"/%3E%3Ctext x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" font-size="32" font-family="Arial" fill="white"%3EProject Beta%3C/text%3E%3C/svg%3E',
      code: 'https://github.com/',
      live: '#'
    },
    gamma: {
      title: 'Project Gamma',
      desc: 'High-performance landing page optimized for conversions with A/B tests.',
      features: [
        'Edge-cached assets',
        'AB testing and analytics',
        'Accessibility-first components'
      ],
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" rx="24" fill="%239C27B0"/%3E%3Ctext x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" font-size="32" font-family="Arial" fill="white"%3EProject Gamma%3C/text%3E%3C/svg%3E',
      code: 'https://github.com/',
      live: '#'
    }
  };

  const modal = document.getElementById('projectModal');
  const projectTitle = document.getElementById('projectTitle');
  const projectDesc = document.getElementById('projectDesc');
  const projectFeatures = document.getElementById('projectFeatures');
  const projectImage = document.getElementById('projectImage');
  const projectCode = document.getElementById('projectCode');
  const projectLive = document.getElementById('projectLive');

  function openProject(id) {
    const data = PROJECTS[id];
    if (!data || !modal) return;
    projectTitle.textContent = data.title;
    projectDesc.textContent = data.desc;
    projectImage.src = data.image;
    projectImage.alt = `Image preview for ${data.title}`;
    projectFeatures.innerHTML = '';
    data.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      projectFeatures.appendChild(li);
    });
    projectCode.href = data.code;
    projectLive.href = data.live;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  $$('.project-actions .btn[data-project]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = btn.getAttribute('data-project');
    if (id) openProject(id);
  }));

  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.querySelector('.modal-inner').getBoundingClientRect();
      const inDialog = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
      if (!inDialog) modal.close();
    });
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
  }

  // 7) Back to top and dynamic year
  const backToTop = document.getElementById('backToTop');
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // 8) Contact form validation
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  function setError(id, message) { const el = document.getElementById(`error-${id}`); if (el) el.textContent = message || ''; }
  function validateEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
  function validateForm() {
    if (!form) return false;
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    setError('name'); setError('email'); setError('subject'); setError('message');
    if (name.length < 2) { setError('name', 'Please enter your full name.'); valid = false; }
    if (!validateEmail(email)) { setError('email', 'Please enter a valid email.'); valid = false; }
    if (subject.length < 3) { setError('subject', 'Subject is too short.'); valid = false; }
    if (message.length < 10) { setError('message', 'Message should be at least 10 characters.'); valid = false; }
    return valid;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      
      // Show loading state
      statusEl.textContent = 'Sending message...';
      statusEl.style.color = '#9fb0c0';
      
      try {
        const formData = {
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          subject: form.subject.value.trim(),
          message: form.message.value.trim()
        };
        
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          statusEl.textContent = data.message;
          statusEl.style.color = '#22c55e';
          form.reset();
        } else {
          statusEl.textContent = data.message;
          statusEl.style.color = '#ef4444';
        }
      } catch (error) {
        console.error('Error:', error);
        statusEl.textContent = 'Failed to send message. Please try again.';
        statusEl.style.color = '#ef4444';
      }
    });
  }

  // 9) Project Slideshow functionality
  function initProjectSlideshow() {
    const slideshows = document.querySelectorAll('.project-slideshow');
    
    slideshows.forEach(slideshow => {
      const slides = slideshow.querySelectorAll('.slide');
      const navDots = slideshow.querySelectorAll('.nav-dot');
      let currentSlide = 0;
      
      // Auto-advance slides every 4 seconds
      const autoAdvance = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideshow(slideshow, currentSlide);
      }, 4000);
      
      // Navigation dot click handlers
      navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentSlide = index;
          updateSlideshow(slideshow, currentSlide);
          
          // Reset auto-advance timer
          clearInterval(autoAdvance);
          setTimeout(() => {
            const newAutoAdvance = setInterval(() => {
              currentSlide = (currentSlide + 1) % slides.length;
              updateSlideshow(slideshow, currentSlide);
            }, 4000);
          }, 1000);
        });
      });
      
      function updateSlideshow(slideshow, activeIndex) {
        const slides = slideshow.querySelectorAll('.slide');
        const navDots = slideshow.querySelectorAll('.nav-dot');
        
        // Update slides
        slides.forEach((slide, index) => {
          slide.classList.toggle('active', index === activeIndex);
        });
        
        // Update navigation dots
        navDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === activeIndex);
        });
      }
    });
  }

  // Initialize slideshow
  initProjectSlideshow();
})();


