// Build accordion from concepts data
function buildAccordion(partNum, containerId) {
  const list = document.getElementById(containerId);
  if (!list) return;

  const partConcepts = concepts.filter(c => c.part === partNum);
  const isPremium = partNum === 4;

  partConcepts.forEach((c, i) => {
    const isItalic = c.name === 'Slow Burn' || c.name === 'Verso';
    const isJosefin = c.name === 'Deep Seat';
    const nameClass = isItalic ? 'italic' : isJosefin ? 'josefin' : '';
    const traitBorderColor = isPremium ? '#1E140D' : '#DDD4C8';
    const traitTextColor = isPremium ? '#1E140D' : '#A0704E';

    // Trait pills HTML
    const traitPills = c.traits.map(t =>
      `<span class="trait-pill" style="border-color:${traitBorderColor};color:${traitTextColor};">${t}</span>`
    ).join('');

    // Detail trait pills
    const detailTraits = c.traits.map(t =>
      `<span class="detail-trait-pill">${t}</span>`
    ).join('');

    // Color dots
    const colorDots = (c.colors || []).map(col =>
      `<div class="color-dot" style="background:${col};${col === '#FAF6F0' || col === '#F5EDE3' || col === '#E8DED1' || col === '#D4C5A9' ? 'border:1px solid #C4B89A;' : ''}"></div>`
    ).join('');

    // Logo SVG size
    const logoVB = (c.logoSvg || '').includes('88') ? '0 0 88 88' : '0 0 80 80';
    const logoSize = (c.logoSvg || '').includes('88') ? 88 : 80;

    // Logo name colors
    const logoNameColor = isPremium ? '#D4C5A9' : '#E8DED1';
    const logoSubColor = isPremium ? '#B8934B' : (c.id === 2 ? '#8B7355' : c.id === 3 ? '#FAF6F0' : c.terracotta || '#C27549');

    // Premium extras
    const premiumDivider = isPremium ? `<div class="concept-logo-divider"></div>` : '';
    const rowClass = isPremium ? 'concept-row premium-row' : 'concept-row';
    const detailClass = isPremium ? 'concept-detail premium-detail' : 'concept-detail';

    const row = document.createElement('div');
    row.className = rowClass;
    row.dataset.index = c.id;
    row.innerHTML = `
      <div class="concept-icon-cell" style="background:${c.iconBg};">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">${c.iconSvg}</svg>
      </div>
      <div class="concept-info-cell">
        <span class="concept-num">${isPremium ? 'Concept ' + c.romanNum : 'Concept ' + c.num}</span>
        <span class="concept-name-row ${nameClass}">${c.name}</span>
        <span class="concept-tagline-row">${c.tagline}</span>
      </div>
      <div class="concept-traits-cell">${traitPills}</div>
      <div class="concept-arrow-cell"><span class="concept-arrow">↓</span></div>
    `;

    const detail = document.createElement('div');
    detail.className = detailClass;
    detail.dataset.for = c.id;
    detail.innerHTML = `
      <div class="concept-detail-left">
        <p class="concept-detail-label">${isPremium ? 'Concept ' + c.romanNum + ' — Brand Identity' : 'Concept ' + c.num + ' — Brand Identity'}</p>
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
    `;

    list.appendChild(row);
    list.appendChild(detail);
  });

  // Attach click handlers
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

      // Toggle open
      if (!isOpen) {
        detail.classList.add('open');
        row.classList.add('active');
        if (arrow) arrow.textContent = '↑';
      }
    });
  });

  // Open first by default
  if (rows.length > 0) {
    rows[0].click();
  }
}

// Set active nav link
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  // Each page calls buildAccordion with its part number
});
