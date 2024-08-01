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
