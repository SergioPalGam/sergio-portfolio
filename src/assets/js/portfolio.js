(() => {
  const hero = document.querySelector('.welcome-hero');
  if (hero) {
    const slides = [...hero.querySelectorAll('.welcome-slide')];
    let current = 0;
    const seconds = Number(hero.dataset.welcomeInterval || 5);
    if (slides.length > 1) {
      window.setInterval(() => {
        slides[current].classList.remove('is-active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('is-active');
      }, Math.max(1, seconds) * 1000);
    }
  }

  const galleries = [...document.querySelectorAll('[data-lightbox-gallery]')];
  if (!galleries.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close">×</button>
    <button class="lightbox-prev" type="button" aria-label="Previous">‹</button>
    <div class="lightbox-content"></div>
    <button class="lightbox-next" type="button" aria-label="Next">›</button>
    <div class="lightbox-caption"></div>`;
  document.body.appendChild(lightbox);

  let items = [];
  let index = 0;
  const content = lightbox.querySelector('.lightbox-content');
  const caption = lightbox.querySelector('.lightbox-caption');

  function render() {
    const item = items[index];
    const src = item.dataset.src || '';
    const fallback = item.querySelector('.placeholder')?.textContent?.trim() || 'Artwork';
    content.innerHTML = src
      ? `<img src="${src}" alt="">`
      : `<div class="placeholder"><span>${fallback}</span></div>`;
    caption.textContent = item.dataset.caption || '';
  }

  function open(group, start) {
    items = [...group.querySelectorAll('[data-lightbox-item]')];
    index = start;
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleries.forEach(group => {
    const groupItems = [...group.querySelectorAll('[data-lightbox-item]')];
    groupItems.forEach((item, i) => item.addEventListener('click', () => open(group, i)));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    render();
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    index = (index + 1) % items.length;
    render();
  });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
  });
})();
