/* Edvin Portfolio — assets/js/main.js (v30.3)
   Edge-locked refraction:
   - Sample .bg-wrap img → --fracture-url
   - Install a single SVG displacement filter (#et-refract-edgeSafe) with a huge region
   - Read strength/frequency from CSS vars so you can tune without code edits
*/

(function(){
  function $(sel){ return document.querySelector(sel); }

  function findBackgroundURL(){
    var img = document.querySelector('.bg-wrap img');
    if (img && (img.currentSrc || img.src)) return 'url("' + (img.currentSrc || img.src) + '")';
    var bodyBG = getComputedStyle(document.body).backgroundImage;
    return (bodyBG && bodyBG !== 'none') ? bodyBG : null;
  }

  function cssVarNum(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return isFinite(n) ? n : fallback;
  }

  function applyFractureVars(){
    var header = $('header.site-header');
    if (!header) return;
    header.style.setProperty('--fracture-url', findBackgroundURL() || 'none');
  }

  function installOrUpdateFilter(){
    var svg = document.getElementById('et-refract-edgeSafe-defs');
    if (!svg){
      var svgNS = 'http://www.w3.org/2000/svg';
      svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('id','et-refract-edgeSafe-defs');
      svg.setAttribute('width','0'); svg.setAttribute('height','0');
      svg.setAttribute('style','position:fixed');

      var filter = document.createElementNS(svgNS,'filter');
      filter.setAttribute('id','et-refract-edgeSafe');
      /* huge filter region so displacement never clips */
      filter.setAttribute('x','-60%'); filter.setAttribute('y','-60%');
      filter.setAttribute('width','220%'); filter.setAttribute('height','220%');
      filter.setAttribute('color-interpolation-filters','sRGB');

      var turb = document.createElementNS(svgNS,'feTurbulence');
      turb.setAttribute('id','et-turb');
      turb.setAttribute('type','turbulence');
      turb.setAttribute('numOctaves','1');
      turb.setAttribute('seed','19');
      turb.setAttribute('result','noise');

      var disp = document.createElementNS(svgNS,'feDisplacementMap');
      disp.setAttribute('id','et-disp');
      disp.setAttribute('in','SourceGraphic');
      disp.setAttribute('in2','noise');
      disp.setAttribute('xChannelSelector','R');
      disp.setAttribute('yChannelSelector','G');

      filter.appendChild(turb);
      filter.appendChild(disp);
      svg.appendChild(filter);
      document.body.appendChild(svg);
    }

    // pull params from CSS vars
    var freq = cssVarNum('--fracture-frequency', 0.008);
    var scale = cssVarNum('--fracture-strength', 26);
    var turbEl = document.getElementById('et-turb');
    var dispEl = document.getElementById('et-disp');
    if (turbEl) turbEl.setAttribute('baseFrequency', String(freq));
    if (dispEl) dispEl.setAttribute('scale', String(scale));
  }

  function init(){
    installOrUpdateFilter();
    applyFractureVars();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  window.addEventListener('resize', applyFractureVars, { passive:true });
  window.addEventListener('orientationchange', applyFractureVars, { passive:true });

  console.log('[ET] refraction v30.3 (edge-locked, huge overscan) ready');
})();
