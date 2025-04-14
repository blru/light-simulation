export type Property = ValueProperty | SubProperty;

// Property of properties

export type SubProperty = {
    kind: "sub_property";
    getProperties: () => Property[];
} & BaseProperty;

// The value properties

export type ValueProperty =
    | BooleanProperty
    | NumberProperty
    | StringListProperty;

type BooleanProperty = { kind: "boolean" } & BaseValueProperty<boolean>;
type NumberProperty = { kind: "number" } & BaseValueProperty<number>;
type StringListProperty = {
    kind: "string_list";
    choices: string[];
} & BaseValueProperty<string>;

// Bases

type BaseValueProperty<T> = {
    get: () => T;
    set: (newValue: T) => void;
} & BaseProperty;

type BaseProperty = {
    label: string;
};
