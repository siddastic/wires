export interface Theme {
    primaryColor?: string;
    accentFillColor?: string;
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
    inputBaseColor?: string;
    inputHoverColor?: string;
}

export class DefaultGraphTheme implements Theme {
    readonly primaryColor = "#2eaa56";
    readonly accentFillColor = "#646cff";
    readonly graphBackgroundColor = "#1a1a1a";
    readonly gridColor = "#242424";
    readonly nodeBackgroundColor = "#242424";
    readonly nodeDividerColor = "#1a1a1a";
    readonly nodeHoverBorderColor = "#646cff";
    readonly nodeBorderColor = "black";
    readonly textColor = "#ffffff";
    readonly statusBarBgColor = "#242424";
    readonly statusBarItemHoverBgColor = "#1a1a1a";
    readonly statusBarTextColor = "#ffffff";

    /* fast design variables */
    readonly designUnit = "3";
    readonly inputBaseColor = "#1a1a1a";
    readonly inputHoverColor = "#1a1a1a";

    uninheritableStylesheet = document.createElement("style");

    constructor() {
        this.applyTheme(this);

        document.head.appendChild(this.uninheritableStylesheet);
    }

    createThemeObject(theme: Theme) {
        return {
            "--primary-color": theme.primaryColor!,
            "--accent-fill-rest": theme.accentFillColor!,
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
            "--neutral-fill-input-rest": theme.inputBaseColor!,
            "--neutral-fill-input-hover": theme.inputHoverColor!,
        };
    }

    applyTheme(theme: Theme) {
        var themeObject = this.createThemeObject(theme);
        for (const [key, value] of Object.entries(themeObject)) {
            document.documentElement.style.setProperty(key, value);
        }

        this.applyUninheritableTheme(theme);
    }

    copyWith(override: Theme) {
        return Object.assign({}, this, override);
    }

    private applyUninheritableTheme(theme: Theme) {
        // these styles are defined separately because for some reason they don't inherit from the root
        const styles = `
        wires-option{
            padding-left: 7px;
            background-color: ${theme.inputBaseColor};
            opacity: 0.75;
        }

        wires-option:hover {
            opacity: 1;
        }

        wires-combobox::part(listbox){
            background-color: ${theme.inputBaseColor};
        }

        wires-combobox{
            --design-unit : ${theme.designUnit};
            --neutral-fill-input-rest: ${theme.inputBaseColor};
            --neutral-fill-input-hover: ${theme.inputHoverColor};
            min-width: unset;
        }
        
        wires-switch{
            --accent-fill-rest: ${theme.primaryColor};
            --accent-fill-hover: ${theme.primaryColor};
            --accent-fill-active: ${theme.primaryColor};
        }

        wires-switch::part(switch){
            border:none;
        }

        wires-select{
            --design-unit : ${theme.designUnit};
            --neutral-fill-input-rest: ${theme.inputBaseColor};
            --neutral-fill-input-hover: ${theme.inputHoverColor};
            min-width: unset;
        }

        wires-select::part(listbox){
            background-color: ${theme.inputBaseColor};
        }
        `;

        this.uninheritableStylesheet.innerHTML = styles;
    }
}
