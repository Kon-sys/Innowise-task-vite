export function renderCatalogGrid(containerEl, books) {
    if (!containerEl) return;

    if (!books.length) {
        containerEl.innerHTML = "";
        return;
    }

    containerEl.innerHTML = books
        .map(
            (b) => `
      <article class="card" data-id="${escapeHtml(b.id)}">
        <div class="cardCover">
          ${
                b.coverUrl
                    ? `<img class="coverImg" src="${b.coverUrl}" alt="Cover" loading="lazy" />`
                    : `<div class="coverStub">No cover</div>`
            }
        </div>
        <div class="cardBody">
          <h3 class="cardTitle">${escapeHtml(b.title)}</h3>
          <p class="cardMeta">${escapeHtml(formatAuthors(b.authors))}</p>
          <p class="cardMeta">${b.year ? `Year: ${b.year}` : "Year: —"}</p>
        </div>
      </article>
    `
        )
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