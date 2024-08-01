// Based off this - https://wunnle.com/dynamic-text-color-based-on-background

/**
 *
 * @param f --> Foreground colour
 * @param b --> Background colour
 * @returns --> Contrast ratio between the two colours
 */
export const getContrast = (f: string, b: string): number => {
    const L1 = getLuminance(f);
    const L2 = getLuminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
/**
 *
 * @param hexColor --> Hex colour string to determine luminance for
 * @returns --> visual luminance of colour
 */
export const getLuminance = (hexColor: string): number => {
    return (
        0.2126 * getsRGB(hexColor?.substr(1, 2)) +
        0.7152 * getsRGB(hexColor?.substr(3, 2)) +
        0.0722 * getsRGB(hexColor?.substr(-2))
    );
};
/**
 *
 * @param c --> Hex colour substring for red/blue/green channels
 * @returns --> sRGB value for the channel
 */
export const getsRGB = (c: string): number => {
    return parseInt(c, 16) / 255 <= 0.03928
        ? parseInt(c, 16) / 255 / 12.92
        : Math.pow((parseInt(c, 16) / 255 + 0.055) / 1.055, 2.4);
};

/**
 *
 * @param r --> red value from RGB
 * @param g --> green value from RGB
 * @param b --> blue value from RGB
 * @param lighten --> boolean to determine if the colour should be lightened or darkened
 * @returns --> HSL colour value with forced lightness
 */
export const RGBToHSL = (r: number, g: number, b: number, lighten: boolean): string => {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    const cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin;
    let h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta === 0) h = 0;
    // Red is max
    else if (cmax === r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    h = lighten ? h + 15 : h - 15 > 0 ? h - 15 : h;
    l = lighten ? 98 : 2;

    return "hsl(" + h + "," + s + "%," + l + "%)";
};

export const determineBestContrast = (bgColour = "#ffffff"): "Light" | "Dark" => {
    const r = getsRGB(bgColour?.substr(1, 2));
    const g = getsRGB(bgColour?.substr(3, 2));
    const b = getsRGB(bgColour?.substr(-2));

    const lightHSL = RGBToHSL(r, g, b, true);
    const darkHSL = RGBToHSL(r, g, b, false);

    const whiteContrast = getContrast(hslToHex(lightHSL), bgColour);
    const blackContrast = getContrast(hslToHex(darkHSL), bgColour);
    return whiteContrast > blackContrast ? "Light" : "Dark";
};

/**
 *
 * @param bgColour --> Background colour to determine text colour for
 * @returns --> Text colour to use for the background colour as HSL string
 */
export const determineTextColour = (bgColour = "#ffffff"): string => {
    const r = getsRGB(bgColour?.substr(1, 2));
    const g = getsRGB(bgColour?.substr(3, 2));
    const b = getsRGB(bgColour?.substr(-2));

    const bestContrast = determineBestContrast(bgColour);
    return bestContrast === "Light" ? RGBToHSL(r, g, b, true) : RGBToHSL(r, g, b, false);
};

export const hslToHex = (hsl: string): string => {
    const h = Number(
        hsl
            .replace(/[a-z]{3}\(/g, "")
            .replace(/\)/g, "")
            .split(",")[0]
    );
    const s = Number(
        hsl
            .replace(/[a-z]{3}\(/g, "")
            .replace(/\)/g, "")
            .split(",")[1]
            .replace("%", "")
    );
    let l = Number(
        hsl
            .replace(/[a-z]{3}\(/g, "")
            .replace(/\)/g, "")
            .split(",")[2]
            .replace("%", "")
    );
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};
