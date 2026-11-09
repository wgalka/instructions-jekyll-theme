(function () {
  "use strict";

  function init() {
    const content = document.getElementById("page-content");
    const panel = document.getElementById("page-toc");
    const toggle = document.getElementById("page-toc-toggle");
    const nav = document.getElementById("page-toc-nav");
    if (!content || !panel || !toggle || !nav) return;

    function headingLevel(value, fallback) {
      const level = Number(value);
      return Number.isInteger(level) && level >= 1 && level <= 6 ? level : fallback;
    }
    let firstLevel = headingLevel(panel.dataset.minLevel, 1);
    let lastLevel = headingLevel(panel.dataset.maxLevel, 6);
    if (firstLevel > lastLevel) {
      firstLevel = 1;
      lastLevel = 6;
    }

    const headings = Array.from(content.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      .filter(function (heading) {
        const level = Number(heading.tagName.slice(1));
        return level >= firstLevel && level <= lastLevel &&
          !heading.closest("[data-toc-ignore], .footer, nav, figure, pre") &&
          heading.textContent.trim();
      });
    if (headings.length === 0) return;

    const storageKey = "page-toc-collapsed";
    const desktop = window.matchMedia("(min-width: 1100px)");
    let collapsed = false;
    try {
      collapsed = localStorage.getItem(storageKey) === "true";
    } catch (_) { /* Navigation also works when storage is unavailable. */ }

    const usedIds = new Set(Array.from(document.querySelectorAll("[id]"), function (el) {
      return el.id;
    }));
    const minLevel = Math.min.apply(null, headings.map(function (heading) {
      return Number(heading.tagName.slice(1));
    }));
    const list = document.createElement("ul");
    const links = headings.map(function (heading, index) {
      const label = heading.cloneNode(true);
      label.querySelectorAll(".anchorjs-link, .anchor, mjx-assistive-mml").forEach(function (el) {
        el.remove();
      });
      const text = label.textContent.replace(/\s+/g, " ").trim();
      if (!heading.id) {
        const base = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "")
          .trim().replace(/\s+/g, "-") || "sekcja-" + (index + 1);
        let id = base;
        let suffix = 2;
        while (usedIds.has(id)) id = base + "-" + suffix++;
        heading.id = id;
        usedIds.add(id);
      }
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + encodeURIComponent(heading.id);
      link.textContent = text;
      link.style.setProperty("--toc-depth", Number(heading.tagName.slice(1)) - minLevel);
      item.appendChild(link);
      list.appendChild(item);

      // Reveal headings in collapsed examples before the native anchor jump.
      link.addEventListener("click", function (event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        let parent = heading.parentElement;
        while (parent && parent !== content) {
          if (parent.tagName === "DETAILS") parent.open = true;
          parent = parent.parentElement;
        }
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        setActive(index);
      });
      return link;
    });
    nav.appendChild(list);
    panel.hidden = false;

    function applyCollapsed() {
      panel.classList.toggle("is-collapsed", collapsed);
      nav.hidden = collapsed;
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.querySelector(".page-toc__action").textContent = collapsed ? "Pokaż" : "Ukryj";
      document.documentElement.classList.toggle("has-page-toc", !collapsed);
    }
    applyCollapsed();
    toggle.addEventListener("click", function () {
      collapsed = !collapsed;
      applyCollapsed();
      try {
        localStorage.setItem(storageKey, String(collapsed));
      } catch (_) { /* Keep the current state for this page. */ }
      scheduleUpdate();
    });
    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !collapsed) {
        toggle.click();
        toggle.focus();
      }
    });

    let activeIndex = -1;
    function setActive(index) {
      if (index === activeIndex) return;
      if (activeIndex >= 0) links[activeIndex].removeAttribute("aria-current");
      links[index].setAttribute("aria-current", "location");
      activeIndex = index;
      if (!collapsed && desktop.matches) {
        const linkRect = links[index].getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
          nav.scrollTop += linkRect.top - navRect.top - nav.clientHeight / 2;
        }
      }
    }

    let scheduled = false;
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        if (!desktop.matches) return;
        let current = 0;
        headings.forEach(function (heading, index) {
          if (heading.getClientRects().length && heading.getBoundingClientRect().top <= 100) {
            current = index;
          }
        });
        setActive(current);
      });
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);
    document.addEventListener("readingwidthchange", scheduleUpdate);
    content.addEventListener("toggle", scheduleUpdate, true);
    if (window.ResizeObserver) new ResizeObserver(scheduleUpdate).observe(content);
    scheduleUpdate();
  }

  // Run after the theme's DOMContentLoaded repairs of Markdown inside details.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
