(function () {
  "use strict";

  const storageKey = "instructions-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readSavedTheme() {
    try {
      const savedTheme = window.localStorage.getItem(storageKey);
      return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    } catch (error) {
      return null;
    }
  }

  function updateButton(theme) {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const isDark = theme === "dark";
    const nextThemeLabel = isDark ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw";
    toggle.setAttribute("aria-label", "Ciemny motyw");
    toggle.setAttribute("title", nextThemeLabel);
    toggle.setAttribute("aria-pressed", String(isDark));
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    updateButton(theme);

    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  function getSystemTheme() {
    return systemTheme.matches ? "dark" : "light";
  }

  applyTheme(readSavedTheme() || getSystemTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    updateButton(document.documentElement.dataset.theme);
    toggle.addEventListener("click", function () {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch (error) {
        // Keep the current selection for this page even when storage is unavailable.
      }

      applyTheme(nextTheme);
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
