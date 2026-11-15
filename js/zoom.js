// Tap to zoom on case-study images. Gives every real image (.case-img) an Enlarge button and
// opens it full size in a <dialog>: fitted to the screen on wide screens, at a readable width with
// swipe-to-pan on phones. Loaded with `defer`. Without JavaScript the images simply show as they
// are, without zoom. Placeholder mockups and switcher thumbnails aren't .case-img, so they're skipped.
(function () {
  const frames = [...document.querySelectorAll(".case-study .case-img")];
  if (!frames.length || typeof HTMLDialogElement !== "function") return;

  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20M10.5 8v5M8 10.5h5"/></svg>';
  let dialog, view, caption, trigger;

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "zoom";
    dialog.setAttribute("aria-labelledby", "zoom-caption");
    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn zoom-close";
    close.textContent = "Close";
    close.addEventListener("click", () => dialog.close());
    view = document.createElement("div");
    view.className = "zoom-view";
    view.tabIndex = 0; // keyboard users can pan the image with the arrow keys when it's wider than the screen
    caption = document.createElement("p");
    caption.className = "zoom-caption";
    caption.id = "zoom-caption";
    dialog.append(close, view, caption);
    // A tap on the empty area around the image closes the viewer, like the Close button.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target === view) dialog.close();
    });
    dialog.addEventListener("close", () => {
      view.replaceChildren();
      if (trigger) trigger.focus();
    });
    document.body.append(dialog);
  }

  function open(frame, from) {
    if (!dialog) build();
    const picture = frame.querySelector("picture").cloneNode(true);
    // Ask for the largest file: the viewer is at least 60rem wide.
    for (const source of picture.querySelectorAll("source")) source.sizes = "max(100vw, 60rem)";
    const img = picture.querySelector("img");
    img.loading = "eager";
    img.removeAttribute("fetchpriority");
    view.replaceChildren(picture);
    const figcaption = frame.closest("figure")?.querySelector("figcaption");
    caption.textContent = figcaption ? figcaption.textContent : img.alt;
    trigger = from;
    dialog.showModal();
    view.scrollTo(0, 0);
  }

  for (const frame of frames) {
    const shot = frame.closest(".case-shot");
    if (!shot || !frame.querySelector("picture")) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zoom-btn";
    button.innerHTML = icon + '<span class="visually-hidden">Enlarge image</span>';
    button.addEventListener("click", () => open(frame, button));
    shot.append(button);
    frame.classList.add("is-zoomable");
    frame.addEventListener("click", () => open(frame, button));
  }
})();
