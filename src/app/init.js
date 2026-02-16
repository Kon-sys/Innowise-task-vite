import { renderLayout } from "./layout";
import { qs } from "../shared/dom";
import { createStore } from "../shared/store";
import { searchBooks } from "../shared/api/openLibrary";
import { normalizeBooks } from "../entities/book/model";
import { renderCatalogGrid } from "../widgets/catalog/catalogGrid";
import { debounce } from "../shared/lib/debounce";
import { getInitialTheme, applyTheme, saveTheme, toggleTheme } from "../features/theme/themeService";
import { renderSkeletonGrid } from "../shared/ui/skeleton";

import { loadFavorites, saveFavorites, toggleFavorite } from "../features/favorites/favoritesRepository";
import { renderFavoritesPanel } from "../widgets/favorites/favoritesPanel";

import { getUniqueAuthors, applyAuthorFilter, fillAuthorSelect } from "../features/filters/authorFilter";

export function initApp() {
    const root = qs("#app");
    if (!root) throw new Error("Root element #app not found");

    renderLayout(root);

    const store = createStore({
        query: "",
        status: "idle", // idle/loading/success/empty/error
        errorMessage: "",
        books: [],
        favorites: [],
        authorFilter: "",
        theme: "light"
    });

    const initialTheme = getInitialTheme();
    store.setState({ theme: initialTheme }, "theme/init");
    applyTheme(initialTheme);

    const statusEl = qs("#status");
    const inputEl = qs("#searchInput");
    const btnEl = qs("#searchBtn");
    const gridEl = qs("#grid");
    const favoritesEl = qs("#favorites");
    const authorSelectEl = qs("#authorSelect");
    const themeBtn = qs("#themeBtn");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const current = store.getState().theme;
            const next = toggleTheme(current);
            store.setState({ theme: next }, "theme/toggle");
            applyTheme(next);
            saveTheme(next);
        });
    }

    store.setState({ favorites: loadFavorites() }, "favorites/load");

    function render(state) {
        if (state.status === "idle") {
            statusEl.innerHTML = `<span class="muted">Enter at least 3 characters to search</span>`;
            renderCatalogGrid(gridEl, [], state.favorites);
            renderFavoritesPanel(favoritesEl, state.favorites);
            return;
        }

        if (state.status === "loading") {
            statusEl.textContent = `Loading results for "${state.query}"...`;
            renderSkeletonGrid(gridEl, 9);
            renderFavoritesPanel(favoritesEl, state.favorites);
            return;
        }

        if (state.status === "error") {
            statusEl.innerHTML = `
                <div class="statusRow">
                    <span>${escapeHtml(state.errorMessage || "Something went wrong")}</span>
                    <button id="retryBtn" class="btn btn-small" type="button">Retry</button>
                </div>`;

            renderCatalogGrid(gridEl, [], state.favorites);
            renderFavoritesPanel(favoritesEl, state.favorites);

            return;
        }

        if (state.status === "empty") {
            statusEl.textContent = `No results for "${state.query}". Try another query.`;
            renderCatalogGrid(gridEl, [], state.favorites);
            renderFavoritesPanel(favoritesEl, state.favorites);
            return;
        }

        statusEl.textContent = `Found ${state.books.length} books for "${state.query}"`;
        const filteredBooks = applyAuthorFilter(state.books, state.authorFilter);
        renderCatalogGrid(gridEl, filteredBooks, state.favorites);
        renderFavoritesPanel(favoritesEl, state.favorites);
    }

    render(store.getState());
    store.subscribe((next) => render(next));

    let currentController = null;

    async function runSearch(query, { silent = false } = {}) {
        const q = query.trim();

        if (!q) {
            store.setState(
                { query: "", status: "idle", errorMessage: "", books: [], authorFilter: "" },
                "search/reset"
            );
            fillAuthorSelect(authorSelectEl, [], "");
            return;
        }

        if (currentController) currentController.abort();
        currentController = new AbortController();

        store.setState(
            { query: q, status: "loading", errorMessage: "", books: [] },
            silent ? "search/start_silent" : "search/start"
        );

        try {
            const raw = await searchBooks(q, { limit: 24, signal: currentController.signal });
            const books = normalizeBooks(raw);

            if (!books.length) {
                store.setState({ status: "empty", books: [], authorFilter: "" }, "search/empty_result");
                fillAuthorSelect(authorSelectEl, [], "");
            } else {
                store.setState({ status: "success", books, authorFilter: "" }, "search/success");

                const authors = getUniqueAuthors(books);
                fillAuthorSelect(authorSelectEl, authors, "");
            }
        } catch (err) {
            if (err?.name === "AbortError") return;

            store.setState(
                { status: "error", errorMessage: err?.message || "Network error", books: [] },
                "search/error"
            );
        }
    }

    const debouncedSearch = debounce((q) => runSearch(q, { silent: true }), 400);

    btnEl.addEventListener("click", () => runSearch(inputEl.value));
    inputEl.addEventListener("input", (e) => debouncedSearch(e.target.value));

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            runSearch(inputEl.value);
        }
    });

    gridEl.addEventListener("click", (e) => {
        const btn = e.target.closest('[data-action="toggle-fav"]');
        if (!btn) return;

        const id = btn.getAttribute("data-id");
        const state = store.getState();
        const book = state.books.find((b) => b.id === id);
        if (!book) return;

        const nextFavs = toggleFavorite(state.favorites, book);
        store.setState({ favorites: nextFavs }, "favorites/toggle");
        saveFavorites(nextFavs);
    });

    authorSelectEl.addEventListener("change", (e) => {
        store.setState({ authorFilter: e.target.value }, "filter/author_change");
    });

    statusEl.addEventListener("click", (e) => {
        const btn = e.target.closest("#retryBtn");
        if (!btn) return;
        runSearch(store.getState().query);
    });

    fillAuthorSelect(authorSelectEl, [], "");
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
