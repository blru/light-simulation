import { ShortcutDefinition } from "src/shortcuts";

export type GridPreferences = {
    spacingX: number;
    spacingY: number;
    subSpacingX: number;
    subSpacingY: number;
};
export type ColorPreferences = Record<
    | "grid"
    | "gridSub"
    | "rayToolPreview"
    | "selection"
    | "medium"
    | "source"
    | "ray"
    | "sourceRayPreview"
    | "background",
    string
>;
export type ParameterPreferences = {
    lightSpeed: number;
    showRayArrowHeads: boolean;
};
export type SnappingPreferences = {
    scaling: number;
    offsetting: number;
    angling: number;
};
export type ShortcutPreferences = Record<
    | "cut"
    | "copy"
    | "paste"
    | "delete"
    | "selectAll"
    | "selectDragTool"
    | "selectSelectTool"
    | "selectRayTool"
    | "selectLightSourceTool"
    | "selectMediumTool"
    | "toggleRunning",
    ShortcutDefinition
>;

const PREFERENCES_STORAGE_KEY = "preferences";

export const grid: GridPreferences = {
    spacingX: 250,
    spacingY: 250,
    subSpacingX: 50,
    subSpacingY: 50,
};

// Future initialization will occur
export const colors: Partial<ColorPreferences> = {};

export const parameters: ParameterPreferences = {
    lightSpeed: 200,
    showRayArrowHeads: true,
};

export const snappings: SnappingPreferences = {
    scaling: 25,
    offsetting: 25,
    angling: Math.PI / 12,
};

export const shortcuts: ShortcutPreferences = {
    cut: {
        code: "KeyX",
        isCtrl: true,
    },
    copy: {
        code: "KeyC",
        isCtrl: true,
    },
    paste: {
        code: "KeyV",
        isCtrl: true,
    },
    delete: {
        code: "Backspace",
    },
    selectAll: {
        isCtrl: true,
        code: "KeyA",
    },
    selectDragTool: {
        code: "Digit1",
    },
    selectSelectTool: {
        code: "Digit2",
    },
    selectRayTool: {
        code: "Digit3",
    },
    selectLightSourceTool: {
        code: "Digit4",
    },
    selectMediumTool: {
        code: "Digit5",
    },
    toggleRunning: {
        code: "Space",
    },
};

/**
 * Updates the `colors` preference with colors from css variables
 */
export function refreshColors() {
    const getPropertyValue = (key: string) =>
        window.getComputedStyle(document.body).getPropertyValue(key);

    colors.grid = getPropertyValue("--grid").toString();
    colors.gridSub = getPropertyValue("--grid-sub").toString();
    colors.rayToolPreview = getPropertyValue("--ray-tool-preview").toString();
    colors.medium = getPropertyValue("--medium").toString();
    colors.source = getPropertyValue("--source").toString();
    colors.sourceRayPreview = getPropertyValue(
        "--source-ray-preview",
    ).toString();
    colors.ray = getPropertyValue("--ray").toString();
    colors.selection = getPropertyValue("--selection").toString();
    colors.background = getPropertyValue("--background-primary").toString();
}

/**
 * Loads the preferences from local storage.
 */
export function load() {
    let serializedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);

    if (serializedPreferences == null) return;

    // If saved preferences were found, overwrite the defaults
    let preferences = JSON.parse(serializedPreferences);
    Object.assign(grid, preferences.grid);
    Object.assign(parameters, preferences.parameters);
    Object.assign(snappings, preferences.snappings);
    Object.assign(shortcuts, preferences.snappings);
}

/**
 * Stores the preferences to local storage
 */
export function persist() {
    let serializedPreferences = JSON.stringify({
        grid,
        parameters,
        snappings,
        shortcuts,
    });

    localStorage.setItem(PREFERENCES_STORAGE_KEY, serializedPreferences);
}

document.addEventListener("load", load);

export const Preferences = {
    reflectTheme: refreshColors,
    load,
    persist,
    colors,
    grid,
    parameters,
    snappings,
    shortcuts,
} as const;
