import { determineTextColour, getLuminance, getsRGB, RGBToHSL } from "./colorContrast";

describe("Colour Contrast", () => {
    describe("Hex to RGB color channel", () => {
        test.each`
            value   | expected
            ${"00"} | ${0}
            ${"ff"} | ${1}
        `('returns "$expected" for "$value"', ({ value, expected }) => {
            expect(getsRGB(value)).toEqual(expected);
        });
    });
    describe("Get Colour Luminance", () => {
        test.each`
            value        | expected
            ${"#000000"} | ${0}
            ${"#ffffff"} | ${1}
            ${"#ff0000"} | ${0.2126}
            ${"#00ff00"} | ${0.7152}
            ${"#0000ff"} | ${0.0722}
        `('returns "$expected" for "$value"', ({ value, expected }) => {
            expect(getLuminance(value)).toEqual(expected);
        });
    });
    describe("Get HSL from RGB", () => {
        test.each`
            r      | g      | b      | lighten  | expected
            ${"1"} | ${"1"} | ${"1"} | ${false} | ${"hsl(0,0%,2%)"}
            ${"0"} | ${"0"} | ${"0"} | ${true}  | ${"hsl(15,0%,98%)"}
        `('returns "$expected" for rgb($r, $g, $b)', ({ r, g, b, lighten, expected }) => {
            expect(RGBToHSL(r, g, b, lighten)).toEqual(expected);
        });
    });
    describe("Get Text Colour From Background", () => {
        test.each`
            value        | expected
            ${"#000000"} | ${"hsl(15,0%,98%)"}
            ${"#FFFFFF"} | ${"hsl(0,0%,2%)"}
        `('returns "$expected" for "$value', ({ value, expected }) => {
            expect(determineTextColour(value)).toEqual(expected);
        });
    });
});
