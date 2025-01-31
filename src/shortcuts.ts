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

function serializeShortcutDefinition(definition: ShortcutDefinition) {
    // Turn the definition into a string for easy mapping
    // HACK: JS must have a better way to do this
    let definitionKey = `${definition.code}-`;
    if (definition.isCtrl) definitionKey += "C";
    if (definition.isAlt) definitionKey += "A";
    if (definition.isShift) definitionKey += "S";

    return definitionKey;
}

export function bind(
    definition: ShortcutDefinition,
    handler: ShortcutHandler,
    options: ShortcutOptions = {},
) {
    const definitionKey = serializeShortcutDefinition(definition);

    // Assign handler to serialized shortcut key
    boundShortcuts[definitionKey] = { handler, ...options };

    return definition;
}

export function unbind(definition: ShortcutDefinition) {
    const definitionKey = serializeShortcutDefinition(definition);

    // Remove shortcut
    delete boundShortcuts[definitionKey];
}

document.addEventListener("keydown", function (event) {
    // Create a stringified definition key for the current keyboard event
    const definitionKey = serializeShortcutDefinition({
        code: event.code,
        isCtrl: event.ctrlKey,
        isAlt: event.altKey,
        isShift: event.shiftKey,
    });

    // Attempt to find a bound handler in bound shortcuts
    const handler = boundShortcuts[definitionKey]?.handler;

    // Call handler if found
    if (handler != null) handler(event);
});
