export type ShortcutDefinition = {
    code: string;
    isCtrl?: boolean;
    isAlt?: boolean;
    isShift?: boolean;
};
export type ShortcutHandler = (event: KeyboardEvent) => void;

const boundShortcuts: { [Key in string]: ShortcutHandler } = {};

function stringifyShortcutDefinition(definition: ShortcutDefinition) {
    // Turn the definition into a string for easy mapping
    // HACK: JS must have a better way to do this
    let definitionKey = `${definition.code}-`;
    if (definition.isCtrl) definitionKey += "C";
    if (definition.isAlt) definitionKey += "A";
    if (definition.isShift) definitionKey += "S";

    return definitionKey;
}

export function bind(definition: ShortcutDefinition, handler: ShortcutHandler) {
    const definitionKey = stringifyShortcutDefinition(definition);

    // Assign handler to stringified shortcut key
    boundShortcuts[definitionKey] = handler;

    return definition;
}

export function unbind(definition: ShortcutDefinition) {
    const definitionKey = stringifyShortcutDefinition(definition);

    // Remove shortcut
    delete boundShortcuts[definitionKey];
}

document.addEventListener("keydown", function (event) {
    // Create a stringified definition key for the current keyboard event
    const definitionKey = stringifyShortcutDefinition({
        code: event.code,
        isCtrl: event.ctrlKey,
        isAlt: event.altKey,
        isShift: event.shiftKey,
    });

    // Attempt to find handler in bound shortcuts
    const handler = boundShortcuts[definitionKey];

    // Call handler if found
    if (handler != null) handler(event);
});
