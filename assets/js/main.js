/* Edvin Portfolio — assets/js/main.js (v29.8)
   Simple refraction only:
   - Sample the real background (.bg-wrap img → --fracture-url)
   - Install a single SVG displacement filter (#et-refract-simple)
   - Remove any old facet/fringe nodes from earlier builds
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

  function installSimpleFilter(){
    if (document.getElementById('et-refract-simple-defs')) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id','et-refract-simple-defs');
    svg.setAttribute('width','0'); svg.setAttribute('height','0');
    svg.setAttribute('style','position:fixed');

    var filter = document.createElementNS(svgNS,'filter');
    filter.setAttribute('id','et-refract-simple');
    filter.setAttribute('x','-20%'); filter.setAttribute('y','-20%');
    filter.setAttribute('width','140%'); filter.setAttribute('height','140%');
    filter.setAttribute('color-interpolation-filters','sRGB');

    // Use turbulence (sharper than fractalNoise) for clearer “glass” bends
    var turb = document.createElementNS(svgNS,'feTurbulence');
    turb.setAttribute('type','turbulence');
    turb.setAttribute('baseFrequency','0.008'); // increase for more facets; lower for smoother
    turb.setAttribute('numOctaves','1');
    turb.setAttribute('seed','11');
    turb.setAttribute('result','noise');

    var disp = document.createElementNS(svgNS,'feDisplacementMap');
    disp.setAttribute('in','SourceGraphic');
    disp.setAttribute('in2','noise');
    disp.setAttribute('xChannelSelector','R');
    disp.setAttribute('yChannelSelector','G');
    disp.setAttribute('scale','14'); // refraction strength

    filter.appendChild(turb);
    filter.appendChild(disp);
    svg.appendChild(filter);
    document.body.appendChild(svg);
  }

  function removeOldFacetFringe(){
    document.querySelectorAll('header.site-header .fracture-layer, header.site-header .fracture-fringe')
      .forEach(function(n){ n.remove(); });
  }

  function init(){
    removeOldFacetFringe();
    installSimpleFilter();
    applyFractureVars();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  window.addEventListener('resize', applyFractureVars, { passive:true });
  window.addEventListener('orientationchange', applyFractureVars, { passive:true });

  console.log('[ET] simple refraction ready (v29.8)');
})();
