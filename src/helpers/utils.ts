export const harmonies = {
    triad: [120, 240],
    tetradic: [60, 180, 240],
    complementary: [180],
    analogous: [-30, 30],
    square: [90, 180, 270]
} as const;

export const xy2polar = (x: number, y: number): [number, number] => {
    const r = Math.sqrt(x * x + y * y);
    const phi = Math.atan2(y, x);
    return [r, phi];
};

export const polar2xy = (r: number, phi: number): [number, number] => {
    const x = r * Math.cos(phi);
    const y = r * Math.sin(phi);
    return [x, y];
};

export const rad2deg = (rad: number) => {
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
};

export const deg2rad = (hue: number) => {
    return hue * (Math.PI / 180);
};

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
// See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
export const hsv2rgb = (
    hue: number,
    saturation: number,
    value: number
): [number, number, number] => {
    const chroma = value * saturation;
    const hue1 = hue / 60;
    const x = chroma * (1 - Math.abs((hue1 % 2) - 1));
    let r1 = 0,
        g1 = 0,
        b1 = 0;
    if (hue1 >= 0 && hue1 <= 1) {
        [r1, g1, b1] = [chroma, x, 0];
    } else if (hue1 >= 1 && hue1 <= 2) {
        [r1, g1, b1] = [x, chroma, 0];
    } else if (hue1 >= 2 && hue1 <= 3) {
        [r1, g1, b1] = [0, chroma, x];
    } else if (hue1 >= 3 && hue1 <= 4) {
        [r1, g1, b1] = [0, x, chroma];
    } else if (hue1 >= 4 && hue1 <= 5) {
        [r1, g1, b1] = [x, 0, chroma];
    } else if (hue1 >= 5 && hue1 <= 6) {
        [r1, g1, b1] = [chroma, 0, x];
    }

    const m = value - chroma;
    const [r, g, b] = [r1 + m, g1 + m, b1 + m];

    // Change r,g,b values from [0,1] to [0,255]
    return [255 * r, 255 * g, 255 * b];
};

export const xy2rgb = (x: number, y: number, radius: number) => {
    x -= radius;
    y -= radius;

    const [r, phi] = xy2polar(x, y);

    const hue = rad2deg(phi);
    const saturation = r / radius;
    const value = 1.0;

    return hsv2rgb(hue, saturation, value);
};

export const hsv2xy = (hue: number, saturation: number, value: number, radius: number) => {
    const adjustedHue = hue - 180;
    const [r, phi] = polar2xy(radius * saturation, deg2rad(adjustedHue));
    return {
        x: r + radius,
        y: phi + radius
    };
};

export const hsl2rgb = (hue: number, saturation: number, lightness: number): Array<number> => {
    saturation /= 100;
    lightness /= 100;
    const C = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const X = C * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness - C / 2;
    let [R, G, B] = (0 <= hue && hue < 60 && [C, X, 0]) ||
        (60 <= hue && hue < 120 && [X, C, 0]) ||
        (120 <= hue && hue < 180 && [0, C, X]) ||
        (180 <= hue && hue < 240 && [0, X, C]) ||
        (240 <= hue && hue < 300 && [X, 0, C]) ||
        (300 <= hue && hue < 360 && [C, 0, X]) || [0, 0, 0];
    [R, G, B] = [(R + m) * 255, (G + m) * 255, (B + m) * 255];
    return [Math.round(R), Math.round(G), Math.round(B)];
};

export const rgbToLuminance = (r: number, g: number, b: number): number => {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

/**
 * Convert an RGB String into a HEX Color String
 * @param rgbString the RGB String to be Converted to HEX
 * @returns The HEX Color Value for the RGB String
 */
export const rgbToHex = (rgbString: string): string => {
    return (
        "#" +
        rgbString
            .split(new RegExp("[\\s,]{1,}", "g"))
            .map((v) => v.trim())
            .filter((v) => String(v).length > 0)
            .map((v) => Number(v).toString(16).padStart(2, "0"))
            .join("")
    );
};

export const hsl2hsv = (h: number, s: number, l: number): [number, number, number] => {
    const v = l + s * Math.min(l, 1 - l);
    const sv = v === 0 ? 0 : 2 * (1 - l / v);
    return [h, sv * 100, v * 100];
};

export const hsv2hsl = (h: number, s: number, v: number): [number, number, number] => {
    const l = v - (v * s) / 2;
    const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return [h, sl * 100, l * 100];
};

export const getRGB = (color: string): any => {
    return parseInt(color, 16) || color;
};

export const getsRGB = (color: string): any => {
    const rgb = getRGB(color);
    return rgb / 255 <= 0.03928 ? rgb / 255 / 12.92 : Math.pow((rgb / 255 + 0.055) / 1.055, 2.4);
};

export const getLuminance = (hexColor: string) => {
    return (
        0.2126 * getsRGB(hexColor.substr(1, 2)) +
        0.7152 * getsRGB(hexColor.substr(3, 2)) +
        0.0722 * getsRGB(hexColor.substr(-2))
    );
};

/**
 * @param foreground HEX Color Value
 * @param background HEX Color Value
 * @returns contrast ratio between two colors
 */
export const getContrast = (foreground: string, background: string) => {
    const L1 = getLuminance(foreground);
    const L2 = getLuminance(background);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

export const getTextColor = (bgColor: string): string => {
    const whiteContrast = getContrast(bgColor, "#ffffff");
    const blackContrast = getContrast(bgColor, "#000000");

    return whiteContrast > blackContrast ? "#ffffff" : "#000000";
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse r, g, b values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the maximum and minimum values of r, g and b
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate lightness
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
        const delta = max - min;

        // Calculate saturation
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        // Calculate hue
        switch (max) {
            case r:
                h = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }

        h /= 6;
    }

    // Return HSL values
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

export const isValidHex = (hex: string): boolean => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
};
