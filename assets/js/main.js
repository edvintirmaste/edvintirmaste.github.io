/* Edvin Portfolio — assets/js/main.js (v30.1)
   Edge-safe simple refraction:
   - Sample the real background (.bg-wrap img → --fracture-url)
   - Install a single SVG displacement filter (#et-refract-edgeSafe)
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
    var url = findBackgroundURL();
    header.style.setProperty('--fracture-url', url ? url : 'none');
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
      filter.setAttribute('x','-20%'); filter.setAttribute('y','-20%');
      filter.setAttribute('width','140%'); filter.setAttribute('height','140%');
      filter.setAttribute('color-interpolation-filters','sRGB');

      var turb = document.createElementNS(svgNS,'feTurbulence');
      turb.setAttribute('id','et-turb');
      turb.setAttribute('type','turbulence'); // clearer “glass” feel
      turb.setAttribute('numOctaves','1');
      turb.setAttribute('seed','13');
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

    // Apply strength/frequency from CSS tokens
    var freq = cssVarNum('--fracture-frequency', 0.010);
    var scale = cssVarNum('--fracture-strength', 24);
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

  console.log('[ET] edge-safe refraction ready (v30.1)');
})();
