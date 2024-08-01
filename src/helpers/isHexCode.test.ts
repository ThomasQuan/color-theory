import { isHexCode } from "./isHexCode";

describe("isHexCode", () => {
    it("returns true for a valid hex color code", () => {
        const hex = "#f0f";
        const expectedResult = true;

        const result = isHexCode(hex);

        expect(result).toBe(expectedResult);
    });

    it("returns true for a valid 6-digit hex color code", () => {
        const hex = "#abcdef";
        const expectedResult = true;

        const result = isHexCode(hex);

        expect(result).toBe(expectedResult);
    });

    it("returns false for an invalid hex color code", () => {
        const hex = "#12345";
        const expectedResult = false;

        const result = isHexCode(hex);

        expect(result).toBe(expectedResult);
    });

    it("returns false for an empty string", () => {
        const hex = "";
        const expectedResult = false;

        const result = isHexCode(hex);

        expect(result).toBe(expectedResult);
    });

    it("returns false for a string without a leading #", () => {
        const hex = "f0f";
        const expectedResult = false;

        const result = isHexCode(hex);

        expect(result).toBe(expectedResult);
    });

    it("returns false for a empty string", () => {
        const hex = "";
        const expectedResult = false;

        const result = isHexCode(hex);

        expect(result).toBe(expectedResult);
    });
});
