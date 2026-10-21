(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  function setTheme(theme) {
    root.dataset.theme = theme;
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.setAttribute('aria-label', theme === 'dark' ? '밝은 테마로 변경' : '어두운 테마로 변경');
    }
  }
  let saved;
  try { saved = localStorage.getItem('yeonsoo-theme'); } catch {}
  setTheme(saved === 'dark' ? 'dark' : 'light');
  toggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('yeonsoo-theme', theme); } catch {}
  });

  const links = [...document.querySelectorAll('[data-section-link]')];
  if ('IntersectionObserver' in window && links.length) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of links) {
          if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        }
      }
    }, {rootMargin: '-10% 0px -65% 0px', threshold: 0});
    for (const link of links) {
      const section = document.getElementById(link.hash.slice(1));
      if (section) observer.observe(section);
    }
  }

  const dialog = document.querySelector('[data-lightbox]');
  if (dialog) {
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('[data-lightbox-caption]');
    let returnFocus;
    for (const trigger of document.querySelectorAll('[data-zoom]')) {
      trigger.addEventListener('click', () => {
        returnFocus = trigger;
        const source = trigger.querySelector('img');
        image.src = source.currentSrc || source.src;
        image.alt = source.alt;
        caption.textContent = trigger.closest('figure').querySelector('figcaption')?.textContent || '';
        caption.hidden = !caption.textContent;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      });
    }
    dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
      returnFocus?.focus();
    });
  }
})();
