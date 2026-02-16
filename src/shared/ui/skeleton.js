export function renderSkeletonGrid(containerEl, count = 9) {
    if (!containerEl) return;

    containerEl.innerHTML = Array.from({ length: count })
        .map(
            () => `
      <div class="sCard" aria-hidden="true">
        <div class="sCover"></div>
        <div class="sBody">
          <div class="sLine sLine--lg"></div>
          <div class="sLine"></div>
          <div class="sLine sLine--sm"></div>
        </div>
      </div>
    `
        )
        .join("");
}