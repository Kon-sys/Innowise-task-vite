const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks(query, { limit = 20, signal } = {}) {
    const url = new URL(BASE_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), { signal });

    if (!res.ok) {
        throw new Error(`Open Library error: ${res.status}`);
    }

    return res.json();
}