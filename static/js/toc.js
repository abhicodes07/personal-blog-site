/* static/js/toc.js — Table of Contents: scroll-spy, drawer, progress bar */

(function () {
  /* ── Slugify heading text into a stable id ────────────────────────── */
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* ── Ensure every heading has a unique id ─────────────────────────── */
  function assignHeadingIds(headings) {
    const seen = {};
    headings.forEach(el => {
      if (!el.id) {
        let base = slugify(el.textContent);
        if (!base) base = 'heading';
        let id = base;
        let n  = 1;
        while (seen[id]) { id = `${base}-${n++}`; }
        el.id = id;
      }
      seen[el.id] = true;
    });
  }

  /* ── Build the TOC nav list ───────────────────────────────────────── */
  function buildTOC(headings, nav) {
    if (!headings.length) {
      nav.innerHTML = '<p style="color:#6c7086;font-size:.75rem;font-style:italic">No headings found.</p>';
      return;
    }

    const frag = document.createDocumentFragment();

    headings.forEach(el => {
      const level = parseInt(el.tagName[1], 10); // 1–4
      const a = document.createElement('a');
      a.href        = `#${el.id}`;
      a.textContent = el.textContent.replace(/^#+\s*/, '');
      a.className   = `toc-link toc-h${level}`;
      a.dataset.target = el.id;

      /* Smooth-scroll + close drawer on mobile */
      a.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById(el.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeTOC();
      });

      frag.appendChild(a);
    });

    nav.innerHTML = '';
    nav.appendChild(frag);
  }

  /* ── Scroll-spy via IntersectionObserver ──────────────────────────── */
  function initScrollSpy(headings) {
    let activeId = null;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeId = entry.target.id;
      });

      document.querySelectorAll('.toc-link').forEach(a => {
        a.classList.toggle('toc-active', a.dataset.target === activeId);
      });

      /* Keep the active link visible inside the TOC nav */
      const activeLink = document.querySelector(`.toc-link[data-target="${activeId}"]`);
      activeLink?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, {
      rootMargin: '-15% 0px -75% 0px',
      threshold: 0,
    });

    headings.forEach(h => observer.observe(h));
  }

  /* ── Reading-progress bar ─────────────────────────────────────────── */
  function initProgress() {
    const bar = document.getElementById('toc-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const doc     = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total   = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`;
    }, { passive: true });
  }

  /* ── Mobile drawer open / close ───────────────────────────────────── */
  function openTOC() {
    document.getElementById('toc-panel').classList.add('toc-open');
    document.getElementById('toc-backdrop').classList.add('toc-open');
    document.body.style.overflow = 'hidden';
    const icon  = document.querySelector('.toc-toggle-icon');
    const label = document.querySelector('.toc-toggle-label');
    if (icon)  icon.textContent  = 'close';
    if (label) label.textContent = 'Close';
  }

  function closeTOC() {
    document.getElementById('toc-panel').classList.remove('toc-open');
    document.getElementById('toc-backdrop').classList.remove('toc-open');
    document.body.style.overflow = '';
    const icon  = document.querySelector('.toc-toggle-icon');
    const label = document.querySelector('.toc-toggle-label');
    if (icon)  icon.textContent  = 'format_list_bulleted';
    if (label) label.textContent = 'Outline';
  }

  /* ── Wire up buttons ──────────────────────────────────────────────── */
  function bindButtons() {
    document.getElementById('toc-toggle')?.addEventListener('click', () => {
      document.getElementById('toc-panel').classList.contains('toc-open')
        ? closeTOC()
        : openTOC();
    });
    document.getElementById('toc-close')?.addEventListener('click', closeTOC);
    document.getElementById('toc-backdrop')?.addEventListener('click', closeTOC);
  }

  /* ── Main init ────────────────────────────────────────────────────── */
  function init() {
    const body = document.getElementById('post-body');
    const nav  = document.getElementById('toc-nav');
    if (!body || !nav) return;

    const headings = Array.from(body.querySelectorAll('h1, h2, h3, h4'));
    assignHeadingIds(headings);
    buildTOC(headings, nav);
    initScrollSpy(headings);
    initProgress();
    bindButtons();
  }

  /* Wait slightly longer than highlight-init.js's setTimeout(10ms) so
     the code-window DOM rewrites have already happened before we query. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 50));
  } else {
    setTimeout(init, 50);
  }
})();
