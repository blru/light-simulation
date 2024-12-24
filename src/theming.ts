export type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

export function getPreference(): Theme {
    const foundPreference = <Theme>localStorage.getItem(THEME_STORAGE_KEY);

    if (foundPreference != null) return foundPreference;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function setPreference(newPreference: Theme) {
    localStorage.setItem(THEME_STORAGE_KEY, newPreference);
    reflectPreference();
}

export function reflectPreference() {
    document.firstElementChild?.setAttribute("data-theme", getPreference());
}

export function togglePreference() {
    setPreference(getPreference() === "dark" ? "light" : "dark");
}

window.addEventListener("load", reflectPreference);

// Handle spontaneous system theme changes
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) =>
        setPreference(isDark ? "dark" : "light"),
    );
