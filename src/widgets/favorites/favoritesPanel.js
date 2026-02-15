export function renderFavoritesPanel(containerEl, favorites) {
    if (!containerEl) return;

    if (!favorites.length) {
        containerEl.innerHTML = `<span class="muted">No favorites yet</span>`;
        return;
    }

    containerEl.innerHTML = `
    <ul class="favList">
      ${favorites
        .map(
            (b) => `
        <li class="favItem" data-id="${escapeHtml(b.id)}">
          <div class="favTitle">${escapeHtml(b.title)}</div>
          <div class="favMeta">${escapeHtml(formatAuthors(b.authors))}${b.year ? ` • ${b.year}` : ""}</div>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

function formatAuthors(authors) {
    if (!authors || !authors.length) return "—";
    return authors.slice(0, 2).join(", ") + (authors.length > 2 ? "…" : "");
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}