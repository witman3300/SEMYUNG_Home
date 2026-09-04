/* ===========================================================
   세명장교 — main.js (메인 홈: 서비스·갤러리 좌우 슬라이더)
   =========================================================== */
(function () {
  'use strict';
  function initSlider(trackId, prevId, nextId) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    const step = () => {
      const c = track.firstElementChild;
      return c ? c.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 4;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  initSlider('svcTrack', 'svcPrev', 'svcNext');
  initSlider('galTrack', 'galPrev', 'galNext');

  /* 히어로 5장 자동 슬라이드 (5초, 페이드) */
  (function () {
    const slides = [].slice.call(document.querySelectorAll('.hslide'));
    if (!slides.length) return;
    const dots = [].slice.call(document.querySelectorAll('#hDots .hdot'));
    const prev = document.getElementById('hPrev');
    const next = document.getElementById('hNext');
    const pause = document.getElementById('hPause');
    let cur = 0, playing = true, timer = null;
    const DUR = 5000;

    function go(i) {
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('on');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('on');
    }
    function start() { stop(); if (playing) timer = setInterval(function () { go(cur + 1); }, DUR); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    prev && prev.addEventListener('click', function () { go(cur - 1); start(); });
    next && next.addEventListener('click', function () { go(cur + 1); start(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });
    pause && pause.addEventListener('click', function () {
      playing = !playing;
      pause.innerHTML = playing ? '❚❚' : '▶';
      pause.setAttribute('aria-label', playing ? '일시정지' : '재생');
      if (playing) start(); else stop();
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (playing) start(); });
    start();
  })();
})();

