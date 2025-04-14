export type ShortcutDefinition = {
    code: string;
    isCtrl?: boolean;
    isAlt?: boolean;
    isShift?: boolean;
};
export type ShortcutBinding = {
    handler: ShortcutHandler;
} & ShortcutOptions;
export type ShortcutOptions = { description?: string };
export type ShortcutHandler = (event: KeyboardEvent) => void;

const boundShortcuts: { [key: string]: ShortcutBinding } = {};

function serializeDefinition(definition: ShortcutDefinition) {
    // Turn the definition into a string for easy mapping
    // HACK: JS must have a better way to do this
    let definitionKey = `${definition.code}-`;
    if (definition.isCtrl) definitionKey += "C";
    if (definition.isAlt) definitionKey += "A";
    if (definition.isShift) definitionKey += "S";

    return definitionKey;
}

export function getHumanReadableDefinition(definition: ShortcutDefinition) {
    let humanReadable = "";
    if (definition.isCtrl) humanReadable += "Ctrl + ";
    if (definition.isAlt) humanReadable += "Alt + ";
    if (definition.isShift) humanReadable += "Shift + ";

    if (
        definition.code.startsWith("Digit") ||
        definition.code.startsWith("Key")
    ) {
        // HACK: Get the key from the code, very bad method.
        humanReadable +=
            definition.code[definition.code.length - 1].toUpperCase();
    } else {
        humanReadable += definition.code;
    }

    return humanReadable;
}

export function bind(
    definition: ShortcutDefinition,
    handler: ShortcutHandler,
    options: ShortcutOptions = {},
) {
    const definitionKey = serializeDefinition(definition);

    // Assign handler to serialized shortcut key
    boundShortcuts[definitionKey] = { handler, ...options };

    return definition;
}

export function unbind(definition: ShortcutDefinition) {
    const definitionKey = serializeDefinition(definition);

    // Remove shortcut
    delete boundShortcuts[definitionKey];
}

document.addEventListener("keydown", function (event) {
    const active = document.activeElement;
    const isInputFocused =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement;
    if (isInputFocused) return; // if a text field is focused, don't do shortcuts

    // Create a stringified definition key for the current keyboard event
    const definitionKey = serializeDefinition({
        code: event.code,
        isCtrl: event.ctrlKey,
        isAlt: event.altKey,
        isShift: event.shiftKey,
    });

    // Attempt to find a bound handler in bound shortcuts
    const handler = boundShortcuts[definitionKey]?.handler;

    // Do nothing if handler isn't found
    if (handler == null) return;

    event.preventDefault();
    handler(event);
});

export const Shortcuts = {
    bind,
    unbind,
    getHumanReadableDefinition,
} as const;
