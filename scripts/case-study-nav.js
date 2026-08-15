(() => {
  const pageLinks = [...document.querySelectorAll('.pageIndex > nav a[href^="#"]')];
  const menuLinks = [...document.querySelectorAll('.pageIndex > nav a')];
  const pageJump = document.querySelector('.pageJump');
  const pageIndex = document.querySelector('.pageIndex');
  const pageIndexClose = document.querySelector('.pageIndexClose');
  const pageIndexScrim = document.querySelector('.pageIndexScrim');
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  const observedSections = pageLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    pageLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) setActive(href.slice(1));
      if (mobileQuery.matches) setMenuOpen(false);
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) setActive(visible[0].target.id);
  }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });

  observedSections.forEach((section) => sectionObserver.observe(section));

  const setMenuOpen = (open) => {
    if (!pageJump || !pageIndex || !mobileQuery.matches) return;
    pageJump.setAttribute('aria-expanded', String(open));
    pageJump.setAttribute('aria-label', open ? 'Close page navigation' : 'Open page navigation');
    pageJump.querySelector('.pageJumpIcon').textContent = open ? '×' : '☰';
    pageIndex.classList.toggle('is-open', open);
    pageIndex.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('pageIndexOpen', open);
    if (open) pageIndexClose?.focus();
    else pageJump.focus();
  };

  const syncMenuForViewport = () => {
    if (!pageJump || !pageIndex) return;
    if (mobileQuery.matches) {
      pageIndex.setAttribute('aria-hidden', 'true');
    } else {
      pageIndex.classList.remove('is-open');
      pageIndex.removeAttribute('aria-hidden');
      pageJump.setAttribute('aria-expanded', 'false');
      pageJump.setAttribute('aria-label', 'Open page navigation');
      pageJump.querySelector('.pageJumpIcon').textContent = '☰';
      document.body.classList.remove('pageIndexOpen');
    }
  };

  pageJump?.addEventListener('click', () => setMenuOpen(!pageIndex.classList.contains('is-open')));
  pageIndexClose?.addEventListener('click', () => setMenuOpen(false));
  pageIndexScrim?.addEventListener('click', () => setMenuOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pageIndex?.classList.contains('is-open')) setMenuOpen(false);
  });
  mobileQuery.addEventListener?.('change', syncMenuForViewport);
  syncMenuForViewport();
})();
