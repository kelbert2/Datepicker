/** Object representation of the modifiable parts of the Datepicker theme. */
// TODO: Write a conversion between the two
export interface DatepickerTheme {
    color: string,
    colorLight?: string,
    onColor?: string,
    onColorLight?: string,

    background?: string,
    neutralLight?: string,
    neutral?: string,
    neutralDark?: string,
    onBackground?: string,
    onNeutralLight?: string,
    onNeutral?: string,

    weekdayRow?: string,
    onWeekdayRow?: string,

    divider?: string,
    labelText?: string,

    buttonBackground?: string,
    onButton?: string,
    buttonBorder?: string,

    hover?: string,
    onHover?: string,
    hoverRange?: string,
    onHoverRange?: string,

    today?: string,

    disabled?: string,
    onDisabled?: string
}

export const DEFAULT_THEME_OBJECT = {
    color: "salmon",
    colorLight: "rgb(250, 186, 160)",
    onColor: "var(--background)",
    onColorLight: "var(--background)",

    background: "white",
    neutralLight: "rgba(0, 0, 0, .2)",
    neutral: "rgba(0, 0, 0, .3)",
    neutralDark: "rgba(0, 0, 0, .4)",
    onBackground: "black",
    onNeutralLight: "var(--on-background)",
    onNeutral: "var(--background)",

    weekdayRow: "var(--background)",
    onWeekdayRow: "var(--neutral)",

    divider: "var(--neutral-light)",
    labelText: "var(--neutral - dark)",

    buttonBackground: "transparent",
    onButton: "var(--neutral - dark)",
    buttonBorder: "none",

    hover: "var(--neutral)",
    onHover: "var(--on-neutral)",
    hoverRange: "var(--neutral-light)",
    onHoverRange: "var(--on-neutral-light)",

    today: "var(--neutral)",

    disabled: "transparent",
    onDisabled: "var(--neutral)"
} as DatepickerTheme;

/** Object representation of datepicker theme with string keys that match the css variables they modify. */
export interface DatepickerThemeStrings {
    "--color"?: string,
    "--color-light"?: string,
    "--on-color"?: string,
    "--on-color-light"?: string,

    "--background"?: string,
    "--neutral-light"?: string,
    "--neutral"?: string,
    "--neutral-dark"?: string,
    "--on-background"?: string,
    "--on-neutral-light"?: string,
    "--on-neutral"?: string,

    "--weekday-row"?: string,
    "--on-weekday-row"?: string,

    "--divider"?: string,
    "--label-text"?: string,

    "--button-background"?: string,
    "--on-button"?: string,
    "--button-border"?: string,

    "--hover"?: string,
    "--on-hover"?: string,
    "--hover-range"?: string,
    "--on-hover-range"?: string,

    "--today"?: string,

    "--disabled"?: string,
    "--on-disabled"?: string,
}

export const DEFAULT_THEME_STRINGS = {
    "--color": "salmon",
    "--color-light": "rgb(250, 186, 160)",
    "--on-color": "var(--background)",
    "--on-color-light": "var(--background)",

    "--background": "white",
    "--neutral-light": "rgba(0, 0, 0, .2)",
    "--neutral": "rgba(0, 0, 0, .3)",
    "--neutral-dark": "rgba(0, 0, 0, .4)",
    "--on-background": "black",
    "--on-neutral-light": "var(--on-background)",
    "--on-neutral": "var(--background)",

    "--weekday-row": "var(--background)",
    "--on-weekday-row": "var(--neutral)",

    "--divider": "var(--neutral-light)",
    "--label-text": "var(--neutral - dark)",

    "--button-background": "transparent",
    "--on-button": "var(--neutral - dark)",
    "--button-border": "none",

    "--hover": "var(--neutral)",
    "--on-hover": "var(--on-neutral)",
    "--hover-range": "var(--neutral-light)",
    "--on-hover-range": "var(--on-neutral-light)",

    "--today": "var(--neutral)",

    "--disabled": "transparent",
    "--on-disabled": "var(--neutral)"
} as DatepickerThemeStrings;

// TODO: Refactor by combining because use together in practice
export const resetTheme = (theme: DatepickerThemeStrings) => {
    let retTheme = {} as DatepickerThemeStrings;
    retTheme["--color"] = theme["--color"] ? theme["--color"] : DEFAULT_THEME_STRINGS["--color"];
    retTheme["--color-light"] =
        theme["--color-light"]
            ? theme["--color-light"]
            : !!addAlpha(theme["--color"], .5)
                ? addAlpha(theme["--color"], .5)
                : DEFAULT_THEME_STRINGS["--color-light"];
    retTheme["--on-color"] =
        theme["--on-color"]
            ? theme["--on-color"]
            : theme["--background"]
                ? theme["--background"]
                : DEFAULT_THEME_STRINGS["--on-color"];
    retTheme["--on-color-light"] =
        theme["--on-color-light"]
            ? theme["--on-color-light"]
            : theme["--on-color"]
                ? theme["--on-color"]
                : theme["--background"]
                    ? theme["--background"]
                    : DEFAULT_THEME_STRINGS["--on-color-light"];

    retTheme["--background"] = theme["--background"] ? theme["--background"] : DEFAULT_THEME_STRINGS["--background"];
    retTheme["--neutral-light"] =
        theme["--neutral-light"]
            ? theme["--neutral-light"]
            : !!addAlpha(retTheme["--neutral"], .2)
                ? addAlpha(retTheme["--neutral"], .2)
                : DEFAULT_THEME_STRINGS["--neutral-light"];
    retTheme["--neutral"] =
        theme["--neutral"]
            ? theme["--neutral"]
            : !!addAlpha(theme["--on-background"], .4)
                ? addAlpha(theme["--on-background"], .4)
                : DEFAULT_THEME_STRINGS["--neutral"];
    retTheme["--neutral-dark"] =
        theme["--neutral-dark"]
            ? theme["--neutral-dark"]
            : !!addAlpha(retTheme["--neutral"], .6)
                ? addAlpha(retTheme["--neutral"], .6)
                : DEFAULT_THEME_STRINGS["--neutral-dark"];
    retTheme["--on-background"] = theme["--on-background"] ? theme["--on-background"] : DEFAULT_THEME_STRINGS["--on-background"];
    retTheme["--on-neutral-light"] =
        theme["--on-neutral-light"]
            ? theme["--on-neutral-light"]
            : theme["--on-background"]
                ? theme["--on-background"]
                : DEFAULT_THEME_STRINGS["--on-neutral-light"];
    retTheme["--on-neutral"] =
        theme["--on-neutral"]
            ? theme["--on-neutral"]
            : theme["--background"]
                ? theme["--background"]
                : DEFAULT_THEME_STRINGS["--on-neutral"];

    retTheme["--weekday-row"] =
        theme["--weekday-row"]
            ? theme["--weekday-row"]
            : theme["--background"]
                ? theme["--background"]
                : DEFAULT_THEME_STRINGS["--weekday-row"];
    retTheme["--on-weekday-row"] =
        theme["--on-weekday-row"]
            ? theme["--on-weekday-row"]
            : retTheme["--neutral"]
                ? retTheme["--neutral"]
                : DEFAULT_THEME_STRINGS["--on-weekday-row"];

    retTheme["--divider"] =
        theme["--divider"]
            ? theme["--divider"]
            : retTheme["--neutral-light"]
                ? retTheme["--neutral-light"]
                : DEFAULT_THEME_STRINGS["--divider"];
    retTheme["--label-text"] =
        theme["--label-text"]
            ? theme["--label-text"]
            : retTheme["--neutral-dark"]
                ? retTheme["--neutral-dark"]
                : DEFAULT_THEME_STRINGS["--label-text"];

    retTheme["--button-background"] = theme["--button-background"] ? theme["--button-background"] : DEFAULT_THEME_STRINGS["--button-background"];
    retTheme["--on-button"] =
        theme["--on-button"]
            ? theme["--on-button"]
            : retTheme["--neutral-dark"]
                ? retTheme["--neutral-dark"]
                : DEFAULT_THEME_STRINGS["--on-button"];
    retTheme["--button-border"] = theme["--button-border"] ? theme["--button-border"] : DEFAULT_THEME_STRINGS["--button-border"];

    retTheme["--hover"] =
        theme["--hover"]
            ? theme["--hover"]
            : retTheme["--neutral"]
                ? retTheme["--neutral"]
                : DEFAULT_THEME_STRINGS["--hover"];
    retTheme["--on-hover"] =
        theme["--on-hover"]
            ? theme["--on-hover"]
            : retTheme["--on-neutral"]
                ? retTheme["--on-neutral"]
                : DEFAULT_THEME_STRINGS["--on-hover"];
    retTheme["--hover-range"] =
        theme["--hover-range"]
            ? theme["--hover-range"]
            : !!addAlpha(retTheme["--hover"], .25)
                ? addAlpha(retTheme["--hover"], .25)
                : retTheme["--neutral-light"]
                    ? retTheme["--neutral-light"]
                    : DEFAULT_THEME_STRINGS["--hover-range"];
    retTheme["--on-hover-range"] =
        theme["--on-hover-range"]
            ? theme["--on-hover-range"]
            : retTheme["--on-neutral-light"]
                ? retTheme["--on-neutral-light"]
                : DEFAULT_THEME_STRINGS["--on-hover-range"];

    retTheme["--today"] =
        theme["--today"]
            ? theme["--today"]
            : retTheme["--neutral"]
                ? retTheme["--neutral"]
                : DEFAULT_THEME_STRINGS["--today"];

    retTheme["--disabled"] = theme["--disabled"] ? theme["--disabled"] : DEFAULT_THEME_STRINGS["--disabled"];
    retTheme["--on-disabled"] =
        theme["--on-disabled"]
            ? theme["--on-disabled"]
            : retTheme["--neutral"]
                ? retTheme["--neutral"]
                : DEFAULT_THEME_STRINGS["--on-disabled"];

    return retTheme;
}

const getCssVariable = (key: string) => {
    return "--" + key.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase());
}

export const makeDatepickerThemeArray = (themeObject: DatepickerTheme) => {
    let array = [] as string[];
    Object.keys(themeObject).forEach((key) => {
        const value = (themeObject as any)[key];
        array.push(getCssVariable(key) + ": " + value);
    });
    return array;
}

export const makeDatepickerThemeArrayFromStrings = (themeObject: DatepickerThemeStrings) => {
    let array = [] as string[];
    Object.keys(themeObject).forEach((key) => {
        const value = (themeObject as any)[key];
        array.push(key + ": " + value);
    });

    return array;
}

const addAlpha = (color: string | undefined, alpha = .5) => {
    if (color == null) return undefined;
    let array = color.split(/[\s,()]+/);
    if (array.length > 2) {
        let prefix: string;
        if (array[0].length < 4) {
            prefix = array[0] + "a(";
        } else {
            prefix = array[0] + "(";
        }
        return prefix + array[1] + "," + array[2] + "," + array[3] + "," + alpha + ")";
    }
    return undefined;
}
/** Creates a datepicker theme around --color, --hover, and --on-background in hsl() or rgb() or anything that can take an alpha when converted to type+a(). Default theme assumes --background and --color have sufficient (legible) contrast with each other and --neutral and --background have sufficient contrast. */
export const makeDatepickerTheme = (themeObject: DatepickerThemeStrings) => {
    let retTheme = themeObject;
    if (themeObject["--color"] && !(themeObject["--color-light"])) {
        // If --color has been changed but --color-light has not, set it to an alpha value of --color
        const lightColor = addAlpha(themeObject["--color"], .5);
        if (lightColor) {
            retTheme["--color-light"] = lightColor;
        }
    }
    if ("--on-color" in themeObject && !("--on-color-light" in themeObject)) {
        retTheme["--on-color-light"] = themeObject["--on-color"];
    }

    if (themeObject["--hover"] && !(themeObject["--hover-range"])) {
        const hoverRange = addAlpha(themeObject["--hover"], .25);
        if (hoverRange) {
            retTheme["--hover-range"] = hoverRange;
        }
    }

    if ("--on-background" in themeObject) {
        // if on-background has changed, can assume that all values that appear on the background now do not have the desired contrast, so need to reset them
        if (!("--neutral" in themeObject)) {
            const neutral = addAlpha(themeObject["--on-background"], .4);
            if (neutral) {
                retTheme["--neutral"] = neutral;
            }
        }
        if (!("--on-neutral-light" in themeObject)) {
            retTheme["--on-neutral-light"] = themeObject["--on-background"];
        }
        if ("--neutral" in retTheme) {
            if (!("--neutral-light" in themeObject)) {
                const neutralLight = addAlpha(retTheme["--neutral"], .2);
                if (neutralLight) {
                    retTheme["--neutral-light"] = neutralLight;
                }
            }
            if (!("--neutral-dark" in themeObject)) {
                const neutralDark = addAlpha(retTheme["--neutral"], .6);
                if (neutralDark) {
                    retTheme["--neutral-dark"] = neutralDark;
                }
            }
        }
    }

    if ("--background" in themeObject) {
        if (!("--on-color" in themeObject)) {
            retTheme["--on-color"] = themeObject["--background"];
        }
        if (!("--on-color-light" in themeObject)) {
            if ("--on-color" in themeObject) {
                retTheme["--on-color-light"] = themeObject["--on-color"];
            } else {
                retTheme["--on-color-light"] = themeObject["--background"];
            }
        }
        if (!("--on-neutral" in themeObject)) {
            retTheme["--on-neutral"] = themeObject["--background"];
        }
        if (!("--weekday-row" in themeObject)) {
            retTheme["--weekday-row"] = themeObject["--background"];
        }
    }

    if ("--neutral" in retTheme) {
        if (!("--on-weekday-row" in themeObject)) {
            retTheme["--on-weekday-row"] = retTheme["--neutral"];
        }
        if (!("--hover" in themeObject)) {
            retTheme["--hover"] = retTheme["--neutral"];
        }
        if (!("--today" in themeObject)) {
            retTheme["--today"] = retTheme["--neutral"];
        }
        if (!("--on-disabled" in themeObject)) {
            retTheme["--on-disabled"] = retTheme["--neutral"];
        }
    }
    if ("--neutral-light" in retTheme) {
        if (!("--divider" in themeObject)) {
            retTheme["--divider"] = retTheme["--neutral-light"];
        }
        if (!("--hover-range" in themeObject)) {
            retTheme["--hover-range"] = retTheme["--neutral-light"];
        }
    }
    if ("--neutral-dark" in retTheme) {
        if (!("--label-text" in themeObject)) {
            retTheme["--label-text"] = retTheme["--neutral-dark"];
        }
        if (!("--on-button" in themeObject)) {
            retTheme["--on-button"] = retTheme["--neutral-dark"];
        }
    }
    if ("--on-neutral" in retTheme && !("--on-hover" in themeObject)) {
        retTheme["--on-hover"] = retTheme["--on-neutral"];
    }
    if ("--on-neutral-light" in retTheme && !("--on-hover-range" in themeObject)) {
        retTheme["--on-hover-range"] = retTheme["--on-neutral-light"];
    }

    return retTheme;
}