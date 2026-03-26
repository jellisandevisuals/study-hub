/* ─── Hamburger mobile nav ─── */
function initMobileNav() {
  document.querySelectorAll('.nav-dark, .nav-light').forEach(nav => {
    // Inject hamburger button
    const burger = document.createElement('button');
    burger.className = 'nav-hamburger';
    burger.setAttribute('aria-label', 'Open menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    // Inject mobile drawer after nav
    const drawer = document.createElement('div');
    drawer.className = 'nav-mobile-drawer';
    const links = [
      { href: 'part1.html', label: 'Part I' },
      { href: 'part2.html', label: 'Part II' },
      { href: 'part3.html', label: 'Part III' },
      { href: 'premium.html', label: 'Premium' },
    ];
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.href;
      a.className = 'nav-mobile-link' + (l.href === path ? ' active' : '');
      a.textContent = l.label;
      drawer.appendChild(a);
    });
    if (nav.classList.contains('nav-dark')) {
      const cta = document.createElement('a');
      cta.href = 'part1.html';
      cta.className = 'nav-mobile-cta';
      cta.textContent = 'View Collection';
      drawer.appendChild(cta);
    }
    nav.parentNode.insertBefore(drawer, nav.nextSibling);

    // Toggle
    burger.addEventListener('click', e => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', () => nav.classList.remove('open'));
    drawer.addEventListener('click', e => e.stopPropagation());
  });
}


/* ─── Build accordion from concepts data ─── */
function buildAccordion(partNum, containerId) {
  const list = document.getElementById(containerId);
  if (!list) return;

  const partConcepts = concepts.filter(c => c.part === partNum);
  const isPremium = partNum === 4;

  partConcepts.forEach(c => {
    const isItalic = c.name === 'Slow Burn' || c.name === 'Verso';
    const isJosefin = c.name === 'Deep Seat';
    const nameClass = isItalic ? 'italic' : isJosefin ? 'josefin' : '';
    const traitBorderColor = isPremium ? '#1E140D' : '#DDD4C8';
    const traitTextColor = isPremium ? '#1E140D' : '#A0704E';

    const traitPills = c.traits.map(t =>
      `<span class="trait-pill" style="border-color:${traitBorderColor};color:${traitTextColor};">${t}</span>`
    ).join('');

    const detailTraits = c.traits.map(t =>
      `<span class="detail-trait-pill">${t}</span>`
    ).join('');

    const colorDots = (c.colors || []).map(col => {
      const isLight = ['#FAF6F0','#F5EDE3','#E8DED1','#D4C5A9','#F0EAE0','#EDE6DC','#F2E4C0','#F0EBE0','#F0E9E0'].includes(col);
      return `<div class="color-dot" style="background:${col};${isLight ? 'border:1px solid #C4B89A;' : ''}"></div>`;
    }).join('');

    const logoVB = (c.logoSvg || '').includes('88') ? '0 0 88 88' : '0 0 80 80';
    const logoSize = (c.logoSvg || '').includes('88') ? 88 : 80;
    const logoNameColor = isPremium ? '#D4C5A9' : '#E8DED1';
    const logoSubColor = isPremium ? '#B8934B' : (c.id === 2 ? '#8B7355' : '#C27549');
    const premiumDivider = isPremium ? `<div class="concept-logo-divider"></div>` : '';
    const rowClass = isPremium ? 'concept-row premium-row' : 'concept-row';
    const detailClass = isPremium ? 'concept-detail premium-detail' : 'concept-detail';
    const conceptLabel = isPremium ? `Concept ${c.romanNum}` : `Concept ${c.num}`;

    // Row
    const row = document.createElement('div');
    row.className = rowClass;
    row.dataset.index = c.id;
    row.innerHTML = `
      <div class="concept-icon-cell" style="background:${c.iconBg};">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">${c.iconSvg}</svg>
      </div>
      <div class="concept-info-cell">
        <span class="concept-num">${conceptLabel}</span>
        <span class="concept-name-row ${nameClass}">${c.name}</span>
        <span class="concept-tagline-row">${c.tagline}</span>
      </div>
      <div class="concept-traits-cell">${traitPills}</div>
      <div class="concept-arrow-cell"><span class="concept-arrow">↓</span></div>
    `;

    // Detail (uses inner wrapper for animation)
    const detail = document.createElement('div');
    detail.className = detailClass;
    detail.dataset.for = c.id;
    detail.innerHTML = `
      <div class="concept-detail-inner">
        <div class="concept-detail-left">
          <p class="concept-detail-label">${conceptLabel} — Brand Identity</p>
          <h2 class="concept-detail-name ${nameClass}">${c.name}</h2>
          <p class="concept-detail-tagline">${c.tagline}</p>
          <p class="concept-detail-desc">${c.description}</p>
          <div class="concept-detail-traits">${detailTraits}</div>
          <div class="concept-detail-colors">${colorDots}</div>
        </div>
        <div class="concept-detail-right" style="background:${c.iconBg};">
          <svg width="${logoSize}" height="${logoSize}" viewBox="${logoVB}" fill="none" xmlns="http://www.w3.org/2000/svg">${c.logoSvg}</svg>
          <div class="concept-logo-text">
            <span class="concept-logo-name" style="color:${logoNameColor};">${c.logoName}</span>
            ${premiumDivider}
            <span class="concept-logo-subtitle" style="color:${logoSubColor};">${c.subtitle}</span>
          </div>
        </div>
      </div>
    `;

    list.appendChild(row);
    list.appendChild(detail);
  });

  // Click handlers
  const rows = list.querySelectorAll('.concept-row');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      const idx = row.dataset.index;
      const detail = list.querySelector(`.concept-detail[data-for="${idx}"]`);
      const arrow = row.querySelector('.concept-arrow');
      const isOpen = detail.classList.contains('open');

      // Close all
      list.querySelectorAll('.concept-detail.open').forEach(d => d.classList.remove('open'));
      list.querySelectorAll('.concept-row.active').forEach(r => {
        r.classList.remove('active');
        const a = r.querySelector('.concept-arrow');
        if (a) a.textContent = '↓';
      });

      if (!isOpen) {
        detail.classList.add('open');
        row.classList.add('active');
        if (arrow) arrow.textContent = '↑';
        // Scroll into view after transition
        setTimeout(() => {
          detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
      }
    });
  });

  // Open first by default
  if (rows.length > 0) rows[0].click();
}


/* ─── Scroll reveal with IntersectionObserver ─── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  els.forEach(el => {
    // Reveal immediately if already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed');
    } else {
      observer.observe(el);
    }
  });
}


/* ─── Active nav link ─── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}


/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  setActiveNav();
  initScrollReveal();
});
