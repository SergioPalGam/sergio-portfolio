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
  let mode = 'default';
  const content = lightbox.querySelector('.lightbox-content');
  const caption = lightbox.querySelector('.lightbox-caption');

  function createPlaceholder(label) {
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    const span = document.createElement('span');
    span.textContent = label || 'Artwork';
    placeholder.appendChild(span);
    return placeholder;
  }

  function render() {
    const item = items[index];
    if (!item) return;

    const src = item.dataset.src || '';
    const alt = item.dataset.alt || '';
    const fallback = item.querySelector('.placeholder')?.textContent?.trim() || alt || 'Artwork';
    const description = item.dataset.caption || '';
    const linkText = item.dataset.linkText || '';
    const linkUrl = item.dataset.linkUrl || '';

    content.replaceChildren();
    caption.textContent = '';

    lightbox.classList.toggle('lightbox--tasting', mode === 'tasting');

    if (mode === 'tasting') {
      const frame = document.createElement('div');
      frame.className = 'lightbox-tasting-frame';

      if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        frame.appendChild(img);
      } else {
        frame.appendChild(createPlaceholder(fallback));
      }

      if (description || (linkText && linkUrl)) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-tasting-overlay';

        if (description) {
          const text = document.createElement('span');
          text.className = 'lightbox-tasting-text';
          text.textContent = description;
          overlay.appendChild(text);
        }

        if (linkText && linkUrl) {
          const link = document.createElement('a');
          link.className = 'lightbox-tasting-link';
          link.href = linkUrl;
          link.textContent = linkText;
          overlay.appendChild(link);
        }

        frame.appendChild(overlay);
      }

      content.appendChild(frame);
      return;
    }

    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      content.appendChild(img);
    } else {
      content.appendChild(createPlaceholder(fallback));
    }
    caption.textContent = description;
  }

  function open(group, start) {
    items = [...group.querySelectorAll('[data-lightbox-item]')];
    index = start;
    mode = group.dataset.lightboxMode || 'default';
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open', 'lightbox--tasting');
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
