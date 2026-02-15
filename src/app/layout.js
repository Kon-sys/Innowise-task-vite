export function renderLayout(rootEl) {
    rootEl.innerHTML = `
    <div class="app">
      <header class="header">
        <div class="brand">
          <h1 class="title">Book Catalog</h1>
          <p class="subtitle">Open Library search • Vanilla JS</p>
        </div>

        <button id="themeBtn" class="btn btn-ghost" type="button" aria-label="Toggle theme">
          Theme
        </button>
      </header>

      <section class="controls">
        <div class="search">
          <input id="searchInput" class="input" type="text" placeholder="Search books..." />
          <button id="searchBtn" class="btn" type="button">Search</button>
        </div>

        <div class="filters">
          <label class="label">
            Author
            <select id="authorSelect" class="select" disabled>
              <option value="">All</option>
            </select>
          </label>
        </div>
      </section>

      <section id="status" class="status">
        <span class="muted">Type a query and press Search</span>
      </section>

      <main class="main">
        <div id="grid" class="grid"></div>

        <aside class="favorites">
          <h2 class="h2">Favorites</h2>
          <div id="favorites" class="favoritesList">
            <span class="muted">No favorites yet</span>
          </div>
        </aside>
      </main>
    </div>
  `;
}