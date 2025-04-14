import * as baseButton from "./base-button";

type Options = baseButton.Options & { href: string };

export function create(options: Options) {
    const button = <HTMLAnchorElement>baseButton.create(options, true);
    button.href = options.href;
    button.target = "_blank";

    return button;
}
