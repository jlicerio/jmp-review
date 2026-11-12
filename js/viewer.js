/* =========================================================
   Viewer — one image at a time.
   Every .viewer on the page runs on its own: 300ms crossfade,
   edge buttons, arrow keys while it is in view, caption and
   two-digit counter. No autoplay. Reduced motion swaps
   instantly, and the timer drops to zero with it.
   ========================================================= */

(function () {
  var roots = Array.prototype.slice.call(document.querySelectorAll(".viewer"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function two(n) { return (n < 10 ? "0" : "") + n; }

  /* The label is the slide's data-caption, else the image alt. */
  function labelOf(slide) {
    var img = slide.querySelector("img");
    return slide.getAttribute("data-caption") || (img ? img.alt : "") || "";
  }

  function run(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".viewer-slide"));
    if (slides.length < 2) return;

    var cap = root.querySelector(".viewer-cap");
    var num = root.querySelector(".viewer-num");
    var prev = root.querySelector(".viewer-prev");
    var next = root.querySelector(".viewer-next");
    var index = 0;
    var lock = false;
    var inView = true;

    function show(n) {
      var target = (n + slides.length) % slides.length;
      if (lock || target === index) return;
      lock = true;
      slides[index].classList.remove("on");
      index = target;
      slides[index].classList.add("on");
      if (cap) cap.textContent = labelOf(slides[index]);
      if (num) num.textContent = two(index + 1);
      window.setTimeout(function () { lock = false; }, reduce.matches ? 0 : 300);
    }

    function step(d) { show(index + d); }

    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    window.addEventListener("keydown", function (e) {
      if (!inView) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting && entries[0].intersectionRatio > 0.4;
      }, { threshold: [0, 0.4, 1] }).observe(root);
    }

    if (num) num.textContent = two(index + 1);
    if (cap) cap.textContent = labelOf(slides[index]);
  }

  for (var i = 0; i < roots.length; i++) run(roots[i]);
}());
