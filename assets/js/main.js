/* Edvin Portfolio — main.js (v29.6)
   Adds fracture support for the header by sampling the real background image.
   Does not touch the wordmark split (that still runs inline in index.html v29.4). */

(function () {
  function $(sel){ return document.querySelector(sel); }

  function findBackgroundURL(){
    // Prefer your fixed <img> background in .bg-wrap (per playbook/index.html)
    // Fallback: a CSS background-image on body.
    var img = $('.bg-wrap img');
    if (img && (img.currentSrc || img.src)) {
      return 'url("' + (img.currentSrc || img.src) + '")';
    }
    var bodyBG = getComputedStyle(document.body).backgroundImage;
    if (bodyBG && bodyBG !== 'none') return bodyBG;
    return null;
  }

  function applyFracture(){
    var header = $('header.site-header');
    if (!header) return;
    var url = findBackgroundURL();
    header.style.setProperty('--fracture-url', url ? url : 'none');
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', applyFracture, { once:true });
  } else {
    applyFracture();
  }
  // Keep it honest on resize/orientation
  window.addEventListener('resize', applyFracture, { passive:true });
  window.addEventListener('orientationchange', applyFracture, { passive:true });

  console.log('[ET] main.js fracture ready (v29.6)');
})();
