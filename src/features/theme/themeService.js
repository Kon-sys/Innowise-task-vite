const KEY = "book_catalog_theme_v1";

export function getInitialTheme() {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
}

export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

export function saveTheme(theme) {
    localStorage.setItem(KEY, theme);
}

export function toggleTheme(current) {
    return current === "dark" ? "light" : "dark";
}