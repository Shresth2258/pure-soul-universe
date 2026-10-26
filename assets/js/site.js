(function () {
  'use strict';

  function updateYear() {
    document.querySelectorAll('[data-psu-year]').forEach(function (item) {
      item.textContent = String(new Date().getFullYear());
    });
  }

  function openBooking(trigger) {
    var modal = document.querySelector('[data-psu-booking-modal]');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('psu-booking-open');
    var requestedType = trigger && trigger.getAttribute('data-booking-type');
    if (requestedType) {
      var select = modal.querySelector('select[name="interest"]');
      if (select) select.value = requestedType;
    }
    window.setTimeout(function () {
      var first = modal.querySelector('select, input, textarea, button');
      if (first) first.focus();
    }, 80);
  }

  function closeBooking() {
    var modal = document.querySelector('[data-psu-booking-modal]');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('psu-booking-open');
  }

  function whatsappLines(data, prefix) {
    return [
      prefix || 'Namaste Pure Soul Universe,',
      'Name: ' + (data.get('name') || 'Guest'),
      data.get('phone') ? 'Phone / WhatsApp: ' + data.get('phone') : '',
      data.get('email') ? 'Email: ' + data.get('email') : '',
      data.get('interest') ? 'Booking type / interest: ' + data.get('interest') : '',
      data.get('date') ? 'Preferred date: ' + data.get('date') : '',
      data.get('guests') ? 'Guests: ' + data.get('guests') : '',
      data.get('message') ? 'Message: ' + data.get('message') : '',
      'Please share availability and the next steps.'
    ].filter(Boolean);
  }

  if (!window.__PURE_SOUL_SITE_BOUND__) {
    window.__PURE_SOUL_SITE_BOUND__ = true;

    document.addEventListener('click', function (event) {
      var menuButton = event.target.closest('[data-psu-menu-button]');
      if (menuButton) {
        var menu = document.getElementById(menuButton.getAttribute('aria-controls'));
        if (menu) {
          var open = menuButton.getAttribute('aria-expanded') !== 'true';
          menuButton.setAttribute('aria-expanded', String(open));
          menu.classList.toggle('is-open', open);
        }
        return;
      }
      var openButton = event.target.closest('[data-psu-open-booking]');
      if (openButton) {
        event.preventDefault();
        openBooking(openButton);
        return;
      }
      if (event.target.closest('[data-psu-close-booking]')) {
        event.preventDefault();
        closeBooking();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeBooking();
    });

    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      if (form.matches('[data-psu-booking-form]')) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var bookingData = new FormData(form);
        var bookingStatus = form.querySelector('[data-psu-form-status]');
        if (bookingStatus) bookingStatus.textContent = 'Opening WhatsApp with your booking request…';
        window.open('https://wa.me/918800316274?text=' + encodeURIComponent(whatsappLines(bookingData, 'Namaste Pure Soul Universe, I would like to make a booking request.').join('\n')), '_blank', 'noopener');
        return;
      }

      if (form.matches('[data-psu-whatsapp-form]')) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var data = new FormData(form);
        var status = form.querySelector('[data-psu-form-status]');
        if (status) status.textContent = 'Opening WhatsApp with your enquiry…';
        window.open('https://wa.me/918800316274?text=' + encodeURIComponent(whatsappLines(data).join('\n')), '_blank', 'noopener');
        return;
      }

      if (form.matches('[data-psu-newsletter]')) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var newsletterData = new FormData(form);
        var email = newsletterData.get('email');
        var newsletterStatus = form.querySelector('[data-psu-newsletter-status]');
        if (newsletterStatus) newsletterStatus.textContent = 'Opening your email app to confirm…';
        window.location.href = 'mailto:psuwellnessandresorts01@gmail.com?subject=' + encodeURIComponent('Pure Soul Universe newsletter request') + '&body=' + encodeURIComponent('Please add ' + email + ' to the Pure Soul Universe newsletter list.');
      }
    });
  }

  updateYear();
  window.setTimeout(updateYear, 300);
})();
(function () {
  'use strict';
  var lastBookingTrigger = null;

  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    if (!input.min) input.min = new Date().toISOString().slice(0, 10);
  });

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-psu-open-booking]');
    if (opener) lastBookingTrigger = opener;

    if (event.target.closest('[data-psu-close-booking]')) {
      window.setTimeout(function () {
        if (lastBookingTrigger) lastBookingTrigger.focus();
      }, 100);
    }

    var mobileLink = event.target.closest('.psu-mobile-menu a');
    if (mobileLink) {
      var menu = mobileLink.closest('.psu-mobile-menu');
      var button = document.querySelector('[data-psu-menu-button]');
      if (menu) menu.classList.remove('is-open');
      if (button) button.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var modal = document.querySelector('[data-psu-booking-modal].is-open');
    if (!modal) return;
    var focusable = Array.from(modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();





/* =====================================================================
   PURE SOUL UNIVERSE — ANIMATIONS.JS
   Isko site.js ke BAAD load karna hai. HTML me koi aur change nahi chahiye;
   ye script khud sahi elements ko dhoondh kar animation laga deti hai.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // jinko motion pasand nahi, unhe animation nahi dikhegi

  root.classList.add('psu-anim');

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function once(el, name) { if (el.__psu_done && el.__psu_done[name]) return false; (el.__psu_done = el.__psu_done || {})[name] = 1; return true; }

  /* ------------------------------------------------------------------
     1. LOADER (sirf pehli baar jab site khuli ho — har page par nahi)
     ------------------------------------------------------------------ */
  var hero = document.querySelector('.psu-hero');
  var isHome = !!document.querySelector('[data-psu-page="home"]');
  var showLoader = false;
  try { showLoader = isHome && !sessionStorage.getItem('psuLoaderSeen'); } catch (e) {}

  function startHero() { if (hero) hero.classList.add('psu-hero-go'); }

  if (showLoader) {
    var loader = document.createElement('div');
    loader.className = 'psu-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML =
      '<div class="psu-loader__inner">' +
      '<span class="psu-loader__mark">✦</span>' +
      '<div class="psu-loader__name">Pure <em>Soul</em></div>' +
      '<div class="psu-loader__bar"><i></i></div></div>';
    document.body.appendChild(loader);
    var hid = false;
    var hideLoader = function () {
      if (hid) return; hid = true;
      loader.classList.add('is-hidden');
      try { sessionStorage.setItem('psuLoaderSeen', '1'); } catch (e) {}
      setTimeout(startHero, 120);
      setTimeout(function () { loader.remove(); }, 1000);
    };
    var minWait = new Promise(function (r) { setTimeout(r, 900); });
    var loaded = new Promise(function (r) {
      if (document.readyState === 'complete') r(); else window.addEventListener('load', r);
    });
    Promise.all([minWait, loaded]).then(hideLoader);
    setTimeout(hideLoader, 4000); // safety: kabhi atke nahi
  } else {
    setTimeout(startHero, 30);
  }

  /* ------------------------------------------------------------------
     2. SCROLL PROGRESS BAR + HERO PARALLAX
     ------------------------------------------------------------------ */
  var bar = document.createElement('div');
  bar.className = 'psu-progress';
  document.body.appendChild(bar);

  // SAFETY: koi bhi cheez screen par aa chuki ho ya scroll karke nikal gayi ho,
  // to use pakka dikha do (kuch bhi hamesha hidden nahi rahega)
  function revealPendingImages() {
    var vh = window.innerHeight;
    var list = document.querySelectorAll('[data-reveal-img]:not(.is-visible), [data-reveal]:not(.is-visible), [data-psu-heading]:not(.is-visible)');
    for (var k = 0; k < list.length; k++) {
      var el = list[k];
      var r = el.getBoundingClientRect();
      var isImg = el.hasAttribute('data-reveal-img');
      if (r.bottom <= 0) el.classList.add('is-visible');
      else if (isImg && r.top < vh * 0.92) el.classList.add('is-visible');
    }
  }
  window.addEventListener('load', function () {
    setTimeout(revealPendingImages, 1200);
    setTimeout(revealPendingImages, 3500);
  });

  var heroVideo = document.querySelector('.psu-hero-media video, .psu-hero-media img');
  var ticking = false;

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    revealPendingImages();
    if (heroVideo && y < window.innerHeight * 1.2) {
      heroVideo.style.translate = '0 ' + (y * 0.25).toFixed(1) + 'px';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     3. HERO EXTRAS: scroll cue (patte/petals hata diye gaye)
     ------------------------------------------------------------------ */
  if (hero && document.querySelector('.psu-hero-media')) {
    var cue = document.createElement('div');
    cue.className = 'psu-scroll-cue';
    cue.setAttribute('aria-hidden', 'true');
    hero.appendChild(cue);
  }

  /* ------------------------------------------------------------------
     4. HEADINGS -> word by word reveal
     ------------------------------------------------------------------ */
  var headingSel = '.psu-title, .psu-h2, .healing-title, .elements__title, .stay-title, ' +
                   '.psu-retreat-band h2, .psu-cta h2, .psu-journal-head h2, .psu-home-gallery__head h2';
  var wordIndex;

  function splitNode(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.nodeValue.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.className = 'psu-w';
          var i = document.createElement('i');
          i.textContent = part;
          i.style.setProperty('--i', wordIndex++);
          w.appendChild(i);
          frag.appendChild(w);
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'BR' && child.tagName !== 'SVG' && child.tagName !== 'svg') {
        splitNode(child);
      }
    });
  }

  $all(headingSel).forEach(function (h) {
    if (!once(h, 'split')) return;
    wordIndex = 0;
    var label = h.textContent.replace(/\s+/g, ' ').trim();
    h.setAttribute('aria-label', label); // screen reader ke liye poora text
    splitNode(h);
    $all('.psu-w', h).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
    if (h.closest('.psu-hero')) { h.style.setProperty('--base', '80ms'); }
    else { h.__psu_heading = true; h.setAttribute('data-psu-heading', ''); }
  });

  /* ------------------------------------------------------------------
     5. TAG ELEMENTS FOR SCROLL REVEAL
     ------------------------------------------------------------------ */
  var io;
  var groupMap = [];

  function tag(el, kind, delay) {
    if (!el || !once(el, 'tag')) return;
    if (el.closest('.psu-hero__inner')) return; // hero ka apna animation hai
    el.setAttribute('data-reveal', kind || 'up');
    if (delay) el.style.transitionDelay = delay + 'ms';
    el.__psu_delay = delay || 0;
    io.observe(el);
  }

  function tagImg(el) {
    if (!el || !once(el, 'img')) return;
    el.setAttribute('data-reveal-img', '');
    // image ko seedha observe nahi karte (clip-path ki wajah se kabhi kabhi
    // detect nahi hoti) — uska parent observe karte hain
    var holder = el.parentElement || el;
    (holder.__psu_imgs = holder.__psu_imgs || []).push(el);
    io.observe(holder);
    // agar image load na ho (galat naam / path), to usko chhupa kar mat rakho
    el.addEventListener('error', function () {
      el.removeAttribute('data-reveal-img');
      el.style.clipPath = 'none'; el.style.scale = '1';
    });
  }

  function tagGroup(container, kind, step) {
    if (!container || !once(container, 'group')) return;
    var kids = Array.prototype.slice.call(container.children).filter(function (k) {
      return !/^(SCRIPT|STYLE|DEFS|SYMBOL)$/i.test(k.tagName);
    });
    kids.forEach(function (k, i) {
      if (!once(k, 'tag')) return;
      k.setAttribute('data-reveal', kind || 'up');
      k.__psu_delay = i * (step || 100);
    });
    container.__psu_kids = kids;
    io.observe(container);
  }

  io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);

      if (el.__psu_imgs) {
        el.__psu_imgs.forEach(function (im) { im.classList.add('is-visible'); });
        if (!el.hasAttribute('data-reveal') && !el.__psu_kids) return;
      }
      if (el.__psu_kids) {
        el.__psu_kids.forEach(function (k) {
          k.style.transitionDelay = k.__psu_delay + 'ms';
          k.classList.add('is-visible');
          cleanup(k, k.__psu_delay + 1400);
        });
        return;
      }
      el.classList.add('is-visible');
      cleanup(el, (el.__psu_delay || 0) + 1900);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -2% 0px' });

  // reveal ke baad attribute hata dete hain taaki hover effects aur
  // original transitions bilkul pehle jaise kaam karein
  function cleanup(el, ms) {
    if (el.hasAttribute('data-reveal-img') || el.hasAttribute('data-draw') || el.__psu_heading) return;
    setTimeout(function () {
      el.removeAttribute('data-reveal');
      el.style.transitionDelay = '';
    }, ms);
  }

  /* ---- headings ---- */
  $all(headingSel).forEach(function (h) { if (h.__psu_heading) { once(h, 'tag'); io.observe(h); } });

  /* ---- single items: fade-up ---- */
  $all(
    '.psu-kicker, .psu-lead, .psu-large-copy, .about__label, .about__right > *, ' +
    '.healing-sub, .stay-eyebrow, .psu-stays__note, .psu-note, .psu-quote, ' +
    '.psu-body > *, .psu-heading > .psu-lead, .psu-text-link, ' +
    '.psu-cta .psu-container > *:not(h2), .psu-retreat-band__inner > div:first-child > *:not(h2), ' +
    '.psu-journal-head > *:not(h2), .psu-home-gallery__head > *:not(h2), ' +
    '.psu-policy > *, .psu-contact-row, .psu-map-shell, .psu-empty'
  ).forEach(function (el) { tag(el, 'up'); });

  /* ---- groups: children stagger ---- */
  $all('.psu-grid, .psu-stay-grid, .psu-signature-grid, .psu-journal-grid, .psu-journal, ' +
       '.stay-grid, .psu-retreat-options, .psu-pillars, .psu-feature-strip, .psu-timeline, ' +
       '.psu-faq, .psu-testimonial-home__grid, .psu-contact-list').forEach(function (g) {
    tagGroup(g, 'up', 110);
  });

  /* ---- elements list (Earth, Water ...) : slide from right ---- */
  $all('.elements__list').forEach(function (g) {
    if (g.__psu_kids) return;
    once(g, 'group');
    var kids = Array.prototype.slice.call(g.children);
    kids.forEach(function (k, i) { once(k, 'tag'); k.setAttribute('data-reveal', 'right'); k.__psu_delay = i * 130; });
    g.__psu_kids = kids; io.observe(g);
  });

  /* ---- gallery grids: zoom-in stagger ---- */
  $all('.psu-gallery-mosaic, .psu-real-gallery, .psu-gallery').forEach(function (g) {
    tagGroup(g, 'zoom', 90);
  });

  /* ---- footer columns ---- */
  $all('.psu-footer-grid').forEach(function (g) { tagGroup(g, 'up', 120); });
  $all('.psu-footer-bottom').forEach(function (el) { tag(el, 'up'); });

  /* ---- big images: curtain reveal ---- */
  $all('.about__image, .elements__media img, .psu-image img').forEach(tagImg);

  /* ---- line + svg draw ---- */
  $all('.stay-leaf, .healing-divider svg, .elements__lotus, .elements__lotus-sm').forEach(function (svg) {
    if (!once(svg, 'draw')) return;
    $all('path, circle, line', svg).forEach(function (n) { n.setAttribute('pathLength', '1'); });
    svg.setAttribute('data-draw', '');
    io.observe(svg);
  });
  $all('.about__bottom-line').forEach(function (el) {
    if (!once(el, 'tag')) return;
    el.setAttribute('data-reveal', 'up'); io.observe(el);
  });

  /* ------------------------------------------------------------------
     6. MAGNETIC BUTTONS (mouse ke paas aate hi halka sa kheenchte hain)
     ------------------------------------------------------------------ */
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $all('.psu-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
      });
      btn.addEventListener('mouseleave', function () { btn.style.translate = ''; });
    });
  }

})();





(function () {
  'use strict';

  var sec = document.querySelector('.psu-vm');
  if (!sec) return;

  // motion off wale users ko section normal dikhega
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // purane animation attributes hata do (conflict na ho)
  sec.querySelectorAll('[data-reveal], [data-reveal-img], [data-vm]').forEach(function (el) {
    el.removeAttribute('data-reveal');
    el.removeAttribute('data-reveal-img');
    el.removeAttribute('data-vm');
  });

  /* title ko words me todo (word-by-word reveal ke liye) */
  var title = sec.querySelector('.psu-vm__title');
  if (title && !title.querySelector('.vm-w')) {
    var idx = 0;
    title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'vm-w';
            s.setAttribute('aria-hidden', 'true');
            s.style.setProperty('--i', idx++);
            s.textContent = part;
            frag.appendChild(s);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          split(child);
        }
      });
    })(title);
  }

  document.documentElement.classList.add('psu-vm-js');

  /* scroll par har part apne time par animate hoga */
  var targets = Array.prototype.slice.call(
    sec.querySelectorAll('.psu-vm__head, .psu-vm__card, .psu-vm__foot')
  );
  var ticking = false;

  function check() {
    ticking = false;
    var vh = window.innerHeight;

    if (sec.getBoundingClientRect().top < vh * 0.95) sec.classList.add('psu-vm-in');

    targets = targets.filter(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.88) {
        el.classList.add('is-in');
        return false;
      }
      return true;
    });

    if (!targets.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(check); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  check();
  setTimeout(check, 200);
})();



(function () {
  'use strict';

  var sec = document.querySelector('.pt');
  if (!sec) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* title ko words me todo */
  var title = sec.querySelector('.pt__title');
  if (title && !title.querySelector('.pt-w')) {
    var idx = 0;
    title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'pt-w';
            s.setAttribute('aria-hidden', 'true');
            s.style.setProperty('--i', idx++);
            s.textContent = part;
            frag.appendChild(s);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          split(child);
        }
      });
    })(title);
  }

  document.documentElement.classList.add('pt-js');

  var targets = Array.prototype.slice.call(sec.querySelectorAll('.pt__head, .pt-card'));
  var ticking = false;

  function check() {
    ticking = false;
    var vh = window.innerHeight;

    if (sec.getBoundingClientRect().top < vh * 0.95) sec.classList.add('pt-in');

    targets = targets.filter(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.88) {
        el.classList.add('is-in');
        return false;
      }
      return true;
    });

    if (!targets.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(check); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  check();
  setTimeout(check, 200);
})();



(function () {
  var root = document.querySelector('.jw');
  if (!root) return;
  document.documentElement.classList.add('jw-js');
  var targets = root.querySelectorAll('.jw__head, .jw__grid, .jw__foot');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (t) { io.observe(t); });
})();



(function () {
  var el = document.querySelector('.wn');
  if (!el) return;
  document.documentElement.classList.add('wn-js');
  // path draw ke liye pathLength
  el.querySelectorAll('.wn__heart, .wn__pulse').forEach(function (p) { p.setAttribute('pathLength', '1'); });
  if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  io.observe(el);
})();


(() => {
  const section = document.querySelector('.formats'); if(!section) return;
  const cards = section.querySelectorAll('.card');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // heading reveal on load
  requestAnimationFrame(() => section.classList.add('is-ready'));

  // cards reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  cards.forEach((c) => io.observe(c));

  // soft parallax on photo (desktop only)
  if (reduce || !matchMedia('(hover: hover)').matches) return;
  cards.forEach((card) => {
    const img = card.querySelector('.card__photo img');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `scale(1.04) translate(${x * -10}px, ${y * -8}px)`;
    });
    card.addEventListener('mouseleave', () => { img.style.transform = ''; });
  });
})();



(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();


(function () {
  const section = document.getElementById("pure-soul"); if(!section) return;
  const rows = section.querySelectorAll(".row");

  // stagger index for each row
  rows.forEach((row, i) => row.style.setProperty("--i", i));

  // reveal header + rows once they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  rows.forEach((row) => io.observe(row));

  // soft light that follows the cursor inside each row
  rows.forEach((row) => {
    row.addEventListener("pointermove", (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty("--mx", e.clientX - r.left + "px");
      row.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // very subtle parallax on the botanical corners
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const decos = section.querySelectorAll(".deco");
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decos.forEach((d, i) => {
        const k = (i % 2 ? -1 : 1) * 6;
        d.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }
})();



/* =====================================================================
   PURE SOUL — GALLERY SECTION (JS) — self-contained: filters + lightbox
   ===================================================================== */
(function () {
  'use strict';
  if (window.__PSU_GX_BOUND__) return;
  window.__PSU_GX_BOUND__ = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function qs(s, c) { return (c || document).querySelector(s); }
  function qsa(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* ---------------- FILTER ---------------- */
  function applyFilter(cat) {
    var sec = qs('.psu-gx');
    if (!sec) return;
    var grid = qs('.psu-gx__grid', sec);
    var items = qsa('.psu-gx__item', sec);
    var countEl = qs('[data-gx-count]', sec);
    var n = 0;

    grid.setAttribute('data-mode', cat === 'all' ? 'all' : 'filtered');

    items.forEach(function (el) {
      var match = cat === 'all' || el.getAttribute('data-cat') === cat;
      if (match) { el.removeAttribute('hidden'); } else { el.setAttribute('hidden', ''); }
      el.classList.remove('gx-show');
      if (match) {
        el.classList.remove('gx-pre');
        el.classList.add('gx-in');
        el.style.setProperty('--gx-i', n);
        if (!reduce) {
          void el.offsetWidth;
          el.classList.add('gx-show');
        }
        n++;
      }
    });
    if (countEl) countEl.textContent = n;
  }

  function setActive(btn) {
    qsa('.psu-gx__filter').forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- LIGHTBOX ---------------- */
  var list = [], cur = 0, lastFocus = null, token = 0;

  function lb() { return qs('.psu-gx-lb'); }

  function visibleItems() {
    return qsa('.psu-gx__item').filter(function (el) { return !el.hasAttribute('hidden'); });
  }

  function srcOf(el) {
    var img = el.querySelector('img');
    return img.currentSrc || img.src;
  }

  function preload(i) {
    if (!list.length) return;
    var im = new Image();
    im.src = srcOf(list[(i + list.length) % list.length]);
  }

  function show(i) {
    var box = lb();
    if (!box || !list.length) return;
    var lbImg = qs('.psu-gx-lb__img', box);
    var lbCap = qs('[data-gx-caption]', box);
    var lbNum = qs('[data-gx-counter]', box);

    cur = (i + list.length) % list.length;
    var el = list[cur];
    var img = el.querySelector('img');
    var my = ++token;

    lbImg.classList.remove('is-ready');
    var loader = new Image();
    loader.onload = loader.onerror = function () {
      if (my !== token) return;
      lbImg.src = srcOf(el);
      lbImg.alt = img.alt || '';
      requestAnimationFrame(function () { lbImg.classList.add('is-ready'); });
    };
    loader.src = srcOf(el);

    var capText = el.querySelector('.psu-gx__cap b');
    lbCap.textContent = capText ? capText.textContent : (img.alt || '');
    lbNum.textContent = pad(cur + 1) + ' / ' + pad(list.length);
    preload(cur + 1);
    preload(cur - 1);
  }

  function openLb(el) {
    var box = lb();
    if (!box) return;
    list = visibleItems();
    var idx = list.indexOf(el);
    if (idx < 0) return;
    lastFocus = document.activeElement;
    box.removeAttribute('hidden');
    box.setAttribute('aria-hidden', 'false');
    void box.offsetWidth;
    box.classList.add('is-open');
    document.body.classList.add('psu-gx-lock');
    show(idx);
    setTimeout(function () {
      var c = qs('.psu-gx-lb__close', box);
      if (c) c.focus();
    }, 60);
  }

  function closeLb() {
    var box = lb();
    if (!box) return;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('psu-gx-lock');
    token++;
    setTimeout(function () {
      if (!box.classList.contains('is-open')) {
        box.setAttribute('hidden', '');
        var im = qs('.psu-gx-lb__img', box);
        if (im) im.removeAttribute('src');
      }
    }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------- EVENTS (delegation) ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var f = t.closest('.psu-gx__filter');
    if (f) {
      e.preventDefault();
      setActive(f);
      applyFilter(f.getAttribute('data-filter') || 'all');
      return;
    }

    var box = t.closest('.psu-gx-lb');
    if (box) {
      if (t.closest('[data-gx-close]')) { closeLb(); return; }
      if (t.closest('[data-gx-next]')) { show(cur + 1); return; }
      if (t.closest('[data-gx-prev]')) { show(cur - 1); }
      return;
    }

    var it = t.closest('.psu-gx__item');
    if (it) { openLb(it); }
  });

  document.addEventListener('keydown', function (e) {
    var box = lb();
    if (!box || !box.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeLb(); }
    else if (e.key === 'ArrowRight') { show(cur + 1); }
    else if (e.key === 'ArrowLeft') { show(cur - 1); }
    else if (e.key === 'Tab') {
      var f = qsa('button', box);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var sx = 0, sy = 0, tracking = false;
  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest || !e.target.closest('.psu-gx-lb') || e.target.closest('button')) return;
    tracking = true; sx = e.clientX; sy = e.clientY;
  });
  document.addEventListener('pointerup', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { show(dx < 0 ? cur + 1 : cur - 1); }
  });
  document.addEventListener('pointercancel', function () { tracking = false; });

  /* ---------------- SCROLL REVEAL (try/catch me — fail ho to bhi filters chalenge) ---------------- */
  function initReveal() {
    try {
      var items = qsa('.psu-gx__item');
      if (reduce || !items.length || !('IntersectionObserver' in window)) return;
      document.documentElement.classList.add('psu-gx-js');
      items.forEach(function (el, i) {
        el.style.setProperty('--gx-i', i % 4);
        el.classList.add('gx-pre');
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.remove('gx-pre');
          en.target.classList.add('gx-in');
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
      items.forEach(function (el) { io.observe(el); });
      setTimeout(function () {
        items.forEach(function (el) { el.classList.remove('gx-pre'); el.classList.add('gx-in'); });
      }, 3500);
    } catch (err) { /* ignore */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();







(function () {
  'use strict';
  if (window.__PSU_CT_BOUND__) return;
  window.__PSU_CT_BOUND__ = true;

  var WA_NUMBER = '918800316274'; // WhatsApp number (country code ke saath)

  // aaj se pehle ki date na chuni ja sake
  var dateInput = document.getElementById('psu-ct-date');
  if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

  function fieldOf(el) { return el.closest('.psu-ct__field'); }

  function clearError(el) {
    var f = fieldOf(el);
    if (f) f.classList.remove('is-error');
  }

  document.addEventListener('input', function (e) {
    if (e.target.closest && e.target.closest('[data-psu-ct-form]')) clearError(e.target);
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches || !form.matches('[data-psu-ct-form]')) return;
    e.preventDefault();

    var status = form.querySelector('[data-psu-ct-status]');
    var name = form.elements['name'].value.trim();
    var phone = form.elements['phone'].value.trim();
    var ok = true;

    if (!name) { fieldOf(form.elements['name']).classList.add('is-error'); ok = false; }
    if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) { fieldOf(form.elements['phone']).classList.add('is-error'); ok = false; }

    if (!ok) {
      if (status) status.textContent = 'Please enter your name and a valid phone number.';
      var firstErr = form.querySelector('.is-error input');
      if (firstErr) firstErr.focus();
      return;
    }

    var d = form.elements;
    var lines = [
      'Namaste Pure Soul Universe,',
      'Name: ' + name,
      'Phone: ' + phone,
      d['interest'].value ? 'Interested in: ' + d['interest'].value : '',
      d['date'].value ? 'Preferred date: ' + d['date'].value : '',
      d['guests'].value ? 'Guests: ' + d['guests'].value : '',
      d['message'].value.trim() ? 'Message: ' + d['message'].value.trim() : '',
      'Please share availability and next steps.'
    ].filter(Boolean);

    if (status) status.textContent = 'Opening WhatsApp with your enquiry…';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
})();







(function () {
  'use strict';
  function init() {
    var root = document.getElementById('ayurveda');
    if (!root || root.getAttribute('data-ay-ready')) return;
    root.setAttribute('data-ay-ready', '1');

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cards = Array.prototype.slice.call(root.querySelectorAll('.ay-card'));
    var chips = Array.prototype.slice.call(root.querySelectorAll('.ay__chip'));

    function applyFilter(cat) {
      var n = 0;
      cards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-cat') === cat;
        if (show) {
          card.hidden = false;
          card.style.display = '';
          card.style.setProperty('--d', n % 6);
          card.classList.remove('is-in');
          void card.offsetWidth;
          card.classList.add('is-in');
          n++;
        } else {
          card.hidden = true;
          card.style.display = 'none';
        }
      });
    }

    root.addEventListener('click', function (e) {
      var chip = e.target.closest ? e.target.closest('.ay__chip') : null;
      if (!chip || !root.contains(chip)) return;
      e.preventDefault();
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      applyFilter(chip.getAttribute('data-filter') || 'all');
    });

    if (reduce || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('ay-js');
    cards.forEach(function (card, i) { card.style.setProperty('--d', i % 3); });

    var targets = root.querySelectorAll('.ay__head, .ay__filters, .ay-card, .ay__foot');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    targets.forEach(function (t) { io.observe(t); });

    setTimeout(function () {
      targets.forEach(function (t) { t.classList.add('is-in'); });
    }, 3500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();




/* ===== WhatsApp floating icon (auto, har page par) ===== */
(function () {
  'use strict';

  var NUMBER = '918800316274';
  var MSG = 'Namaste Pure Soul Universe, I would like to know more.';

  var CSS =
    '.psu-wa{position:fixed;right:1.2rem;bottom:1.2rem;z-index:2147483000;width:60px;height:60px;border-radius:50%;background:#25D366;display:grid;place-items:center;box-shadow:0 10px 28px rgba(0,0,0,.25);animation:psuWaPulse 2.4s ease-out infinite;transition:transform .3s ease;text-decoration:none}' +
    '.psu-wa svg{width:34px;height:34px;display:block}' +
    '.psu-wa:hover{transform:scale(1.1)}' +
    '.psu-wa:focus-visible{outline:3px solid #fff;outline-offset:3px}' +
    '@keyframes psuWaPulse{0%{box-shadow:0 0 0 0 rgba(37,211,102,.55),0 10px 28px rgba(0,0,0,.25)}70%{box-shadow:0 0 0 18px rgba(37,211,102,0),0 10px 28px rgba(0,0,0,.25)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0),0 10px 28px rgba(0,0,0,.25)}}' +
    '@media (max-width:560px){.psu-wa{width:54px;height:54px;right:.9rem;bottom:.9rem}.psu-wa svg{width:30px;height:30px}}' +
    '@media (prefers-reduced-motion:reduce){.psu-wa{animation:none}}';

  var ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  function addWhatsApp() {
    if (document.querySelector('.psu-wa')) return;

    // CSS inject (style.css par depend nahi)
    if (!document.getElementById('psu-wa-style')) {
      var st = document.createElement('style');
      st.id = 'psu-wa-style';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    // purane WhatsApp buttons hata do
    document.querySelectorAll('.psu-floating-actions, .psu-whatsapp, .psu-ct__fab').forEach(function (el) {
      el.remove();
    });

    var a = document.createElement('a');
    a.className = 'psu-wa';
    a.href = 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(MSG);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat with Pure Soul Universe on WhatsApp');
    a.innerHTML = ICON;
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWhatsApp);
  } else {
    addWhatsApp();
  }
})();





/* ===== Har page par header + footer mein logo laga do ===== */
document.addEventListener('DOMContentLoaded', function () {
  var logoHTML =
    '<img class="psu-brand__logo" src="assets/images/Psu_logo.jpeg" alt="Pure Soul Universe">';

  document.querySelectorAll('.psu-brand').forEach(function (brand) {
    // agar logo pehle se laga hai to dobara mat lagao
    if (brand.querySelector('.psu-brand__logo')) return;
    brand.innerHTML = logoHTML;
  });
});



/* Navbar scroll par gehra grey */
(function () {
  var header = document.querySelector('.psu-global-header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();