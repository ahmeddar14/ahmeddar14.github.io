/* ===========================================================
   متعة التعلم — logique de l'application

   Deux parcours :
     • « alphabet » : les 28 lettres nues (voix de synthèse)
     • « fatha »    : les 28 lettres avec la fatha (fichiers MP3)
   =========================================================== */
(function () {
  'use strict';

  /* -------- Géométrie des plaques (cercle central) -------- */
  var K = 1076 / 717;                      // ratio de la scène
  var PLATES = {
    red:    { cx: 0.4991, cy: 0.5091, r: 0.2017, color: '#fd3735' },
    green:  { cx: 0.4991, cy: 0.5112, r: 0.2014, color: '#24b13d' },
    purple: { cx: 0.4991, cy: 0.5077, r: 0.2012, color: '#9746d7' },
    blue:   { cx: 0.5000, cy: 0.5042, r: 0.1991, color: '#0272f3' },
    orange: { cx: 0.5005, cy: 0.4923, r: 0.2140, color: '#fd8201' }
  };

  /* -------- Les 28 lettres --------
     slug  : identifiant latin, sert aux noms de fichiers
     img   : visuel d'origine extrait du PDF
     plate : plaque vierge + lettre dessinée (visuel non fourni)
     word  : mot illustré sur la fiche « avec fatha »            */
  var LETTERS = [
    { slug: 'alef',  ar: 'أ', name: 'أَلِف', fat: 'أَ', word: 'أَرْنَب',   img: 'alef' },
    { slug: 'ba',    ar: 'ب', name: 'بَاء',  fat: 'بَ', word: 'بَقَرَة',   img: 'ba'   },
    { slug: 'ta',    ar: 'ت', name: 'تَاء',  fat: 'تَ', word: 'تَاج',     img: 'ta'   },
    { slug: 'tha',   ar: 'ث', name: 'ثَاء',  fat: 'ثَ', word: 'ثَوْر',     img: 'tha'  },
    { slug: 'jim',   ar: 'ج', name: 'جِيم',  fat: 'جَ', word: 'جَبَل',     img: 'jim'  },
    { slug: 'ha',    ar: 'ح', name: 'حَاء',  fat: 'حَ', word: 'حَاسُوب',   img: 'ha'   },
    { slug: 'kha',   ar: 'خ', name: 'خَاء',  fat: 'خَ', word: 'خَروف',    img: 'kha'  },
    { slug: 'dal',   ar: 'د', name: 'دَال',  fat: 'دَ', word: 'دَرَّاجَة',   img: 'dal'  },
    { slug: 'dhal',  ar: 'ذ', name: 'ذَال',  fat: 'ذَ', word: 'ذَهَب',     img: 'dhal' },
    { slug: 'ra',    ar: 'ر', name: 'رَاء',  fat: 'رَ', word: 'رَأْس',     img: 'ra'   },
    { slug: 'zay',   ar: 'ز', name: 'زَاي',  fat: 'زَ', word: 'زَرَافَة',   img: 'zay'  },
    { slug: 'sin',   ar: 'س', name: 'سِين',  fat: 'سَ', word: 'سَاعَة',    img: 'sin'  },
    { slug: 'shin',  ar: 'ش', name: 'شِين',  fat: 'شَ', word: 'شَجَرَة',   img: 'shin' },
    { slug: 'sad',   ar: 'ص', name: 'صَاد',  fat: 'صَ', word: 'صَحْن',     plate: 'blue'   },
    { slug: 'dad',   ar: 'ض', name: 'ضَاد',  fat: 'ضَ', word: 'ضَابِط',    plate: 'green'  },
    { slug: 'tah',   ar: 'ط', name: 'طَاء',  fat: 'طَ', word: 'طَائِرَة',   plate: 'red'    },
    { slug: 'zah',   ar: 'ظ', name: 'ظَاء',  fat: 'ظَ', word: 'ظَرْف',     plate: 'blue'   },
    { slug: 'ain',   ar: 'ع', name: 'عَين',  fat: 'عَ', word: 'عَظْم',     plate: 'orange' },
    { slug: 'ghain', ar: 'غ', name: 'غَين',  fat: 'غَ', word: 'غَزَال',    plate: 'purple' },
    { slug: 'fa',    ar: 'ف', name: 'فَاء',  fat: 'فَ', word: 'فَأر',      plate: 'green'  },
    { slug: 'qaf',   ar: 'ق', name: 'قَاف',  fat: 'قَ', word: 'قَلَم',     plate: 'orange' },
    { slug: 'kaf',   ar: 'ك', name: 'كَاف',  fat: 'كَ', word: 'كَلْب',     plate: 'purple' },
    { slug: 'lam',   ar: 'ل', name: 'لَام',  fat: 'لَ', word: 'لَيْمُون',   plate: 'green'  },
    { slug: 'mim',   ar: 'م', name: 'مِيم',  fat: 'مَ', word: 'مَدْرَسَة',  plate: 'red'    },
    { slug: 'nun',   ar: 'ن', name: 'نُون',  fat: 'نَ', word: 'نَمِر',     plate: 'blue'   },
    { slug: 'hae',   ar: 'ه', name: 'هَاء',  fat: 'هَ', word: 'هَاتِف',    plate: 'orange' },
    { slug: 'waw',   ar: 'و', name: 'وَاو',  fat: 'وَ', word: 'وَرْدَة',    plate: 'purple' },
    { slug: 'ya',    ar: 'ي', name: 'يَاء',  fat: 'يَ', word: 'يَد',       plate: 'blue'   }
  ];

  /* -------- Position des tuiles sur chaque grille (en % de la scène) --------
     Les colonnes sont listées de la droite vers la gauche : la colonne 0
     porte la 1ʳᵉ lettre, comme sur le visuel.                              */
  var GRIDS = {
    alphabet: {
      cols: [79.28, 71.47, 63.75, 55.85, 47.77, 39.78, 31.69],
      rows: [26.10, 38.44, 50.64, 63.12],
      w: 7.81,
      h: [12.20, 12.20, 12.20, 12.20]
    },
    fatha: {
      cols: [82.34, 69.65, 57.00, 44.34, 31.68, 18.87, 6.17],
      rows: [20.71, 39.89, 57.92, 75.15],
      w: 11.05,
      h: [16.44, 15.35, 14.62, 14.37]
    }
  };

  /* -------- Correspondances parcours ↔ écrans -------- */
  var SETS        = ['alphabet', 'fatha'];
  var GRID_OF     = { alphabet: 'grid',   fatha: 'fgrid'   };
  var LETTER_OF   = { alphabet: 'letter', fatha: 'fletter' };
  var SET_OF      = { letter: 'alphabet', fletter: 'fatha' };

  /* -------- Raccourcis DOM -------- */
  var $ = function (s) { return document.querySelector(s); };
  var stage     = $('#stage');
  var menu      = $('#menu');
  var toastEl   = $('#toast');
  var glyphWrap = $('#glyph-wrap');
  var glyphText = $('#glyph-text');
  var screens = {
    home:    $('#screen-home'),
    grid:    $('#screen-grid'),
    letter:  $('#screen-letter'),
    fgrid:   $('#screen-fgrid'),
    fletter: $('#screen-fletter')
  };
  var bg      = { alphabet: $('#letter-bg'),        fatha: $('#fletter-bg') };
  var sayBtn  = { alphabet: $('#btn-say'),          fatha: $('#btn-fsay') };
  var counter = { alphabet: $('#counter-alphabet'), fatha: $('#counter-fatha') };
  var tiles   = { alphabet: $('#tiles-grid'),       fatha: $('#tiles-fgrid') };

  var current = { alphabet: 0, fatha: 0 };
  var currentScreen = 'home';

  /* ======================= Mise à l'échelle ======================= */
  /* --s sert d'unité de référence aux surcouches (menu, compteur…) */
  function sizeStage() {
    stage.style.setProperty('--s', stage.clientWidth + 'px');
  }
  window.addEventListener('resize', sizeStage);
  window.addEventListener('orientationchange', function () {
    setTimeout(sizeStage, 250);
  });
  sizeStage();

  /* ======================= Chiffres arabes ======================= */
  var AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  function arNum(n) {
    return String(n).replace(/\d/g, function (d) { return AR_DIGITS[+d]; });
  }

  /* ======================= Routage (adresse + bouton Retour) =======================
     L'adresse reflète l'écran affiché : #alphabet, #fatha/3 …
     Le bouton « retour » du navigateur recule donc d'un écran au lieu
     de quitter le site, et un rafraîchissement rouvre la même page.   */
  function hashOf(state) {
    if (state.screen === 'home') return '#';
    if (state.screen === 'grid')  return '#alphabet';
    if (state.screen === 'fgrid') return '#fatha';
    return '#' + SET_OF[state.screen] + '/' + (state.i + 1);
  }

  function parseHash(h) {
    var parts = String(h || '').replace(/^#/, '').split('/');
    var set = SETS.indexOf(parts[0]) >= 0 ? parts[0] : null;
    if (!set) return { screen: 'home' };
    if (parts.length > 1) {
      var i = parseInt(parts[1], 10) - 1;
      if (i >= 0 && i < LETTERS.length) return { screen: LETTER_OF[set], i: i };
    }
    return { screen: GRID_OF[set] };
  }

  function navigate(state) {
    render(state);
    history.pushState(state, '', hashOf(state));
  }

  window.addEventListener('popstate', function (e) {
    render(e.state || parseHash(location.hash), true);
  });

  /* ======================= Affichage d'un écran ======================= */
  function render(state, silent) {
    var set = SET_OF[state.screen];
    if (set) renderLetter(set, state.i || 0);

    currentScreen = state.screen;
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle('is-active', k === state.screen);
    });
    closeMenu();
    stopAll();

    if (set && !silent) say(set, current[set]);
  }

  function renderLetter(set, i) {
    var n = LETTERS.length;
    current[set] = ((i % n) + n) % n;
    var L = LETTERS[current[set]];

    if (set === 'fatha') {
      bg.fatha.src = 'assets/fatha/' + L.slug + '.jpg';
      bg.fatha.alt = 'الحرف ' + L.fat + ' — ' + L.word;
    } else if (L.img) {
      bg.alphabet.src = 'assets/alphabet/' + L.img + '.jpg';
      bg.alphabet.alt = 'حرف ' + L.name;
      glyphWrap.hidden = true;
    } else {
      var p = PLATES[L.plate];
      bg.alphabet.src = 'assets/alphabet/plate-' + L.plate + '.jpg';
      bg.alphabet.alt = 'حرف ' + L.name;
      glyphWrap.style.setProperty('--gx', ((p.cx - p.r) * 100).toFixed(2) + '%');
      glyphWrap.style.setProperty('--gw', (p.r * 200).toFixed(2) + '%');
      glyphWrap.style.setProperty('--gy', ((p.cy - p.r * K) * 100).toFixed(2) + '%');
      glyphWrap.style.setProperty('--gh', (p.r * K * 200).toFixed(2) + '%');
      glyphText.setAttribute('fill', p.color);
      glyphText.textContent = L.ar;
      glyphWrap.hidden = false;
      // relance l'animation d'apparition
      glyphWrap.style.animation = 'none';
      void glyphWrap.offsetWidth;
      glyphWrap.style.animation = '';
    }

    counter[set].textContent = arNum(current[set] + 1) + ' من ' + arNum(LETTERS.length);
  }

  function openLetter(set, i) {
    var n = LETTERS.length;
    navigate({ screen: LETTER_OF[set], i: ((i % n) + n) % n });
  }

  /* ======================= Grilles ======================= */
  function buildGrid(set) {
    var g = GRIDS[set];
    var frag = document.createDocumentFragment();
    LETTERS.forEach(function (L, i) {
      var col = i % 7, row = Math.floor(i / 7);
      var b = document.createElement('button');
      b.className = 'tile';
      b.type = 'button';
      b.setAttribute('aria-label', set === 'fatha' ? 'الحرف ' + L.fat : 'حرف ' + L.name);
      b.style.left   = g.cols[col] + '%';
      b.style.top    = g.rows[row] + '%';
      b.style.width  = g.w + '%';
      b.style.height = g.h[row] + '%';
      b.addEventListener('click', function () { openLetter(set, i); });
      frag.appendChild(b);
    });
    tiles[set].appendChild(frag);
  }

  /* ======================= Son =======================
     Les deux parcours utilisent les mêmes enregistrements : une vraie
     voix, identique partout, qui marche hors connexion et sur tous les
     appareils. La synthèse vocale du navigateur a été abandonnée —
     elle restait muette sur la plupart des téléphones, faute de voix
     arabe installée.                                                  */
  var clip = new Audio();
  clip.preload = 'none';
  var playingSet = null;

  function say(set, i, onEnd) {
    var slug = LETTERS[i].slug;
    stopSound();
    playingSet = set;
    clip.src = 'assets/fatha/audio/' + slug + '.mp3';
    var done = function () {
      markPlaying(set, false);
      if (onEnd) { var f = onEnd; onEnd = null; f(); }
    };
    clip.onended = done;
    clip.onerror = done;
    markPlaying(set, true);
    var p = clip.play();
    if (p && p.catch) p.catch(done);
  }

  function stopSound() {
    clip.onended = null;
    clip.onerror = null;
    if (!clip.paused) clip.pause();
    SETS.forEach(function (s) { markPlaying(s, false); });
    playingSet = null;
  }

  /* Petite pulsation sur le haut-parleur pendant la lecture */
  function markPlaying(set, on) {
    if (sayBtn[set]) sayBtn[set].classList.toggle('is-playing', !!on);
  }

  /* -------- Lecture enchaînée des 28 lettres -------- */
  var running = null;   // parcours en cours de lecture, ou null

  function playAll(set) {
    if (running) {
      var same = running === set;
      stopAll();
      if (same) return;
    }
    running = set;
    updatePlayBtn();
    var i = 0;
    (function next() {
      if (running !== set || i >= LETTERS.length) { stopAll(); return; }
      highlight(set, i);
      var idx = i++;
      say(set, idx, function () {
        if (running === set) setTimeout(next, 260);
      });
    })();
  }

  function highlight(set, i) {
    Array.prototype.forEach.call(tiles[set].children, function (el, k) {
      el.classList.toggle('is-speaking', k === i);
    });
  }

  function stopAll() {
    running = null;
    updatePlayBtn();
    stopSound();
    SETS.forEach(function (s) {
      Array.prototype.forEach.call(tiles[s].children, function (el) {
        el.classList.remove('is-speaking');
      });
    });
  }

  function updatePlayBtn() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-playall]'), function (b) {
      b.classList.toggle('is-playing', running === b.dataset.playall);
    });
  }

  /* ======================= Menu du contenu ======================= */
  function openMenu() {
    stopAll();
    menu.hidden = false;
    var first = menu.querySelector('.menu-item');
    if (first) first.focus();
  }
  function closeMenu() { menu.hidden = true; }

  menu.addEventListener('click', function (e) {
    if (e.target === menu) closeMenu();
  });

  /* ======================= Toast ======================= */
  var toastTimer;
  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, ms || 3200);
  }

  /* ======================= Écouteurs ======================= */
  document.addEventListener('click', function (e) {
    var el;

    if ((el = e.target.closest('[data-menu-close]'))) { closeMenu(); return; }
    if ((el = e.target.closest('[data-menu]')))       { openMenu(); return; }
    if ((el = e.target.closest('[data-go]')))         { navigate({ screen: el.dataset.go }); return; }
    if ((el = e.target.closest('[data-playall]')))    { playAll(el.dataset.playall); return; }
    if ((el = e.target.closest('[data-say]')))        { stopAll(); say(el.dataset.say, current[el.dataset.say]); return; }
    if ((el = e.target.closest('[data-step]')))       {
      var set = el.dataset.set;
      openLetter(set, current[set] + Number(el.dataset.step));
      return;
    }
    if ((el = e.target.closest('[data-soon]')))       { toast('هذه الميزة قادمة قريبًا إن شاء الله 🌟'); return; }
  });

  /* -------- Clavier -------- */
  document.addEventListener('keydown', function (e) {
    if (!menu.hidden) {
      if (e.key === 'Escape') closeMenu();
      return;
    }
    var set = SET_OF[currentScreen];
    if (!set) {
      if (e.key === 'Escape' && currentScreen !== 'home') navigate({ screen: 'home' });
      return;
    }
    if (e.key === 'ArrowLeft')  openLetter(set, current[set] - 1);
    if (e.key === 'ArrowRight') openLetter(set, current[set] + 1);
    if (e.key === 'Escape')     navigate({ screen: GRID_OF[set] });
    if (e.key === ' ')          { e.preventDefault(); stopAll(); say(set, current[set]); }
  });

  /* -------- Balayage tactile sur les fiches -------- */
  SETS.forEach(function (set) {
    var el = screens[LETTER_OF[set]];
    var x0 = null, y0 = null;
    el.addEventListener('touchstart', function (e) {
      x0 = e.changedTouches[0].clientX;
      y0 = e.changedTouches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      // en portrait la scène est pivotée : le balayage utile est vertical
      var rotated = window.matchMedia('(orientation: portrait) and (pointer: coarse)').matches;
      var d = rotated ? dy : dx;
      if (Math.abs(d) > 60 && Math.abs(d) > Math.abs(rotated ? dx : dy)) {
        openLetter(set, current[set] + (d < 0 ? -1 : 1));
      }
      x0 = y0 = null;
    }, { passive: true });
  });

  /* -------- Préchargement des visuels et des sons -------- */
  function preload() {
    var srcs = ['assets/alphabet/home.jpg', 'assets/alphabet/grid.jpg', 'assets/fatha/grid.jpg'];
    LETTERS.forEach(function (L) {
      srcs.push(L.img ? 'assets/alphabet/' + L.img + '.jpg'
                      : 'assets/alphabet/plate-' + L.plate + '.jpg');
      srcs.push('assets/fatha/' + L.slug + '.jpg');
    });
    srcs.forEach(function (s) { (new Image()).src = s; });

    // les 28 sons pèsent moins de 1 Mo : on les met en cache pour que la
    // lecture enchaînée ne marque pas de temps d'arrêt entre les lettres
    if (window.fetch) {
      LETTERS.forEach(function (L) {
        fetch('assets/fatha/audio/' + L.slug + '.mp3').catch(function () {});
      });
    }
  }

  /* ======================= Démarrage ======================= */
  buildGrid('alphabet');
  buildGrid('fatha');

  var start = parseHash(location.hash);
  render(start, true);
  history.replaceState(start, '', hashOf(start));

  if (window.matchMedia('(orientation: portrait) and (pointer: coarse)').matches) {
    toast('أدِر جهازك أفقيًا لعرض أوضح 📱', 4200);
  }

  setTimeout(preload, 600);
})();
