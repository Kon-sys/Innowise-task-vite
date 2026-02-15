const KEY = "book_catalog_favorites_v1";

export function loadFavorites() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveFavorites(favorites) {
    localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function isFavorite(favorites, bookId) {
    return favorites.some((b) => b.id === bookId);
}

export function toggleFavorite(favorites, book) {
    const exists = favorites.some((b) => b.id === book.id);
    if (exists) {
        return favorites.filter((b) => b.id !== book.id);
    }
    return [{ id: book.id, title: book.title, authors: book.authors, year: book.year }, ...favorites];
}