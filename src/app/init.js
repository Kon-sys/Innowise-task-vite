import { renderLayout } from "./layout";
import { qs } from "../shared/dom";
import { createStore } from "../shared/store";

export function initApp() {
    const root = qs("#app");
    if (!root) throw new Error("Root element #app not found");

    renderLayout(root);

    const store = createStore({
        query: "",
        status: "idle", // idle | loading | success | empty | error
        errorMessage: ""
    });

    const statusEl = qs("#status");
    const inputEl = qs("#searchInput");
    const btnEl = qs("#searchBtn");

    function render(state) {
        if (!statusEl) return;

        if (state.status === "idle") {
            statusEl.innerHTML = `<span class="muted">Type a query and press Search</span>`;
            return;
        }

        if (state.status === "loading") {
            statusEl.textContent = `Loading results for "${state.query}"...`;
            return;
        }

        if (state.status === "error") {
            statusEl.textContent = state.errorMessage || "Something went wrong";
            return;
        }

        statusEl.textContent = `Done: "${state.query}" (stub)`;
    }

    render(store.getState());

    store.subscribe((nextState, prevState, action) => {
        render(nextState);
    });

    btnEl.addEventListener("click", () => {
        const q = inputEl.value.trim();

        if (!q) {
            store.setState({ query: "", status: "idle", errorMessage: "" }, "search/empty");
            return;
        }

        store.setState({ query: q, status: "loading", errorMessage: "" }, "search/start");

        // пока заглушка: имитируем "готово" через таймер (чтобы увидеть смену стейтов)
        setTimeout(() => {
            store.setState({ status: "success" }, "search/success_stub");
        }, 500);
    });
}