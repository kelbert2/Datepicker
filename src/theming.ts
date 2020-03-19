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


export const resetTheme = (theme: DatepickerThemeStrings) => {
    let retTheme = {} as DatepickerThemeStrings;
    retTheme["--color"] = theme["--color"] ? theme["--color"] : DEFAULT_THEME_STRINGS["--color"];
    retTheme["--color-light"] = theme["--color-light"] ? theme["--color-light"] : DEFAULT_THEME_STRINGS["--color-light"];
    retTheme["--on-color"] = theme["--on-color"] ? theme["--on-color"] : DEFAULT_THEME_STRINGS["--on-color"];
    retTheme["--on-color-light"] = theme["--on-color-light"] ? theme["--on-color-light"] : DEFAULT_THEME_STRINGS["--on-color-light"];

    retTheme["--background"] = theme["--background"] ? theme["--background"] : DEFAULT_THEME_STRINGS["--background"];
    retTheme["--neutral-light"] = theme["--neutral-light"] ? theme["--neutral-light"] : DEFAULT_THEME_STRINGS["--neutral-light"];
    retTheme["--neutral"] = theme["--neutral"] ? theme["--neutral"] : DEFAULT_THEME_STRINGS["--neutral"];
    retTheme["--neutral-dark"] = theme["--neutral-dark"] ? theme["--neutral-dark"] : DEFAULT_THEME_STRINGS["--neutral-dark"];
    retTheme["--on-background"] = theme["--on-background"] ? theme["--on-background"] : DEFAULT_THEME_STRINGS["--on-background"];
    retTheme["--on-neutral-light"] = theme["--on-neutral-light"] ? theme["--on-neutral-light"] : DEFAULT_THEME_STRINGS["--on-neutral-light"];
    retTheme["--on-neutral"] = theme["--on-neutral"] ? theme["--on-neutral"] : DEFAULT_THEME_STRINGS["--on-neutral"];

    retTheme["--weekday-row"] = theme["--weekday-row"] ? theme["--weekday-row"] : DEFAULT_THEME_STRINGS["--weekday-row"];
    retTheme["--on-weekday-row"] = theme["--on-weekday-row"] ? theme["--on-weekday-row"] : DEFAULT_THEME_STRINGS["--on-weekday-row"];

    retTheme["--divider"] = theme["--divider"] ? theme["--divider"] : DEFAULT_THEME_STRINGS["--divider"];
    retTheme["--label-text"] = theme["--label-text"] ? theme["--label-text"] : DEFAULT_THEME_STRINGS["--label-text"];

    retTheme["--button-background"] = theme["--button-background"] ? theme["--button-background"] : DEFAULT_THEME_STRINGS["--button-background"];
    retTheme["--on-button"] = theme["--on-button"] ? theme["--on-button"] : DEFAULT_THEME_STRINGS["--on-button"];
    retTheme["--button-border"] = theme["--button-border"] ? theme["--button-border"] : DEFAULT_THEME_STRINGS["--button-border"];

    retTheme["--hover"] = theme["--hover"] ? theme["--hover"] : DEFAULT_THEME_STRINGS["--hover"];
    retTheme["--on-hover"] = theme["--on-hover"] ? theme["--on-hover"] : DEFAULT_THEME_STRINGS["--on-hover"];
    retTheme["--hover-range"] = theme["--hover-range"] ? theme["--hover-range"] : DEFAULT_THEME_STRINGS["--hover-range"];
    retTheme["--on-hover-range"] = theme["--on-hover-range"] ? theme["--on-hover-range"] : DEFAULT_THEME_STRINGS["--on-hover-range"];

    retTheme["--today"] = theme["--today"] ? theme["--today"] : DEFAULT_THEME_STRINGS["--today"];

    retTheme["--disabled"] = theme["--disabled"] ? theme["--disabled"] : DEFAULT_THEME_STRINGS["--disabled"];
    retTheme["--on-disabled"] = theme["--on-disabled"] ? theme["--on-disabled"] : DEFAULT_THEME_STRINGS["--on-disabled"];

    return retTheme;
}