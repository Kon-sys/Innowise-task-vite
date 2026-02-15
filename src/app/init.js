import { renderLayout } from "./layout";
import { qs } from "../shared/dom";
import { createStore } from "../shared/store";
import { searchBooks } from "../shared/api/openLibrary";
import { normalizeBooks } from "../entities/book/model";
import { renderCatalogGrid } from "../widgets/catalog/catalogGrid";
import { debounce } from "../shared/lib/debounce";

export function initApp() {
    const root = qs("#app");
    if (!root) throw new Error("Root element #app not found");

    renderLayout(root);

    const store = createStore({
        query: "",
        status: "idle", // idle/loading/success/empty/error
        errorMessage: "",
        books: []
    });

    const statusEl = qs("#status");
    const inputEl = qs("#searchInput");
    const btnEl = qs("#searchBtn");
    const gridEl = qs("#grid");

    function render(state) {
        if (state.status === "idle") {
            statusEl.innerHTML = `<span class="muted">Type a query and start typing</span>`;
        } else if (state.status === "loading") {
            statusEl.textContent = `Loading results for "${state.query}"...`;
        } else if (state.status === "empty") {
            statusEl.textContent = `No results for "${state.query}". Try another query.`;
        } else if (state.status === "error") {
            statusEl.textContent = state.errorMessage || "Something went wrong";
        } else {
            statusEl.textContent = `Found ${state.books.length} books for "${state.query}"`;
        }

        renderCatalogGrid(gridEl, state.books);
    }

    render(store.getState());
    store.subscribe((next) => render(next));

    let currentController = null;

    async function runSearch(query, { silent = false } = {}) {
        const q = query.trim();

        if (!q) {
            store.setState({ query: "", status: "idle", errorMessage: "", books: [] }, "search/reset");
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
                store.setState({ status: "empty", books: [] }, "search/empty_result");
            } else {
                store.setState({ status: "success", books }, "search/success");
            }
        } catch (err) {
            if (err?.name === "AbortError") return;

            store.setState(
                { status: "error", errorMessage: err?.message || "Network error", books: [] },
                "search/error"
            );
        }
    }

    const debouncedSearch = debounce((q) => {
        runSearch(q, { silent: true });
    }, 400);

    btnEl.addEventListener("click", () => runSearch(inputEl.value));

    inputEl.addEventListener("input", (e) => {
        debouncedSearch(e.target.value);
    });

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            runSearch(inputEl.value);
        }
    });
}