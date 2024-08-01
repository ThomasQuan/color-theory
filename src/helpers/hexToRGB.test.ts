import { hexToRGB } from "."; // Replace with the actual module path

describe("hexToRGB", () => {
    it("converts a 3-digit hexadecimal color to RGB", () => {
        const hex = "#f00";
        const expected = "255 0 0";

        const result = hexToRGB(hex);

        expect(result).toBe(expected);
    });

    it("converts a 6-digit hexadecimal color to RGB", () => {
        const hex = "#00ff00";
        const expected = "0 255 0";

        const result = hexToRGB(hex);

        expect(result).toBe(expected);
    });

    it("handles a custom delimiter", () => {
        const hex = "#0000ff";
        const delimiter = "-";
        const expected = "0-0-255";

        const result = hexToRGB(hex, delimiter);

        expect(result).toBe(expected);
    });

    it("handles a custom opacity", () => {
        const hex = "#ff00ff";
        const opacity = "0.5";
        const expected = "255 0 255 0.5";

        const result = hexToRGB(hex, " ", opacity);

        expect(result).toBe(expected);
    });
});
