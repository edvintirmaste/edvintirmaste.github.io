/* Edvin Portfolio — assets/js/main.js (v29.5)
   Purpose: Fracture v1 — sample real page background → set CSS vars on header.
   Safe: no external deps; runs after DOM is ready; does nothing if no BG is found.
*/

(function(){
  function $(sel){ return document.querySelector(sel); }

  function getBgSource(){
    // Priority: any hero-like element with a background, else body
    var candidates = [
      $('.hero'),
      $('#hero'),
      $('.section-hero'),
      $('main'),
      document.body
    ].filter(Boolean);

    for (var i=0;i<candidates.length;i++){
      var cs = getComputedStyle(candidates[i]);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        return { el: candidates[i], cs: cs };
      }
    }
    return null;
  }

  function applyFractureVars(){
    var header = $('header.site-header');
    if(!header) return;

    var src = getBgSource();
    if(!src) {
      // No background image on page — hide overlay by clearing image var
      header.style.setProperty('--fracture-bg-image', 'none');
      return;
    }

    var cs = src.cs;
    // Copy computed background props to header-scoped CSS vars
    header.style.setProperty('--fracture-bg-image', cs.backgroundImage);
    header.style.setProperty('--fracture-bg-size', cs.backgroundSize || 'cover');

    // Parse position into X/Y tokens
    var pos = (cs.backgroundPosition || '50% 50%').split(' ');
    header.style.setProperty('--fracture-bg-pos-x', pos[0] || '50%');
    header.style.setProperty('--fracture-bg-pos-y', pos[1] || '50%');

    header.style.setProperty('--fracture-bg-attach', cs.backgroundAttachment || 'scroll');
  }

  function onReady(fn){
    if(document.readyState === 'complete' || document.readyState === 'interactive'){
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once:true });
    }
  }

  onReady(function(){
    applyFractureVars();
    // Re-apply on resize/orientationchange to keep positioning honest
    window.addEventListener('resize', applyFractureVars, { passive:true });
    window.addEventListener('orientationchange', applyFractureVars, { passive:true });
  });
})();
