export function createStore(initialState) {

    let state = structuredCloneSafe(initialState);
    const listeners = new Set();

    function getState() {
        return state;
    }

    function setState(patch, action = "unknown") {
        const prev = state;
        const next = { ...prev, ...patch };

        if (shallowEqual(prev, next)) return;

        state = next;
        for (const fn of listeners) fn(state, prev, action);
    }

    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    return { getState, setState, subscribe };
}

function shallowEqual(a, b) {
    if (a === b) return true;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
        if (a[k] !== b[k]) return false;
    }
    return true;
}

function structuredCloneSafe(obj) {
    if (typeof structuredClone === "function") return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
}