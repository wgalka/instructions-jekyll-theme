(function () {
  "use strict";

  const themeStorageKey = "instructions-theme";
  const widthStorageKey = "instructions-line-width";
  const allowedWidths = ["45", "55", "65", "80", "100"];
  const defaultWidth = "55";
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

  function getSystemTheme() {
    return systemTheme.matches ? "dark" : "light";
  }

  applyTheme(readSavedTheme() || getSystemTheme());
  applyWidth(readSavedWidth() || defaultWidth);

  document.addEventListener("DOMContentLoaded", function () {
    updateThemeButton(document.documentElement.dataset.theme);
    updateWidthButtons(document.documentElement.dataset.lineWidth || defaultWidth);

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
