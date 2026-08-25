/* ============================================================
   JOSE — PORTFOLIO  |  script.js
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. TEXT SPLITTING — every heading/paragraph gets its own
        letter / word animation, staggered.
  --------------------------------------------------------- */
  function splitLetters(el) {
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'split-letter';
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
      i++;
    });
  }
  function splitWords(el) {
    const text = el.textContent;
    el.textContent = '';
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'split-word';
      span.style.setProperty('--i', i);
      span.textContent = word;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });
  }

  document.querySelectorAll('.kinetic').forEach(splitLetters);
  document.querySelectorAll('.kinetic-fade').forEach(splitWords);

  /* ---------------------------------------------------------
     2. SCROLL REVEAL — IntersectionObserver adds .in-view
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.kinetic, .kinetic-fade, .reveal, .reveal-left, .reveal-right, .skill-card, .t-item'
  );
  if (reduceMotion) {
    revealTargets.forEach(el => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------
     3. NAV — scroll shrink, active link, mobile burger
  --------------------------------------------------------- */
  const nav = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);

    // progress bar
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    const progEl = document.getElementById('progress');
    if (progEl) progEl.style.width = scrolled + '%';

    // active section
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }, { passive: true });

  const burger = document.getElementById('burger');
  const navLinksWrap = document.getElementById('navLinks');
  if (burger && navLinksWrap) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinksWrap.classList.toggle('open');
    });
    navLinksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinksWrap.classList.remove('open');
    }));
  }

  /* ---------------------------------------------------------
     4. LIGHT / DARK MODE TOGGLE
  --------------------------------------------------------- */
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    const knob = modeToggle.querySelector('.knob');
    function setMode(dark) {
      document.documentElement.classList.toggle('dark', dark);
      if (knob) knob.textContent = dark ? '☾' : '☀';
      localStorage.setItem('jose-theme', dark ? 'dark' : 'light');
    }
    setMode(localStorage.getItem('jose-theme') === 'dark');
    modeToggle.addEventListener('click', () => setMode(!document.documentElement.classList.contains('dark')));
  }

  /* ---------------------------------------------------------
     5. ROLE TYPEWRITER
  --------------------------------------------------------- */
  const roleEl = document.getElementById('roleText');
  if (roleEl) {
    const roles = ['Data Analyst', 'UI/UX Designer', 'Digital Marketer', 'Visual Editor', 'Problem Solver'];
    let rIndex = 0, cIndex = 0, deleting = false;
    function typeLoop() {
      const word = roles[rIndex];
      if (!deleting) {
        cIndex++;
        roleEl.textContent = word.slice(0, cIndex);
        if (cIndex === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        cIndex--;
        roleEl.textContent = word.slice(0, cIndex);
        if (cIndex === 0) { deleting = false; rIndex = (rIndex + 1) % roles.length; }
      }
      setTimeout(typeLoop, deleting ? 40 : 85);
    }
    typeLoop();
  }

  /* ---------------------------------------------------------
     6. HERO BLOB PARALLAX + CURSOR GLOW
  --------------------------------------------------------- */
  const glow = document.getElementById('cursor-glow');
  const blobs = document.querySelectorAll('.blob');
  if (!reduceMotion && glow) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      blobs.forEach(b => {
        const depth = parseFloat(b.dataset.depth || 0.3);
        b.style.transform = `translate(${cx * 40 * depth}px, ${cy * 40 * depth}px)`;
      });
    }, { passive: true });
  }

  // Moving circle cursor
  const movingCursor = document.createElement('div');
  movingCursor.className = 'cursor-circle';
  document.body.appendChild(movingCursor);
  window.addEventListener('mousemove', e => {
    movingCursor.style.left = e.clientX + 'px';
    movingCursor.style.top = e.clientY + 'px';
  });
  /* ---------------------------------------------------------
     7. ANIMATED COUNTERS
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const cIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let val = 0;
        const step = Math.max(1, Math.round(target / 40));
        const tick = () => {
          val += step;
          if (val >= target) { el.textContent = `${target}+`; return; }
          el.textContent = `${val}+`;
          requestAnimationFrame(tick);
        };
        tick();
        cIo.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cIo.observe(el));

  /* ---------------------------------------------------------
     8. BUTTON RIPPLE
  --------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left - 10) + 'px';
      ripple.style.top = (e.clientY - rect.top - 10) + 'px';
      ripple.style.width = ripple.style.height = '20px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) resumeBtn.addEventListener('click', (e) => e.preventDefault());

  /* ---------------------------------------------------------
     9. CONTENT DATA — Skills / Services / Projects / Timeline /
        Certs / Tools / Testimonials / Social
  --------------------------------------------------------- */
  const skills = [
    {
      icon: '📊', title: 'Data Analyst', desc: 'Turning raw numbers into decisions people actually act on.',
      tags: ['Excel', 'Power BI', 'Tableau', 'SQL', 'Python', 'Pandas', 'Dashboards', 'KPI Reporting']
    },
    {
      icon: '🎨', title: 'UI/UX Designer', desc: 'Interfaces that feel obvious the first time you use them.',
      tags: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Accessibility']
    },
    {
      icon: '📈', title: 'Digital Marketing', desc: 'Campaigns built on numbers, not guesses.',
      tags: ['SEO', 'Google Ads', 'Meta Ads', 'Content Strategy', 'Email Marketing', 'Analytics', 'Branding']
    },
    {
      icon: '🎬', title: 'Photo & Video Editor', desc: 'Visuals that hold attention and carry a brand\'s voice.',
      tags: ['Photoshop', 'Lightroom', 'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Color Grading', 'Reels']
    },
  ];

  const services = [
    { ic: '📊', t: 'Data & Dashboards', d: 'Clean, readable dashboards built on solid analysis.' },
    { ic: '🎨', t: 'UI/UX Design', d: 'Web and mobile interfaces designed around real users.' },
    { ic: '💻', t: 'Website Design', d: 'Fast, responsive sites that look intentional.' },
    { ic: '📱', t: 'Mobile App UI', d: 'Clean app screens ready to hand off to developers.' },
    { ic: '📈', t: 'Marketing Strategy', d: 'Plans built around measurable growth, not vanity metrics.' },
    { ic: '🚀', t: 'SEO Optimisation', d: 'Getting the right pages found by the right people.' },
    { ic: '📷', t: 'Photo Editing', d: 'Retouching and colour work that stays natural.' },
    { ic: '🎬', t: 'Video Editing', d: 'Cuts that keep pace and protect the story.' },
    { ic: '📢', t: 'Brand Content', d: 'Consistent visual content across every channel.' },
  ];

  const projGradients = {
    'Data Analytics': 'linear-gradient(135deg,#1F5C52,#0E3730)',
    'UI/UX': 'linear-gradient(135deg,#6B4C5B,#3A2530)',
    'Marketing': 'linear-gradient(135deg,#C1652F,#7A3A17)',
    'Video Editing': 'linear-gradient(135deg,#B98A3E,#6E4F1D)',
    'Photography': 'linear-gradient(135deg,#3A5A6B,#17232A)',
  };
  const projects = [
    { cat: 'Data Analytics', title: 'Retail Sales Dashboard', desc: 'A Power BI dashboard tracking regional sales and stock in real time.', tags: ['Power BI', 'SQL', 'DAX'] },
    { cat: 'UI/UX', title: 'Fintech Mobile App', desc: 'End-to-end UX for a savings app, from research to hi-fi prototype.', tags: ['Figma', 'Prototyping'] },
    { cat: 'Marketing', title: 'DTC Growth Campaign', desc: 'Paid social funnel that cut cost-per-lead by a third in six weeks.', tags: ['Meta Ads', 'Analytics'] },
    { cat: 'Video Editing', title: 'Brand Launch Film', desc: 'A 90-second launch video with full colour grade and motion titles.', tags: ['Premiere Pro', 'After Effects'] },
    { cat: 'Data Analytics', title: 'Customer Churn Model', desc: 'Python analysis flagging at-risk customers before they leave.', tags: ['Python', 'Pandas'] },
    { cat: 'UI/UX', title: 'SaaS Design System', desc: 'A reusable component library for a growing product team.', tags: ['Figma', 'Design Systems'] },
    { cat: 'Photography', title: 'Product Catalogue Shoot', desc: 'Retouched product photography for an e-commerce relaunch.', tags: ['Lightroom', 'Photoshop'] },
    { cat: 'Marketing', title: 'SEO Content Overhaul', desc: 'Rebuilt site content structure, tripling organic traffic in a quarter.', tags: ['SEO', 'Content'] },
    { cat: 'Video Editing', title: 'Weekly Reels Series', desc: 'A recurring short-form video series for a lifestyle brand.', tags: ['Reels', 'Motion Graphics'] },
  ];

  const timeline = [
    { yr: '01', tag: 'Getting started', title: 'Learned the fundamentals', desc: 'Excel, design basics, and the first real client project.' },
    { yr: '02', tag: 'Going deeper', title: 'Specialised in data & design', desc: 'Picked up SQL, Power BI, and Figma — started freelancing properly.' },
    { yr: '03', tag: 'Widening the lens', title: 'Added marketing & video', desc: 'Ran first paid campaigns and started editing brand video content.' },
    { yr: '04', tag: 'Today', title: 'Full-service digital work', desc: 'Now handling data, design, marketing and video for growing brands.' },
  ];

  const certs = [
    { m: 'G', name: 'Google Data Analytics', sub: 'Professional Certificate' },
    { m: 'M', name: 'Microsoft Power BI', sub: 'Data Analyst Associate' },
    { m: '∞', name: 'Meta Social Media', sub: 'Marketing Certificate' },
    { m: 'IBM', name: 'IBM Data Science', sub: 'Professional Certificate' },
    { m: 'Ai', name: 'Adobe Creative Suite', sub: 'Certified Associate' },
    { m: 'C', name: 'Coursera UX Design', sub: 'Google UX Certificate' },
    { m: 'U', name: 'Udemy SQL Bootcamp', sub: 'Advanced SQL' },
    { m: 'Ae', name: 'Adobe After Effects', sub: 'Motion Graphics' },
  ];

  const tools = ['Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Figma', 'Photoshop', 'Premiere Pro', 'After Effects', 'Illustrator', 'Canva', 'Google Analytics', 'VS Code', 'Git', 'Notion'];

  const testimonials = [
    { q: 'Jose turned a spreadsheet nobody wanted to open into a dashboard our whole team checks every morning.', p: 'Priya Nair', r: 'Operations Lead' },
    { q: 'The redesign was simple, fast, and exactly on brand. No back-and-forth needed.', p: 'Daniel Cruz', r: 'Startup Founder' },
    { q: 'Our cost-per-lead dropped within the first two weeks of the new campaign structure.', p: 'Amelia Ross', r: 'Marketing Manager' },
    { q: 'Fast turnaround on the launch video, and the colour grade made the footage look twice the budget.', p: 'Tom Baxter', r: 'Creative Director' },
  ];

  const socials = [
    { i: '💬', label: 'WhatsApp', href: '#' },
    { i: 'in', label: 'LinkedIn', href: '#' },
    { i: 'gh', label: 'GitHub', href: '#' },
    { i: '📷', label: 'Instagram', href: '#' },
    { i: 'Bē', label: 'Behance', href: '#' },
  ];

  /* ---------------------------------------------------------
     10. RENDERERS
  --------------------------------------------------------- */
  const skillGrid = document.getElementById('skillGrid');
  if (skillGrid) {
    skills.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'skill-card reveal pop';
      card.style.transitionDelay = (i * 0.08) + 's';
      card.innerHTML = `
        <div class="skill-top">
          <div class="skill-icon">${s.icon}</div>
          <h3>${s.title}</h3>
        </div>
        <p>${s.desc}</p>
        <div class="pill-row">${s.tags.map((t, ti) => `<span class="pill" style="transition-delay:${ti * 0.04}s">${t}</span>`).join('')}</div>
      `;
      skillGrid.appendChild(card);
    });
  }

  const serviceGrid = document.getElementById('serviceGrid');
  if (serviceGrid) {
    services.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'service-card reveal pop';
      card.style.transitionDelay = ((i % 3) * 0.08) + 's';
      card.innerHTML = `<span class="ic">${s.ic}</span><h3>${s.t}</h3><p>${s.d}</p>`;
      serviceGrid.appendChild(card);
    });
  }

  const filterRow = document.getElementById('filterRow');
  const projectGrid = document.getElementById('projectGrid');
  if (filterRow && projectGrid) {
    const categories = ['All', ...new Set(projects.map(p => p.cat))];
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.project-card').forEach(card => {
          const show = cat === 'All' || card.dataset.cat === cat;
          card.classList.toggle('hide', !show);
        });
      });
      filterRow.appendChild(btn);
    });
    projects.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal pop';
      card.dataset.cat = p.cat;
      card.style.transitionDelay = ((i % 3) * 0.08) + 's';
      card.innerHTML = `
        <div class="proj-thumb">
          <span style="position:relative;z-index:1;">${p.title.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
        </div>
        <div class="proj-body">
          <span class="proj-cat">${p.cat}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="proj-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
          <div class="proj-links">
            <a href="#">Live preview</a>
            <a href="#">Case study</a>
          </div>
        </div>
      `;
      card.querySelector('.proj-thumb').style.setProperty('--thumb-bg', projGradients[p.cat]);
      projectGrid.appendChild(card);
    });
  }

  const timelineEl = document.getElementById('timeline');
  if (timelineEl) {
    timeline.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 't-item reveal' + (i % 2 === 0 ? '-left' : '-right');
      item.innerHTML = `
        <div class="t-dot">${t.yr}</div>
        <div class="t-card">
          <span class="t-tag">${t.tag}</span>
          <h3>${t.title}</h3>
          <p>${t.desc}</p>
        </div>
      `;
      timelineEl.appendChild(item);
    });
  }

  const certGrid = document.getElementById('certGrid');
  if (certGrid) {
    certs.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'cert-card reveal pop';
      card.style.transitionDelay = ((i % 4) * 0.06) + 's';
      card.innerHTML = `<div class="cert-mark">${c.m}</div><div class="name">${c.name}</div><div class="sub">${c.sub}</div>`;
      certGrid.appendChild(card);
    });
  }

  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    [...tools, ...tools].forEach(t => {
      const chip = document.createElement('div');
      chip.className = 'tool-chip';
      chip.textContent = t;
      marqueeTrack.appendChild(chip);
    });
  }

  const testiTrack = document.getElementById('testiTrack');
  const testiDots = document.getElementById('testiDots');
  if (testiTrack && testiDots) {
    testimonials.forEach((t, i) => {
      const card = document.createElement('div');
      card.className = 'testi-card';
      card.innerHTML = `<p class="testi-quote">"${t.q}"</p><p class="testi-person">${t.p}</p><p class="testi-role">${t.r}</p>`;
      testiTrack.appendChild(card);
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTesti(i));
      testiDots.appendChild(dot);
    });
    let testiIndex = 0;
    function goToTesti(i) {
      testiIndex = i;
      testiTrack.style.transform = `translateX(-${i * 100}%)`;
      testiDots.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === i));
    }
    let testiTimer = setInterval(() => goToTesti((testiIndex + 1) % testimonials.length), 5500);
    const testiWrap = document.querySelector('.testi-wrap');

    const neonGlowPalette = [
      {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FF6542 50%, #FF2B3C 100%)',
        filter: 'drop-shadow(0 10px 20px rgba(255, 43, 60, 0.4)) drop-shadow(0 0 10px rgba(255, 43, 60, 0.25))'
      },
      {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #70E0FF 50%, #00F0FF 100%)',
        filter: 'drop-shadow(0 10px 20px rgba(0, 240, 255, 0.4)) drop-shadow(0 0 10px rgba(0, 240, 255, 0.25))'
      },
      {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #C084FC 50%, #A855F7 100%)',
        filter: 'drop-shadow(0 10px 20px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 10px rgba(168, 85, 247, 0.25))'
      },
      {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FCD34D 50%, #FFB800 100%)',
        filter: 'drop-shadow(0 10px 20px rgba(255, 184, 0, 0.4)) drop-shadow(0 0 10px rgba(255, 184, 0, 0.25))'
      },
      {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #34D399 50%, #00FF9D 100%)',
        filter: 'drop-shadow(0 10px 20px rgba(0, 255, 157, 0.4)) drop-shadow(0 0 10px rgba(0, 255, 157, 0.25))'
      },
      {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F472B6 50%, #FF007A 100%)',
        filter: 'drop-shadow(0 10px 20px rgba(255, 0, 122, 0.4)) drop-shadow(0 0 10px rgba(255, 0, 122, 0.25))'
      }
    ];

    let currentGlowIndex = 0;
    const heroNameEl = document.getElementById('heroName');

    if (heroNameEl) {
      heroNameEl.addEventListener('mouseenter', () => {
        const activePalette = neonGlowPalette[currentGlowIndex];
        heroNameEl.style.background = activePalette.gradient;
        heroNameEl.style.webkitBackgroundClip = 'text';
        heroNameEl.style.webkitTextFillColor = 'transparent';
        heroNameEl.style.filter = activePalette.filter;
        currentGlowIndex = (currentGlowIndex + 1) % neonGlowPalette.length;
      });

      heroNameEl.addEventListener('mouseleave', () => {
        heroNameEl.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #E6E6FA 45%, #FF2B3C 90%)';
        heroNameEl.style.webkitBackgroundClip = 'text';
        heroNameEl.style.webkitTextFillColor = 'transparent';
        heroNameEl.style.filter = 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.7))';
      });
    }

    if (testiWrap) {
      testiWrap.addEventListener('mouseenter', () => clearInterval(testiTimer));
      testiWrap.addEventListener('mouseleave', () => {
        testiTimer = setInterval(() => goToTesti((testiIndex + 1) % testimonials.length), 5500);
      });
    }
  }

  const socialRow = document.getElementById('socialRow');
  if (socialRow) {
    socials.forEach(s => {
      const a = document.createElement('a');
      a.href = s.href;
      a.className = 'social-btn';
      a.setAttribute('aria-label', s.label);
      a.textContent = s.i;
      a.style.fontSize = '.78rem';
      a.style.fontWeight = '700';
      socialRow.appendChild(a);
    });
  }

  /* ---------------------------------------------------------
     11. Re-observe dynamically injected reveal elements
  --------------------------------------------------------- */
  const lateTargets = document.querySelectorAll('.reveal:not(.in-view), .reveal-left:not(.in-view), .reveal-right:not(.in-view)');
  if (reduceMotion) {
    lateTargets.forEach(el => el.classList.add('in-view'));
  } else {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    lateTargets.forEach(el => io2.observe(el));
  }

  /* ---------------------------------------------------------
     12. CONTACT FORM — animated fake submit
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.style.opacity = '.7';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.opacity = '1';
        if (formMsg) formMsg.classList.add('show');
        form.reset();
        setTimeout(() => { if (formMsg) formMsg.classList.remove('show'); }, 4500);
      }, 900);
    });
  }

  /* ---------------------------------------------------------
     13. CARD TILT (desktop, subtle)
  --------------------------------------------------------- */
  if (!reduceMotion && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.skill-card, .cert-card, .about-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     14. BACK TO TOP
  --------------------------------------------------------- */
  const toTopBtn = document.getElementById('toTop');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------
     15. INTERACTIVE PROCESS STEPS SWITCHER (UPDATES LEFT SIDE)
  --------------------------------------------------------- */
  const pSteps = document.querySelectorAll('.p-step');
  const activeStepNum = document.getElementById('activeStepNum');
  const activeStepTitle = document.getElementById('activeStepTitle');
  const activeStepDesc = document.getElementById('activeStepDesc');

  if (pSteps.length) {
    pSteps.forEach(step => {
      const activateStep = () => {
        pSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');

        const num = step.getAttribute('data-step') || '01';
        const titleEl = step.querySelector('h4');
        const descEl = step.querySelector('p');

        if (activeStepNum) activeStepNum.textContent = String(num).padStart(2, '0');
        if (activeStepTitle && titleEl) {
          activeStepTitle.textContent = titleEl.textContent;
          activeStepTitle.style.animation = 'none';
          void activeStepTitle.offsetWidth; // Trigger reflow for animation restart
          activeStepTitle.style.animation = 'stepPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        if (activeStepDesc && descEl) {
          activeStepDesc.textContent = descEl.textContent;
          activeStepDesc.style.animation = 'none';
          void activeStepDesc.offsetWidth; // Trigger reflow
          activeStepDesc.style.animation = 'stepPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      };

      step.addEventListener('mouseenter', activateStep);
      step.addEventListener('focus', activateStep);
    });
  }

  /* ---------------------------------------------------------
     15B. INTERACTIVE 3D TILT ANIMATION FOR TOOLS I USE LOGOS
  --------------------------------------------------------- */
  const toolBoxes = document.querySelectorAll('.tool-box');
  toolBoxes.forEach(box => {
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -10;
      const tiltY = (x / (rect.width / 2)) * 10;
      box.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.04)`;
    });

    box.addEventListener('mouseleave', () => {
      box.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });

  /* ---------------------------------------------------------
     15C. SMOOTH 3D MOUSE ROTATION CONTROLLER FOR 3D CHARACTER
  --------------------------------------------------------- */
  const charWrap = document.getElementById('character3DContainer');
  const charCard = document.querySelector('.character-3d-card');
  const charGlow = document.querySelector('.character-3d-glow');

  if (charWrap && charCard) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isHovered = false;

    function animateCharacter3D() {
      if (isHovered) {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
      } else {
        currentX += (0 - currentX) * 0.08;
        currentY += (0 - currentY) * 0.08;
      }

      const rotateY = currentX * 25; // Smooth 3D Y rotation up to 25deg
      const rotateX = -currentY * 25; // Smooth 3D X rotation up to 25deg
      const translateZ = isHovered ? 28 : 0;
      const scale = isHovered ? 1.05 : 1;

      charCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${translateZ}px) scale(${scale})`;

      if (charGlow) {
        const glowX = ((currentX + 1) / 2) * 100;
        const glowY = ((currentY + 1) / 2) * 100;
        charGlow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 43, 60, 0.45) 0%, rgba(255, 43, 60, 0.1) 45%, transparent 70%)`;
      }

      requestAnimationFrame(animateCharacter3D);
    }

    animateCharacter3D();

    charWrap.addEventListener('mousemove', (e) => {
      const rect = charWrap.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
      isHovered = true;
    });

    charWrap.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    charWrap.addEventListener('mouseleave', () => {
      isHovered = false;
      mouseX = 0;
      mouseY = 0;
    });
  }

  /* ---------------------------------------------------------
     16. BIDIRECTIONAL SCROLL REVEAL (SCROLL UP & DOWN ANIMATIONS)
  --------------------------------------------------------- */
  const autoPopTargets = document.querySelectorAll(
    'section, .hero-left, .hero-center, .hero-right, .stat-box, .trio-col, .tool-box, .process-item, .project-card, .testi-card-item, .process-arc-wrap, .p-step, .process-card-header, .skills-marquee-container, .contact-left, .contact-center, .contact-right, .contact-row'
  );

  autoPopTargets.forEach(el => {
    el.classList.add('section-pop-reveal');
  });

  if ('IntersectionObserver' in window) {
    const popObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.popDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('pop-visible');
          }, Number(delay));
        } else {
          entry.target.classList.remove('pop-visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -25px 0px'
    });

    document.querySelectorAll('section').forEach(sec => {
      popObserver.observe(sec);
      const childItems = sec.querySelectorAll('.project-card, .trio-col, .testi-card-item, .stat-box, .tool-box, .hero-left, .hero-center, .hero-right, .process-item, .p-step, .process-arc-wrap, .process-card-header, .skills-marquee-container, .contact-left, .contact-center, .contact-right, .contact-row');
      childItems.forEach((item, idx) => {
        item.dataset.popDelay = (idx % 6) * 70; // 70ms stagger delay per element
        popObserver.observe(item);
      });
    });
  } else {
    autoPopTargets.forEach(el => el.classList.add('pop-visible'));
  }

  /* ---------------------------------------------------------
     18. FLOATING BADGE SMOOTH CLICK & ELEGANT RIPPLE
  --------------------------------------------------------- */
  const floatingBadge = document.querySelector('.floating-badge');
  if (floatingBadge) {
    floatingBadge.addEventListener('click', (e) => {
      floatingBadge.classList.remove('badge-clicked');
      void floatingBadge.offsetWidth; // Force reflow
      floatingBadge.classList.add('badge-clicked');

      const rect = floatingBadge.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // Smooth Crimson Accent Ripple
      const ripple = document.createElement('span');
      ripple.className = 'badge-ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      floatingBadge.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        floatingBadge.classList.remove('badge-clicked');
      }, 800);
    });
  }

  /* ---------------------------------------------------------
     19. TRIO SECTION CARDS (TOOLS I USE, WORK PROCESS, QUOTE CARD) SMALL POP-UP TILT
  --------------------------------------------------------- */
  const trioHoverCards = document.querySelectorAll('.trio-col, .tool-box, .process-item, .quote-card-inner');
  trioHoverCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;

      card.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0) scale(1)`;
    });
  });

  /* ---------------------------------------------------------
     21. "HELLO, I'M" SMOOTH SIDEWAY MOVING TRACKING
  --------------------------------------------------------- */
  const greetingEl = document.querySelector('.script-greeting, .handwritten-title');
  if (greetingEl) {
    greetingEl.addEventListener('mousemove', (e) => {
      const rect = greetingEl.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.55; // Sideway X movement tracking
      const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
      greetingEl.style.transform = `translate3d(${x}px, ${y - 4}px, 0) rotate(${-3 + x * 0.12}deg) scale(1.08)`;
    });

    greetingEl.addEventListener('mouseleave', () => {
      greetingEl.style.transform = `translate3d(0, 0, 0) rotate(-3deg) scale(1)`;
    });
  }

})();
