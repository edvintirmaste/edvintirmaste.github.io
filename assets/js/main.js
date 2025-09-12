/* Edvin Portfolio — assets/js/main.js (v29.7)
   Goals:
   1) Sample the real page background (your fixed .bg-wrap img) → --fracture-url
   2) Install an inline SVG Displacement filter (#et-fracture) for true refraction
   3) Inject a few shard slices into the header for a faceted look
*/

(function(){
  function $(sel){ return document.querySelector(sel); }

  function findBackgroundURL(){
    var img = document.querySelector('.bg-wrap img');
    if (img && (img.currentSrc || img.src)) return 'url("' + (img.currentSrc || img.src) + '")';
    var bodyBG = getComputedStyle(document.body).backgroundImage;
    return (bodyBG && bodyBG !== 'none') ? bodyBG : null;
  }

  function applyFractureVars(){
    var header = $('header.site-header');
    if (!header) return;
    var url = findBackgroundURL();
    header.style.setProperty('--fracture-url', url ? url : 'none');
  }

  function installFilterOnce(){
    if (document.getElementById('et-fracture-defs')) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id','et-fracture-defs');
    svg.setAttribute('width','0'); svg.setAttribute('height','0');
    svg.setAttribute('style','position:fixed');

    var filter = document.createElementNS(svgNS,'filter');
    filter.setAttribute('id','et-fracture');
    filter.setAttribute('x','-20%'); filter.setAttribute('y','-20%');
    filter.setAttribute('width','140%'); filter.setAttribute('height','140%');
    filter.setAttribute('color-interpolation-filters','sRGB');

    var turb = document.createElementNS(svgNS,'feTurbulence');
    turb.setAttribute('type','fractalNoise');
    turb.setAttribute('baseFrequency','0.0065'); // stronger than before so it reads
    turb.setAttribute('numOctaves','2');
    turb.setAttribute('seed','7');
    turb.setAttribute('result','noise');

    var disp = document.createElementNS(svgNS,'feDisplacementMap');
    disp.setAttribute('in','SourceGraphic');
    disp.setAttribute('in2','noise');
    disp.setAttribute('xChannelSelector','R');
    disp.setAttribute('yChannelSelector','G');
    disp.setAttribute('scale','16'); // <— refraction punch

    filter.appendChild(turb);
    filter.appendChild(disp);
    svg.appendChild(filter);
    document.body.appendChild(svg);
  }

  function ensureFacetSlices(){
    var header = $('header.site-header');
    if (!header) return;
    if (header.querySelector('.fracture-layer')) return;

    var layer = document.createElement('div');
    layer.className = 'fracture-layer';
    // Create 7 slices (CSS shapes via :nth-child)
    for (var i=0;i<7;i++){
      var s = document.createElement('div');
      s.className = 'slice';
      layer.appendChild(s);
    }
    // Add subtle fringe lines container
    var fringe = document.createElement('div');
    fringe.className = 'fracture-fringe';

    header.appendChild(layer);
    header.appendChild(fringe);
  }

  function init(){
    installFilterOnce();
    ensureFacetSlices();
    applyFractureVars();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  // keep variables honest on resize/orientation (in case bg sizes/positions shift)
  window.addEventListener('resize', applyFractureVars, { passive:true });
  window.addEventListener('orientationchange', applyFractureVars, { passive:true });

  console.log('[ET] fracture v29.7 ready');
})();
