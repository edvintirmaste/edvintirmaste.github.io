/* Edvin Portfolio — assets/js/main.js (v30.4)
   Edge-locked refraction (viewport-locked sampling):
   - Sample .bg-wrap img → --fracture-url
   - Install #et-refract-edgeSafe with a huge filter region
   - Read strength/frequency from CSS vars (tune in DevTools, no JS edits)
*/

(function(){
  function findBackgroundURL(){
    var img = document.querySelector('.bg-wrap img');
    if (img && (img.currentSrc || img.src)) return 'url("' + (img.currentSrc || img.src) + '")';
    var bodyBG = getComputedStyle(document.body).backgroundImage;
    return (bodyBG && bodyBG !== 'none') ? bodyBG : null;
  }

  function cssNum(varName, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    var n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function applyVars(){
    var header = document.querySelector('header.site-header');
    if (!header) return;
    header.style.setProperty('--fracture-url', findBackgroundURL() || 'none');
  }

  function installOrUpdateFilter(){
    var svg = document.getElementById('et-refract-edgeSafe-defs');
    if (!svg){
      var svgNS = 'http://www.w3.org/2000/svg';
      svg = document.createElementNS(svgNS, 'svg');
      svg.id = 'et-refract-edgeSafe-defs';
      svg.setAttribute('width','0'); svg.setAttribute('height','0');
      svg.style.position = 'fixed';

      var filter = document.createElementNS(svgNS,'filter');
      filter.id = 'et-refract-edgeSafe';
      /* massive region so displacement never clips */
      filter.setAttribute('x','-60%'); filter.setAttribute('y','-60%');
      filter.setAttribute('width','220%'); filter.setAttribute('height','220%');
      filter.setAttribute('color-interpolation-filters','sRGB');

      var turb = document.createElementNS(svgNS,'feTurbulence');
      turb.id = 'et-turb';
      turb.setAttribute('type','turbulence');
      turb.setAttribute('numOctaves','1');
      turb.setAttribute('seed','23');
      turb.setAttribute('result','noise');

      var disp = document.createElementNS(svgNS,'feDisplacementMap');
      disp.id = 'et-disp';
      disp.setAttribute('in','SourceGraphic');
      disp.setAttribute('in2','noise');
      disp.setAttribute('xChannelSelector','R');
      disp.setAttribute('yChannelSelector','G');

      filter.appendChild(turb);
      filter.appendChild(disp);
      svg.appendChild(filter);
      document.body.appendChild(svg);
    }
    var freq = cssNum('--fracture-frequency', 0.010);
    var scale = cssNum('--fracture-strength', 28);
    var turbEl = document.getElementById('et-turb');
    var dispEl = document.getElementById('et-disp');
    if (turbEl) turbEl.setAttribute('baseFrequency', String(freq));
    if (dispEl) dispEl.setAttribute('scale', String(scale));
  }

  function init(){
    installOrUpdateFilter();
    applyVars();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  window.addEventListener('resize', applyVars, { passive:true });
  window.addEventListener('orientationchange', applyVars, { passive:true });

  console.log('[ET] refraction v30.4 (viewport-locked) ready');
})();
