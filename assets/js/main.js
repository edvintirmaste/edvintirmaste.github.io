/* Edvin Portfolio — assets/js/main.js (v31.0)
   SVG overlay refraction with crisp edges:
   - Inject <svg class="refract-svg"> into the header (no HTML edits).
   - Draw a second copy of the hero image, offset, with a single displacement filter.
   - Overscan far outside the bar so edges never show gaps.
   - Read strength/frequency/offsets from CSS vars so you can tweak live.
*/

(function(){
  function cssNum(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function findBG(){
    var img = document.querySelector('.bg-wrap img');
    if (img && (img.currentSrc || img.src)) return (img.currentSrc || img.src);
    // fallback to body background-image url("..."):
    var bg = getComputedStyle(document.body).backgroundImage;
    var m = bg && bg.match(/url\\((?:\"|')?([^\"')]+)(?:\"|')?\\)/i);
    return m ? m[1] : null;
  }

  function mount(){
    var header = document.querySelector('header.site-header');
    if (!header) return;

    // Remove any old overlay
    var old = header.querySelector('svg.refract-svg');
    if (old) old.remove();

    // Build SVG (scoped to the bar → crisp edges, always clipped)
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('refract-svg');
    svg.setAttribute('xmlns', svgNS);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');

    var defs = document.createElementNS(svgNS, 'defs');

    var filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', 'et-refract-live');
    // massive region so displacement never clips inside the bar
    filter.setAttribute('x', '-60%'); filter.setAttribute('y', '-60%');
    filter.setAttribute('width', '220%'); filter.setAttribute('height', '220%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    var turb = document.createElementNS(svgNS, 'feTurbulence');
    turb.setAttribute('id', 'et-turb');
    turb.setAttribute('type', 'turbulence');
    turb.setAttribute('numOctaves', '1');
    turb.setAttribute('seed', '31');
    turb.setAttribute('result', 'noise');

    var disp = document.createElementNS(svgNS, 'feDisplacementMap');
    disp.setAttribute('id', 'et-disp');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'noise');
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');

    filter.appendChild(turb);
    filter.appendChild(disp);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Drawing group (apply the filter)
    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('filter', 'url(#et-refract-live)');

    // <image> sized to viewport + overscan, offset by CSS vars
    var imgURL = findBG();
    if (!imgURL) return; // nothing to draw

    var image = document.createElementNS(svgNS, 'image');
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgURL);

    // compute viewport + overscan geometry
    var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var overscan = cssNum('--fracture-overscan', 160);

    image.setAttribute('width', String(vw + overscan*2));
    image.setAttribute('height', String(vh + overscan*2));
    image.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    // offset: push the sample relative to the viewport center
    var offX = cssNum('--fracture-offset-x', 18);
    var offY = cssNum('--fracture-offset-y', 12);
    image.setAttribute('x', String(-overscan + offX));
    image.setAttribute('y', String(-overscan + offY));

    g.appendChild(image);
    svg.appendChild(g);
    header.insertBefore(svg, header.firstChild); // behind nav content

    // apply strength/frequency from CSS vars
    var freq = cssNum('--fracture-frequency', 0.010);
    var scale = cssNum('--fracture-strength', 30);
    turb.setAttribute('baseFrequency', String(freq));
    disp.setAttribute('scale', String(scale));
  }

  function init(){
    mount();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  // Keep in sync on resize/orientation
  window.addEventListener('resize', mount, { passive:true });
  window.addEventListener('orientationchange', mount, { passive:true });

  console.log('[ET] refraction v31.0 (SVG overlay) ready');
})();
