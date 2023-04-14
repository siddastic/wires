export interface Theme {
    graphBackgroundColor?: string;
    gridColor?: string;
    nodeBackgroundColor?: string;
    nodeDividerColor?: string;
    nodeHoverBorderColor?: string;
    nodeBorderColor?: string;
    textColor?: string;
    statusBarBgColor?: string;
    statusBarItemHoverBgColor?: string;
    statusBarTextColor?: string;

    /* fast design variables */
    designUnit?: string;
    neutralFillInputRest?: string;
}

export class DefaultGraphTheme implements Theme {
    readonly graphBackgroundColor = "#1a1a1a";
    readonly gridColor = "#242424";
    readonly nodeBackgroundColor = "#242424";
    readonly nodeDividerColor = "#1a1a1a";
    readonly nodeHoverBorderColor = "#646cff";
    readonly nodeBorderColor = "#1a1a1a";
    readonly textColor = "#ffffff";
    readonly statusBarBgColor = "#242424";
    readonly statusBarItemHoverBgColor = "#1a1a1a";
    readonly statusBarTextColor = "#ffffff";

    /* fast design variables */
    readonly designUnit = "3";
    readonly neutralFillInputRest = "#3b3b3b";

    constructor() {
        this.applyTheme(this);
    }

    createThemeObject(theme: Theme) {
        return {
            "--graph-background-color": theme.graphBackgroundColor!,
            "--grid-color": theme.gridColor!,
            "--node-background-color": theme.nodeBackgroundColor!,
            "--node-divider-color": theme.nodeDividerColor!,
            "--node-hover-border-color": theme.nodeHoverBorderColor!,
            "--node-border-color": theme.nodeBorderColor!,
            "--text-color": theme.textColor!,
            "--status-bar-bg-color": theme.statusBarBgColor!,
            "--status-bar-item-hover-bg-color":
                theme.statusBarItemHoverBgColor!,
            "--status-bar-text-color": theme.statusBarTextColor!,

            /* fast design variables */
            "--design-unit": theme.designUnit!,
            "--neutral-fill-input-rest": theme.neutralFillInputRest!,
        };
    }

    applyTheme(theme: Theme) {
        var themeObject = this.createThemeObject(theme);
        for (const [key, value] of Object.entries(themeObject)) {
            document.documentElement.style.setProperty(key, value);
        }
    }

    copyWith(override: Theme) {
        return Object.assign({}, this, override);
    }
}
