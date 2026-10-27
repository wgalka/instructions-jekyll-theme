(function () {
  "use strict";

  const themeStorageKey = "instructions-theme";
  const widthStorageKey = "instructions-line-width";
  const tableModeStorageKey = "instructions-table-mode";
  const allowedWidths = ["45", "55", "65", "80", "100"];
  const defaultWidth = "55";
  const defaultTableMode = "wrap";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readSavedTheme() {
    try {
      const savedTheme = window.localStorage.getItem(themeStorageKey);
      return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    } catch (error) {
      return null;
    }
  }

  function readSavedWidth() {
    try {
      const savedWidth = window.localStorage.getItem(widthStorageKey);
      return allowedWidths.indexOf(savedWidth) !== -1 ? savedWidth : null;
    } catch (error) {
      return null;
    }
  }

  function readSavedTableMode() {
    try {
      const savedMode = window.localStorage.getItem(tableModeStorageKey);
      return savedMode === "wrap" || savedMode === "wide" ? savedMode : null;
    } catch (error) {
      return null;
    }
  }

  function updateThemeButton(theme) {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const isDark = theme === "dark";
    const nextThemeLabel = isDark ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw";
    toggle.setAttribute("aria-label", "Ciemny motyw");
    toggle.setAttribute("title", nextThemeLabel);
    toggle.setAttribute("aria-pressed", String(isDark));
  }

  function updateWidthButtons(width) {
    const buttons = document.querySelectorAll("[data-line-width-option]");
    buttons.forEach(function (button) {
      const isSelected = button.getAttribute("data-line-width-option") === width;
      button.setAttribute("aria-pressed", String(isSelected));
      button.classList.toggle("is-active", isSelected);
    });
  }

  function updateTableModeButton(mode) {
    const toggle = document.getElementById("table-mode-toggle");
    if (!toggle) return;

    const isWide = mode === "wide";
    const label = isWide
      ? "Dopasuj tabele do szerokości tekstu (zawijaj tekst)"
      : "Rozszerz tabele na pełną szerokość okna";
    toggle.setAttribute("title", label);
    toggle.setAttribute("aria-pressed", String(isWide));
    toggle.classList.toggle("is-active", isWide);
  }

  function applyTheme(theme) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = normalizedTheme;
    updateThemeButton(normalizedTheme);

    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: normalizedTheme } })
    );
  }

  function applyWidth(width) {
    const normalizedWidth = allowedWidths.indexOf(width) !== -1 ? width : defaultWidth;
    document.documentElement.dataset.lineWidth = normalizedWidth;
    updateWidthButtons(normalizedWidth);

    document.dispatchEvent(
      new CustomEvent("readingwidthchange", { detail: { width: normalizedWidth } })
    );
  }

  function applyTableMode(mode) {
    const normalizedMode = mode === "wide" ? "wide" : "wrap";
    document.documentElement.dataset.tableMode = normalizedMode;
    updateTableModeButton(normalizedMode);

    document.dispatchEvent(
      new CustomEvent("tablemodechange", { detail: { mode: normalizedMode } })
    );
  }

  function getSystemTheme() {
    return systemTheme.matches ? "dark" : "light";
  }

  applyTheme(readSavedTheme() || getSystemTheme());
  applyWidth(readSavedWidth() || defaultWidth);
  applyTableMode(readSavedTableMode() || defaultTableMode);

  document.addEventListener("DOMContentLoaded", function () {
    updateThemeButton(document.documentElement.dataset.theme);
    updateWidthButtons(document.documentElement.dataset.lineWidth || defaultWidth);
    updateTableModeButton(document.documentElement.dataset.tableMode || defaultTableMode);

    const controls = document.getElementById("reading-controls");
    const trigger = document.getElementById("reading-controls-trigger");

    function setControlsOpen(isOpen) {
      if (!controls || !trigger) return;
      controls.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
    }

    if (controls && trigger) {
      trigger.addEventListener("click", function (event) {
        event.stopPropagation();
        setControlsOpen(!controls.classList.contains("is-open"));
      });

      document.addEventListener("click", function (event) {
        if (!controls.contains(event.target)) {
          setControlsOpen(false);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          setControlsOpen(false);
        }
      });
    }

    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

        try {
          window.localStorage.setItem(themeStorageKey, nextTheme);
        } catch (error) {
          // Keep the current selection for this page even when storage is unavailable.
        }

        applyTheme(nextTheme);
      });
    }

    const tableModeToggle = document.getElementById("table-mode-toggle");
    if (tableModeToggle) {
      tableModeToggle.addEventListener("click", function () {
        const nextMode =
          document.documentElement.dataset.tableMode === "wide" ? "wrap" : "wide";

        try {
          window.localStorage.setItem(tableModeStorageKey, nextMode);
        } catch (error) {
          // Keep the current selection for this page even when storage is unavailable.
        }

        applyTableMode(nextMode);
      });
    }

    const widthButtons = document.querySelectorAll("[data-line-width-option]");
    widthButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const nextWidth = button.getAttribute("data-line-width-option");
        if (allowedWidths.indexOf(nextWidth) === -1) return;

        try {
          window.localStorage.setItem(widthStorageKey, nextWidth);
        } catch (error) {
          // Keep the current selection for this page even when storage is unavailable.
        }

        applyWidth(nextWidth);
      });
    });
  });

  function followSystemPreference(event) {
    if (!readSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  }

  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", followSystemPreference);
  } else if (typeof systemTheme.addListener === "function") {
    systemTheme.addListener(followSystemPreference);
  }
})();
