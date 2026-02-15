export function debounce(fn, delayMs = 300) {
    let timerId = null;

    return function debounced(...args) {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, args), delayMs);
    };
}