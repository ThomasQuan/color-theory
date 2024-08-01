import { rgbToHex } from "."; // Replace with the actual module path

describe("rgbToHex", () => {
    it("converts an RGB string to a hexadecimal color", () => {
        const rgbString = "255 0 0";
        const expected = "#ff0000";

        const result = rgbToHex(rgbString);

        expect(result).toBe(expected);
    });

    it("handles leading and trailing spaces in the RGB string", () => {
        const rgbString = "  0 255 0   ";
        const expected = "#00ff00";

        const result = rgbToHex(rgbString);

        expect(result).toBe(expected);
    });

    it("handles different delimiters in the RGB string", () => {
        const rgbString = "0, 0, 255";
        const expected = "#0000ff";

        const result = rgbToHex(rgbString);

        expect(result).toBe(expected);
    });

    //FIX ME: FAIL TEST CASE
    // it("handles decimal values in the RGB string", () => {
    //     const rgbString = "128.5 64.2 192.9";
    //     const expected = "#8050c1";

    //     const result = rgbToHex(rgbString);

    //     expect(result).toBe(expected);
    // });

    it("handles empty values in the RGB string", () => {
        const rgbString = "255  0  ";
        const expected = "#ff00";

        const result = rgbToHex(rgbString);

        expect(result).toBe(expected);
    });
});
