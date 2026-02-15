import { renderLayout } from "./layout";
import { qs } from "../shared/dom";

export function initApp() {
    const root = qs("#app");
    if (!root) throw new Error("Root element #app not found");

    renderLayout(root);

    const statusEl = qs("#status");
    const inputEl = qs("#searchInput");
    const btnEl = qs("#searchBtn");

    btnEl.addEventListener("click", () => {
        const q = inputEl.value.trim();
        statusEl.textContent = q ? `Searching: "${q}" (stub)` : "Please enter a search query";
    });
}
