export function renderCatalogGrid(containerEl, books, favorites = []) {
    if (!containerEl) return;

    const favSet = new Set(favorites.map((f) => f.id));

    if (!books.length) {
        containerEl.innerHTML = "";
        return;
    }

    containerEl.innerHTML = books
        .map((b) => {
            const isFav = favSet.has(b.id);

            return `
      <article class="card" data-id="${escapeHtml(b.id)}">
        <div class="cardCover">
          ${
                b.coverUrl
                    ? `<img class="coverImg" src="${b.coverUrl}" alt="Cover" loading="lazy" />`
                    : `<div class="coverStub">No cover</div>`
            }
        </div>

        <div class="cardBody">
          <div class="cardTopRow">
            <h3 class="cardTitle">${escapeHtml(b.title)}</h3>
            <button
              class="favBtn ${isFav ? "isFav" : ""}"
              type="button"
              data-action="toggle-fav"
              data-id="${escapeHtml(b.id)}"
              aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}"
            >
              ${isFav ? "★" : "☆"}
            </button>
          </div>

          <p class="cardMeta">${escapeHtml(formatAuthors(b.authors))}</p>
          <p class="cardMeta">${b.year ? `Year: ${b.year}` : "Year: —"}</p>
        </div>
      </article>
    `;
        })
        .join("");
}

function formatAuthors(authors) {
    if (!authors || !authors.length) return "Author: —";
    return `Author: ${authors.slice(0, 2).join(", ")}${authors.length > 2 ? "…" : ""}`;
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}