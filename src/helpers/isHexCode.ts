/**
 * Check if the hex color code is valid
 * @param hex the suppose hex color code
 * @returns  true if the hex color code is valid
 */
export const isHexCode = (hex: string): boolean => {
    const isHexCodeRegex = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
    return isHexCodeRegex.test(hex);
};
