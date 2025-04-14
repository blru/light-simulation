import * as baseButton from "./base-button";

type Options = baseButton.Options & { handleClick: () => boolean };

export function create(options: Options) {
    const button = <HTMLButtonElement>baseButton.create(options, false);
    button.addEventListener("click", () => {
        const shouldCloseMenu = options.handleClick(); // Call click handler and use return value to determine if menu should be closed

        if (shouldCloseMenu) close();
    });

    return button;
}
