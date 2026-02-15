export function mapDocToBook(doc) {
    const id = doc.key || `${doc.title}_${(doc.author_name || ["unknown"])[0]}`;

    const title = doc.title || "Untitled";
    const authors = Array.isArray(doc.author_name) ? doc.author_name : [];
    const year = doc.first_publish_year ?? null;

    const coverUrl = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null;

    return { id, title, authors, year, coverUrl };
}

export function normalizeBooks(raw) {
    const docs = Array.isArray(raw?.docs) ? raw.docs : [];
    return docs.map(mapDocToBook);
}
