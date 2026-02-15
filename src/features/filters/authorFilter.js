export function getUniqueAuthors(books) {
    const set = new Set();

    for (const b of books) {
        if (!b?.authors?.length) continue;
        for (const a of b.authors) {
            const name = String(a || "").trim();
            if (name) set.add(name);
        }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function applyAuthorFilter(books, author) {
    const a = String(author || "").trim();
    if (!a) return books;

    return books.filter((b) => Array.isArray(b.authors) && b.authors.includes(a));
}

export function fillAuthorSelect(selectEl, authors, currentValue = "") {
    if (!selectEl) return;

    const safe = (s) =>
        String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    const options = [
        `<option value="">All</option>`,
        ...authors.map((a) => `<option value="${safe(a)}">${safe(a)}</option>`)
    ];

    selectEl.innerHTML = options.join("");
    selectEl.value = currentValue || "";
    selectEl.disabled = authors.length === 0;
}