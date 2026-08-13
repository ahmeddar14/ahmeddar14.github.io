/* ===========================================================
   متعة التعلم — logique de l'application
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
     img   : visuel d'origine extrait du PDF
     plate : plaque vierge + lettre dessinée (visuel non fourni)      */
  var LETTERS = [
    { ar: 'أ', name: 'أَلِف', img: 'alef' },
    { ar: 'ب', name: 'بَاء',  img: 'ba'   },
    { ar: 'ت', name: 'تَاء',  img: 'ta'   },
    { ar: 'ث', name: 'ثَاء',  img: 'tha'  },
    { ar: 'ج', name: 'جِيم',  img: 'jim'  },
    { ar: 'ح', name: 'حَاء',  img: 'ha'   },
    { ar: 'خ', name: 'خَاء',  img: 'kha'  },
    { ar: 'د', name: 'دَال',  img: 'dal'  },
    { ar: 'ذ', name: 'ذَال',  img: 'dhal' },
    { ar: 'ر', name: 'رَاء',  img: 'ra'   },
    { ar: 'ز', name: 'زَاي',  img: 'zay'  },
    { ar: 'س', name: 'سِين',  img: 'sin'  },
    { ar: 'ش', name: 'شِين',  img: 'shin' },
    { ar: 'ص', name: 'صَاد',  plate: 'blue'   },
    { ar: 'ض', name: 'ضَاد',  plate: 'green'  },
    { ar: 'ط', name: 'طَاء',  plate: 'red'    },
    { ar: 'ظ', name: 'ظَاء',  plate: 'blue'   },
    { ar: 'ع', name: 'عَين',  plate: 'orange' },
    { ar: 'غ', name: 'غَين',  plate: 'purple' },
    { ar: 'ف', name: 'فَاء',  plate: 'green'  },
    { ar: 'ق', name: 'قَاف',  plate: 'orange' },
    { ar: 'ك', name: 'كَاف',  plate: 'purple' },
    { ar: 'ل', name: 'لَام',  plate: 'green'  },
    { ar: 'م', name: 'مِيم',  plate: 'red'    },
    { ar: 'ن', name: 'نُون',  plate: 'blue'   },
    { ar: 'ه', name: 'هَاء',  plate: 'orange' },
    { ar: 'و', name: 'وَاو',  plate: 'purple' },
    { ar: 'ي', name: 'يَاء',  plate: 'blue'   }
  ];

  /* -------- Position des 28 tuiles sur l'écran « اكتشف معانا » -------- */
  var COL_LEFT = [79.28, 71.47, 63.75, 55.85, 47.77, 39.78, 31.69]; // droite → gauche
  var ROW_TOP  = [26.10, 38.44, 50.64, 63.12];
  var TILE_W = 7.81, TILE_H = 12.20;

  /* -------- Raccourcis DOM -------- */
  var $ = function (s) { return document.querySelector(s); };
  var screens = {
    home:   $('#screen-home'),
    grid:   $('#screen-grid'),
    letter: $('#screen-letter')
  };
  var letterBg   = $('#letter-bg');
  var glyphWrap  = $('#glyph-wrap');
  var glyphText  = $('#glyph-text');
  var tilesBox   = $('#tiles');
  var toastEl    = $('#toast');

  var current = 0;
  var playingAll = false;

  /* ======================= Navigation ======================= */
  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle('is-active', k === name);
    });
    stopSpeech();
    if (name !== 'grid') stopPlayAll();
  }

  function openLetter(i) {
    current = (i + LETTERS.length) % LETTERS.length;
    var L = LETTERS[current];

    if (L.img) {
      letterBg.src = 'assets/' + L.img + '.jpg';
      glyphWrap.hidden = true;
    } else {
      var p = PLATES[L.plate];
      letterBg.src = 'assets/plate-' + L.plate + '.jpg';
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

    letterBg.alt = 'حرف ' + L.name;
    show('letter');
    speak(L.name);
  }

  /* ======================= Grille ======================= */
  function buildGrid() {
    var frag = document.createDocumentFragment();
    LETTERS.forEach(function (L, i) {
      var b = document.createElement('button');
      b.className = 'tile';
      b.type = 'button';
      b.setAttribute('aria-label', 'حرف ' + L.name);
      b.dataset.index = i;
      b.style.left   = COL_LEFT[i % 7] + '%';
      b.style.top    = ROW_TOP[Math.floor(i / 7)] + '%';
      b.style.width  = TILE_W + '%';
      b.style.height = TILE_H + '%';
      b.addEventListener('click', function () {
        stopPlayAll();
        openLetter(i);
      });
      frag.appendChild(b);
    });
    tilesBox.appendChild(frag);
  }

  function tileAt(i) { return tilesBox.children[i]; }

  /* ======================= Voix ======================= */
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

  /* -------- Lecture de tout l'alphabet -------- */
  function playAll() {
    if (playingAll) { stopPlayAll(); return; }
    playingAll = true;
    var i = 0;
    (function next() {
      if (!playingAll || i >= LETTERS.length) { stopPlayAll(); return; }
      var t = tileAt(i);
      Array.prototype.forEach.call(tilesBox.children, function (el) {
        el.classList.remove('is-speaking');
      });
      t.classList.add('is-speaking');
      var idx = i++;
      speak(LETTERS[idx].name, function () {
        setTimeout(next, 220);
      });
    })();
  }

  function stopPlayAll() {
    playingAll = false;
    stopSpeech();
    Array.prototype.forEach.call(tilesBox.children, function (el) {
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
    var el = e.target.closest('[data-go]');
    if (!el) return;
    show(el.dataset.go);
  });

  $('#btn-say').addEventListener('click', function () { speak(LETTERS[current].name); });
  $('#btn-say-big').addEventListener('click', function () { speak(LETTERS[current].name); });
  $('#btn-prev').addEventListener('click', function () { openLetter(current - 1); });
  $('#btn-next').addEventListener('click', function () { openLetter(current + 1); });
  $('#btn-playall').addEventListener('click', playAll);


  document.addEventListener('keydown', function (e) {
    if (!screens.letter.classList.contains('is-active')) return;
    if (e.key === 'ArrowLeft')  openLetter(current - 1);
    if (e.key === 'ArrowRight') openLetter(current + 1);
    if (e.key === ' ') { e.preventDefault(); speak(LETTERS[current].name); }
  });

  /* -------- Balayage tactile sur l'écran d'une lettre -------- */
  var x0 = null;
  screens.letter.addEventListener('touchstart', function (e) {
    x0 = e.changedTouches[0].clientX;
  }, { passive: true });
  screens.letter.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 60) openLetter(current + (dx < 0 ? -1 : 1));
    x0 = null;
  }, { passive: true });

  /* -------- Préchargement des visuels -------- */
  function preload() {
    LETTERS.forEach(function (L) {
      var src = L.img ? 'assets/' + L.img + '.jpg' : 'assets/plate-' + L.plate + '.jpg';
      var im = new Image();
      im.src = src;
    });
    ['home', 'grid'].forEach(function (n) {
      var im = new Image();
      im.src = 'assets/' + n + '.jpg';
    });
  }

  buildGrid();
  setTimeout(preload, 600);
})();
