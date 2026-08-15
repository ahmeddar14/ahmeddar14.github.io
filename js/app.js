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

  /* -------- Raccourcis DOM -------- */
  var $ = function (s) { return document.querySelector(s); };
  var screens = {
    home:    $('#screen-home'),
    grid:    $('#screen-grid'),
    letter:  $('#screen-letter'),
    fgrid:   $('#screen-fgrid'),
    fletter: $('#screen-fletter')
  };
  var letterBg  = $('#letter-bg');
  var fletterBg = $('#fletter-bg');
  var glyphWrap = $('#glyph-wrap');
  var glyphText = $('#glyph-text');
  var toastEl   = $('#toast');
  var tiles = {
    alphabet: $('#tiles-grid'),
    fatha:    $('#tiles-fgrid')
  };

  /* Écran de détail associé à chaque parcours */
  var LETTER_SCREEN = { alphabet: 'letter', fatha: 'fletter' };

  var current   = { alphabet: 0, fatha: 0 };
  var playingAll = false;

  /* ======================= Navigation ======================= */
  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle('is-active', k === name);
    });
    stopSpeech();
    stopClip();
    if (name !== 'grid') stopPlayAll();
  }

  function openLetter(set, i) {
    var n = LETTERS.length;
    current[set] = ((i % n) + n) % n;
    var L = LETTERS[current[set]];

    if (set === 'fatha') {
      fletterBg.src = 'assets/fatha/' + L.slug + '.jpg';
      fletterBg.alt = 'الحرف ' + L.fat + ' — ' + L.word;
    } else if (L.img) {
      letterBg.src = 'assets/alphabet/' + L.img + '.jpg';
      letterBg.alt = 'حرف ' + L.name;
      glyphWrap.hidden = true;
    } else {
      var p = PLATES[L.plate];
      letterBg.src = 'assets/alphabet/plate-' + L.plate + '.jpg';
      letterBg.alt = 'حرف ' + L.name;
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

    show(LETTER_SCREEN[set]);
    sayCurrent(set);
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
      b.addEventListener('click', function () {
        stopPlayAll();
        openLetter(set, i);
      });
      frag.appendChild(b);
    });
    tiles[set].appendChild(frag);
  }

  /* ======================= Son : fichiers MP3 ======================= */
  var clip = new Audio();
  clip.preload = 'none';

  function playClip(slug) {
    stopSpeech();
    clip.src = 'assets/fatha/audio/' + slug + '.mp3';
    var p = clip.play();
    if (p && p.catch) p.catch(function () { /* lecture refusée : on ignore */ });
  }

  function stopClip() {
    if (!clip.paused) clip.pause();
    clip.currentTime = 0;
  }

  /* ======================= Son : voix de synthèse ======================= */
  var voices = [];
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  loadVoices();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  var warned = false;
  function speak(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      if (!warned) { toast('المتصفح لا يدعم النطق الصوتي'); warned = true; }
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.8;
    u.pitch = 1.15;
    var v = voices.filter(function (x) { return /^ar/i.test(x.lang); })[0];
    if (v) {
      u.voice = v;
    } else if (!warned) {
      toast('لا توجد أصوات عربية على هذا الجهاز — أضفها من إعدادات النظام');
      warned = true;
    }
    if (onEnd) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    window.speechSynthesis.speak(u);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  /* Prononce la lettre courante du parcours demandé */
  function sayCurrent(set) {
    var L = LETTERS[current[set]];
    if (set === 'fatha') playClip(L.slug);
    else speak(L.name);
  }

  /* -------- Lecture de tout l'alphabet -------- */
  function playAll() {
    if (playingAll) { stopPlayAll(); return; }
    playingAll = true;
    var box = tiles.alphabet;
    var i = 0;
    (function next() {
      if (!playingAll || i >= LETTERS.length) { stopPlayAll(); return; }
      Array.prototype.forEach.call(box.children, function (el) {
        el.classList.remove('is-speaking');
      });
      box.children[i].classList.add('is-speaking');
      var idx = i++;
      speak(LETTERS[idx].name, function () {
        setTimeout(next, 220);
      });
    })();
  }

  function stopPlayAll() {
    playingAll = false;
    stopSpeech();
    Array.prototype.forEach.call(tiles.alphabet.children, function (el) {
      el.classList.remove('is-speaking');
    });
  }

  /* ======================= Toast ======================= */
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3200);
  }

  /* ======================= Écouteurs ======================= */
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) { show(go.dataset.go); return; }

    var step = e.target.closest('[data-step]');
    if (step) {
      var set = step.dataset.set;
      openLetter(set, current[set] + Number(step.dataset.step));
    }
  });

  $('#btn-say').addEventListener('click',      function () { sayCurrent('alphabet'); });
  $('#btn-say-big').addEventListener('click',  function () { sayCurrent('alphabet'); });
  $('#btn-fsay').addEventListener('click',     function () { sayCurrent('fatha'); });
  $('#btn-fsay-big').addEventListener('click', function () { sayCurrent('fatha'); });
  $('#btn-playall').addEventListener('click', playAll);

  /* -------- Clavier -------- */
  document.addEventListener('keydown', function (e) {
    var set = screens.letter.classList.contains('is-active')  ? 'alphabet'
            : screens.fletter.classList.contains('is-active') ? 'fatha'
            : null;
    if (!set) return;
    if (e.key === 'ArrowLeft')  openLetter(set, current[set] - 1);
    if (e.key === 'ArrowRight') openLetter(set, current[set] + 1);
    if (e.key === 'Escape')     show(set === 'fatha' ? 'fgrid' : 'grid');
    if (e.key === ' ') { e.preventDefault(); sayCurrent(set); }
  });

  /* -------- Balayage tactile sur les écrans d'une lettre -------- */
  ['alphabet', 'fatha'].forEach(function (set) {
    var el = screens[LETTER_SCREEN[set]];
    var x0 = null;
    el.addEventListener('touchstart', function (e) {
      x0 = e.changedTouches[0].clientX;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 60) openLetter(set, current[set] + (dx < 0 ? -1 : 1));
      x0 = null;
    }, { passive: true });
  });

  /* -------- Préchargement des visuels -------- */
  function preload() {
    var srcs = ['assets/alphabet/home.jpg', 'assets/alphabet/grid.jpg', 'assets/fatha/grid.jpg'];
    LETTERS.forEach(function (L) {
      srcs.push(L.img ? 'assets/alphabet/' + L.img + '.jpg'
                      : 'assets/alphabet/plate-' + L.plate + '.jpg');
      srcs.push('assets/fatha/' + L.slug + '.jpg');
    });
    srcs.forEach(function (s) { (new Image()).src = s; });
  }

  buildGrid('alphabet');
  buildGrid('fatha');
  setTimeout(preload, 600);
})();
