/**
 * Convert a Hexadecimal Color String into RGB Values
 * @param hexString Hex String to turn into RGB
 * @returns Red Blue Green numeric values as string
 */
export const hexToRGB = (hexString: string, delimiter = " ", opacity?: number | string): string => {
    const newHex = String(hexString)
        .split("")
        .filter((v) => v !== "#");
    const rgb: Array<string> = [];

    if (newHex.length === 3) {
        rgb.push(String(newHex[0]).repeat(2));
        rgb.push(String(newHex[1]).repeat(2));
        rgb.push(String(newHex[2]).repeat(2));
    } else {
        rgb.push(newHex.slice(0, 2).join(""));
        rgb.push(newHex.slice(2, 4).join(""));
        rgb.push(newHex.slice(4, 6).join(""));
    }

    const colorString = rgb.map((v) => parseInt(v, 16)).join(delimiter);

    if (opacity) {
        return [colorString, opacity].join(delimiter);
    } else {
        return colorString;
    }
};
