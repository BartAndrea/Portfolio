// Chapter menu on case-study pages. Marks the chapter being read with aria-current="location"
// and, in the phone strip, scrolls the active chip into view. Loaded with `defer`.
// Without JavaScript the menu is a plain list of anchor links, which is fine.
(function () {
  const nav = document.querySelector(".chapters");
  if (!nav) return;
  const list = nav.querySelector("ul");
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const chapters = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if (!chapters.length) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = null;

  function update() {
    // The current chapter is the last one whose top has passed 40% of the viewport,
    // or the last chapter once the page is scrolled to the bottom.
    const line = window.innerHeight * 0.4;
    let active = chapters[0];
    for (const chapter of chapters) if (chapter.getBoundingClientRect().top <= line) active = chapter;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) active = chapters[chapters.length - 1];
    if (active === current) return;
    current = active;
    for (const a of links) {
      if (a.hash === "#" + active.id) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    }
    // Phone strip only: keep the active chip visible without moving the page.
    const chip = links.find((a) => a.hash === "#" + active.id);
    if (chip && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: chip.offsetLeft - list.offsetLeft - 16, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  }

  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
