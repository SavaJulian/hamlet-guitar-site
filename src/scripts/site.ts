/** Behavior shared by every page: menu, reveals, the six strings, videos and forms. */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initMenu() {
  const button = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const menu = document.querySelector<HTMLElement>('#mobile-nav');
  if (!button || !menu) return;
  let closing = 0;
  const setOpen = (open: boolean) => {
    window.clearTimeout(closing);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    menu.toggleAttribute('data-closing', !open && !menu.hidden);
    if (open) {
      menu.hidden = false;
      return;
    }
    // Let the panel fold away before it leaves the page; instant under reduced motion.
    closing = window.setTimeout(
      () => {
        menu.hidden = true;
        menu.removeAttribute('data-closing');
      },
      reducedMotion.matches ? 0 : 220
    );
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}

/** Sections rise into place the first time they scroll into view. */
function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-in'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  items.forEach((item) => observer.observe(item));
}

interface GuitarString {
  path: SVGPathElement;
  y: number;
  amplitude: number;
  start: number;
  frequency: number;
  decay: number;
  at: number;
}

/**
 * Each string is an SVG path with one control point. Plucking sets an
 * amplitude that rings out as a damped sine, lower and longer on the bass side.
 */
function initStrings() {
  document.querySelectorAll<HTMLElement>('[data-strings]').forEach((root) => {
    const svg = root.querySelector<SVGSVGElement>('svg');
    if (!svg) return;
    const height = svg.viewBox.baseVal.height;
    const width = svg.viewBox.baseVal.width;
    const strings: GuitarString[] = Array.from(svg.querySelectorAll<SVGPathElement>('path')).map((path, index) => ({
      path,
      y: Number(path.dataset.y),
      amplitude: 0,
      start: 0,
      frequency: 5.5 + index * 1.3,
      decay: 1.7 - index * 0.16,
      at: width / 2,
    }));
    let frame = 0;

    const draw = (now: number) => {
      let ringing = false;
      for (const string of strings) {
        const elapsed = (now - string.start) / 1000;
        const envelope = string.amplitude * Math.exp(-elapsed / (string.decay * 0.45));
        let offset = 0;
        if (Math.abs(envelope) > 0.08) {
          offset = envelope * Math.cos(elapsed * string.frequency * Math.PI * 2);
          ringing = true;
        } else {
          string.amplitude = 0;
        }
        // A quadratic curve peaks at half its control offset, hence the factor two.
        string.path.setAttribute(
          'd',
          offset
            ? `M0 ${string.y} Q${string.at.toFixed(1)} ${(string.y + offset * 2).toFixed(2)} ${width} ${string.y}`
            : `M0 ${string.y} Q${width / 2} ${string.y} ${width} ${string.y}`
        );
      }
      frame = ringing ? requestAnimationFrame(draw) : 0;
    };

    const pluck = (index: number, amplitude: number, at = width / 2) => {
      if (reducedMotion.matches) return;
      const string = strings[index];
      if (!string) return;
      string.amplitude = amplitude;
      string.start = performance.now();
      string.at = Math.min(width * 0.9, Math.max(width * 0.1, at));
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const strum = (strength = 1, at = width * 0.62) =>
      strings.forEach((_, index) =>
        window.setTimeout(() => pluck(index, (7 - index * 0.7) * strength, at), index * 75)
      );

    let lastY: number | undefined;
    root.addEventListener('pointerleave', () => (lastY = undefined));
    root.addEventListener('pointermove', (event) => {
      const box = svg.getBoundingClientRect();
      if (!box.height) return;
      const y = ((event.clientY - box.top) / box.height) * height;
      const x = ((event.clientX - box.left) / box.width) * width;
      if (lastY !== undefined) {
        const from = Math.min(lastY, y);
        const to = Math.max(lastY, y);
        strings.forEach((string, index) => {
          if (string.y < from || string.y > to) return;
          const force = Math.min(9, Math.max(3.5, Math.abs(y - lastY!) * 0.7));
          pluck(index, y > lastY! ? force : -force, x);
        });
      }
      lastY = y;
    });

    if (root.hasAttribute('data-strum-on-load')) window.setTimeout(() => strum(), 900);
    if (root.hasAttribute('data-strum-on-view') && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          strum(0.8, width / 2);
          observer.disconnect();
        },
        { threshold: 0.6 }
      );
      observer.observe(root);
    }
    // On phones there is no pointer to pluck with, so scrolling strums instead.
    let lastScrollStrum = 0;
    let lastScrollY = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        if (window.innerWidth > 820 || reducedMotion.matches) return;
        const now = performance.now();
        const moved = Math.abs(window.scrollY - lastScrollY);
        if (now - lastScrollStrum < 420 || moved < 6) return;
        const box = root.getBoundingClientRect();
        if (box.bottom < 0 || box.top > window.innerHeight) return;
        lastScrollStrum = now;
        const down = window.scrollY > lastScrollY;
        lastScrollY = window.scrollY;
        const strength = Math.min(1, 0.45 + moved / 160) * (down ? 1 : -1);
        strum(strength, width * (0.3 + Math.random() * 0.4));
      },
      { passive: true }
    );
    document.querySelectorAll<HTMLElement>('[data-strum]').forEach((trigger) => {
      trigger.addEventListener('pointerenter', () => {
        if (strings.every((string) => string.amplitude === 0)) strum(0.55);
      });
    });
  });
}

/** Video tiles are plain links; with script they open in a dialog instead. */
function initVideos() {
  const dialog = document.querySelector<HTMLDialogElement>('#video-dialog');
  const stage = dialog?.querySelector<HTMLElement>('.dialog-stage');
  if (!dialog || !stage || typeof dialog.showModal !== 'function') return;
  let opener: HTMLElement | undefined;

  document.querySelectorAll<HTMLAnchorElement>('a[data-video]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      opener = link;
      const title = link.dataset.title || 'Video';
      stage.style.setProperty('--ratio', link.dataset.ratio || '1.7778');
      stage.replaceChildren();
      if (link.dataset.video === 'youtube') {
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.youtube}?autoplay=1&rel=0`;
        frame.title = title;
        frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        stage.append(frame);
      } else {
        const video = document.createElement('video');
        video.src = link.href;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('aria-label', title);
        const poster = link.querySelector('img')?.currentSrc;
        if (poster) video.poster = poster;
        stage.append(video);
      }
      dialog.setAttribute('aria-label', title);
      dialog.showModal();
    });
  });

  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    stage.replaceChildren();
    opener?.focus();
  });
}

/** The floating action shows only while no other primary button is on screen. */
function initFloatingAction() {
  const action = document.querySelector<HTMLElement>('.float-cta');
  if (!action || !('IntersectionObserver' in window)) return;
  const visible = new Set<Element>();
  const targets = document.querySelectorAll('[data-primary-action], form[data-inquiry] button[type="submit"]');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    action.toggleAttribute('data-show', visible.size === 0);
  });
  targets.forEach((target) => observer.observe(target));
}

/** Lesson rows preselect the matching option in the inquiry form. */
function initInterestLinks() {
  document.querySelectorAll<HTMLElement>('[data-interest]').forEach((link) =>
    link.addEventListener('click', () => {
      const select = document.querySelector<HTMLSelectElement>('#lesson-interest');
      if (select) select.value = link.dataset.interest || '';
    })
  );
}

function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-inquiry]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('.form-status');
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const label = submit?.querySelector('span');
    const idleLabel = label?.textContent || '';
    const fields = Array.from(form.querySelectorAll<HTMLInputElement>('input[required]'));
    form.noValidate = true;

    const validate = (field: HTMLInputElement) => {
      let message = '';
      if (!field.value.trim()) {
        if (field.type === 'email') message = 'Vul je e-mailadres in.';
        else if (field.type === 'tel') message = 'Vul je telefoonnummer in.';
        else message = 'Vul je naam in.';
      } else if (field.type === 'email' && field.validity.typeMismatch) {
        message = 'Vul een geldig e-mailadres in, zoals naam@voorbeeld.be.';
      }
      const error = document.getElementById(`${field.id}-error`);
      if (error) {
        error.textContent = message;
        error.hidden = !message;
      }
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      return !message;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value || field.hasAttribute('aria-invalid')) validate(field);
      });
      field.addEventListener('input', () => {
        if (field.hasAttribute('aria-invalid')) validate(field);
      });
    });

    form.addEventListener('submit', (event) => {
      if (form.dataset.ready !== 'true') {
        event.preventDefault();
        if (status) status.textContent = 'Verzenden is nog niet ingeschakeld. Je kunt Hamlet wel rechtstreeks bellen.';
        return;
      }
      const invalid = fields.filter((field) => !validate(field));
      if (invalid.length) {
        event.preventDefault();
        if (status) status.textContent = 'Controleer de gemarkeerde velden voordat je je aanvraag verstuurt.';
        invalid[0].focus();
        return;
      }
      fields.forEach((field) => (field.value = field.value.trim()));
      if (submit) {
        submit.disabled = true;
        submit.setAttribute('aria-busy', 'true');
        if (label) label.textContent = 'Je aanvraag wordt verstuurd…';
      }
      if (status) status.textContent = 'Je aanvraag wordt verstuurd. Wacht op de bevestiging op de volgende pagina.';
    });

    // A native POST can leave this page in the browser's back-forward cache.
    window.addEventListener('pageshow', () => {
      if (submit && form.dataset.ready === 'true') {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        if (label) label.textContent = idleLabel;
        if (status) status.textContent = '';
      }
    });
  });
}

initMenu();
initReveal();
initStrings();
initVideos();
initFloatingAction();
initInterestLinks();
initForms();
