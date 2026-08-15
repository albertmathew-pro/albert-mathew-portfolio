(() => {
  const terms = [...document.querySelectorAll('.recordTerm')];
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const closeTerm = (term) => {
    const popup = document.getElementById(term.getAttribute('aria-controls'));
    term.setAttribute('aria-expanded', 'false');
    term.removeAttribute('data-open');
    if (popup) popup.hidden = true;
  };

  const openTerm = (term) => {
    terms.filter((candidate) => candidate !== term).forEach(closeTerm);
    const popup = document.getElementById(term.getAttribute('aria-controls'));
    term.setAttribute('aria-expanded', 'true');
    term.setAttribute('data-open', 'true');
    if (popup) popup.hidden = false;
  };

  terms.forEach((term) => {
    if (hoverCapable) {
      term.addEventListener('mouseenter', () => openTerm(term));
      term.addEventListener('mouseleave', () => closeTerm(term));
    }
    term.addEventListener('click', () => {
      if (term.getAttribute('aria-expanded') === 'true') closeTerm(term);
      else openTerm(term);
    });

    term.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (term.getAttribute('aria-expanded') === 'true') closeTerm(term);
        else openTerm(term);
        return;
      }
      if (event.key === 'Escape') {
        closeTerm(term);
        term.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.recordTerm')) terms.forEach(closeTerm);
  });
})();
