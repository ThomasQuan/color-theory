import type { FC } from "react";
import React, { useState } from "react";

import { determineBestContrast, determineTextColour, getContrast, hslToHex } from "../helpers";

const colourSamples: Array<{ hex: string; expected: "Light" | "Dark" }> = [
    { hex: "#aa0e2d", expected: "Light" },
    { hex: "#99300b", expected: "Light" },
    { hex: "#7f472f", expected: "Light" },
    { hex: "#6c5009", expected: "Light" },
    { hex: "#DDCA1D", expected: "Dark" },
    { hex: "#005031", expected: "Light" },
    { hex: "#355f4a", expected: "Light" },
    { hex: "#0f330f", expected: "Light" },
    { hex: "#47582d", expected: "Light" },
    { hex: "#20603C", expected: "Light" },
    { hex: "#0000B5", expected: "Light" },
    { hex: "#05529e", expected: "Light" },
    { hex: "#2340b3", expected: "Light" },
    { hex: "#3e576f", expected: "Light" },
    { hex: "#0A3055", expected: "Light" },
    { hex: "#8e2f63", expected: "Light" },
    { hex: "#7c14a9", expected: "Light" },
    { hex: "#693e93", expected: "Light" },
    { hex: "#744474", expected: "Light" },
    { hex: "#3D2F5B", expected: "Light" },
    { hex: "#1A1A1A", expected: "Light" },
    { hex: "#434c65", expected: "Light" },
    { hex: "#bdbdbd", expected: "Dark" },
    { hex: "#E6E6E6", expected: "Dark" }
];

interface IColourRowProps {
    opt: { hex: string; expected: string };
}

const cellClasses = "px-2 py-1 border border-gray-400 text-sm";

const ColourRow: FC<IColourRowProps> = ({ opt }) => {
    const [adjustedBg, setAdjustedBg] = useState<string>(opt.hex);
    const ref = React.useRef<HTMLInputElement>(null);
    const result = determineBestContrast(adjustedBg);
    const ratio = getContrast(adjustedBg, hslToHex(determineTextColour(adjustedBg))).toFixed(2);
    const normalTextRating =
        Number(ratio) >= 4.5 && Number(ratio) < 7 ? "AA" : Number(ratio) >= 7 ? "AAA" : "FAIL";
    const largeTextRating =
        Number(ratio) >= 3 && Number(ratio) < 4.5 ? "AA" : Number(ratio) >= 4.5 ? "AAA" : "FAIL";

    const determineBgColour = (rating: "AAA" | "AA" | "FAIL") => {
        return rating === "AAA" ? "yellowgreen" : rating === "AA" ? "yellow" : "orange";
    };

    return (
        <tr>
            <td className={cellClasses}>
                <div className="flex justify-between">
                    <div
                        onClick={() => {
                            ref.current?.click();
                        }}
                    >
                        {opt.hex}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        {/* <input
                            className="colour-picker"
                            tabIndex={-1}
                            ref={ref}
                            type="color"
                            value={adjustedBg}
                            onChange={(e) => setAdjustedBg(e.target.value)}
                        /> */}
                        <div
                            className="colour-picker h-8 w-16 border border-gray-300"
                            style={{ backgroundColor: opt.hex }}
                        ></div>
                    </div>
                </div>
            </td>
            {/* <td className={cellClasses}>
                <div className="flex justify-between">
                    <button
                        onClick={() => {
                            ref.current?.click();
                        }}
                    >
                        {adjustedBg}
                    </button>
                    <div className="flex flex-col items-center justify-center">
                        <input
                            className="colour-picker"
                            tabIndex={-1}
                            ref={ref}
                            type="color"
                            value={adjustedBg}
                            onChange={(e) => setAdjustedBg(e.target.value)}
                        />
                        {adjustedBg !== opt.hex && (
                            <div className="relative flex space-x-1 text-xs">
                                <span onClick={() => setAdjustedBg(opt.hex)}>Reset</span>
                                <span
                                    onClick={() => {
                                        if (
                                            typeof document !== "undefined" &&
                                            typeof navigator !== "undefined" &&
                                            navigator.clipboard
                                        ) {
                                            navigator.clipboard.writeText(adjustedBg);
                                            const tooltip = document.getElementById("myTooltip");
                                            if (tooltip) {
                                                tooltip.innerHTML = "Copied!";
                                                tooltip.style.opacity = "100";

                                                setInterval(() => {
                                                    tooltip.innerHTML = "";
                                                    tooltip.style.opacity = "0";
                                                }, 2000);
                                            }
                                        }
                                    }}
                                >
                                    Copy
                                    <span
                                        className="absolute z-10 px-1.5 py-2 bg-blue-100 rounded shadow opacity-0 top-3 left-1/3"
                                        id="myTooltip"
                                    ></span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </td> */}
            <td className={cellClasses}>{hslToHex(determineTextColour(adjustedBg))}</td>
            <td
                className={cellClasses}
                style={{
                    background: adjustedBg,
                    color: determineTextColour(adjustedBg)
                }}
            >
                {opt.expected}
            </td>
            <td
                className={cellClasses}
                style={{
                    background: adjustedBg,
                    color: determineTextColour(adjustedBg)
                }}
            >
                {result}
            </td>
            <td className={cellClasses + " text-center"}>
                {opt.hex !== adjustedBg ? "N/A" : result === opt.expected ? <>&#x2713;</> : "FAIL"}
            </td>
            <td className={cellClasses}>{ratio}:1</td>
            <td
                className={cellClasses + " text-center"}
                style={{
                    background: determineBgColour(normalTextRating)
                }}
            >
                {normalTextRating}
            </td>
            <td
                className={cellClasses + " text-center"}
                style={{
                    background: determineBgColour(largeTextRating)
                }}
            >
                {largeTextRating}
            </td>
        </tr>
    );
};

export const TextTable = () => {
    return (
        <div className="h-96 w-fit overflow-auto">
            <table className="table-fixed">
                <thead className="sticky top-0 bg-white">
                    <tr>
                        <th className={cellClasses}>Background</th>
                        {/* <th className={cellClasses}>Adjusted Background</th> */}
                        <th className={cellClasses}>Foreground</th>
                        <th className={cellClasses}>Expected</th>
                        <th className={cellClasses}>Result</th>
                        <th className={cellClasses}>Pass</th>
                        <th className={cellClasses}>Contrast Ratio</th>
                        <th className={cellClasses}>WCAG Normal Text</th>
                        <th className={cellClasses}>WCAG Large Text</th>
                    </tr>
                </thead>
                <tbody>
                    {colourSamples.map((opt, i) => (
                        <ColourRow key={i} opt={opt} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
