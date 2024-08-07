import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

import Dropdown from "./Dropdown";
import { harmonies, hsv2rgb, hsv2xy, polar2xy, rad2deg, xy2polar, xy2rgb } from "../helpers";

export type ColorWheelProps = {
    radius: number;
    defaultHarmony: keyof typeof harmonies;
    color?: { hue: number; saturation: number; value: number };
    defaultColor?: { hue: number; saturation: number; value: number };
    onChange?: (colors: { hue: number; saturation: number; value: number }[]) => void;
    className?: string;
};

export const ColorWheel = ({
    radius,
    defaultHarmony = "analogous",
    color,
    defaultColor,
    onChange,
    className = ""
}: ColorWheelProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [position, setPosition] = useState(
        defaultColor
            ? hsv2xy(defaultColor.hue, defaultColor.saturation, defaultColor.value, radius)
            : hsv2xy(0, 1, 1, radius)
    );
    const [selectedHarmony, setSelectedHarmony] = useState<keyof typeof harmonies>(defaultHarmony);

    const harmony = useMemo(() => harmonies[selectedHarmony], [harmonies, selectedHarmony]);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = ref.current.getContext("2d");

        if (!ctx) return;

        const canvasSize = radius * 2;

        ctx.canvas.width = canvasSize;
        ctx.canvas.height = canvasSize;

        drawCircle(ctx);
    }, []);

    useEffect(() => {
        if (color) {
            setPosition(hsv2xy(color.hue, 1, 1, radius));
        }
    }, [color, radius]);

    const handleDrag: DraggableEventHandler = useCallback(
        (e, data) => {
            if (!ref.current) return;

            e.stopPropagation();
            e.preventDefault();

            // eslint-disable-next-line prefer-const
            let [r, phi] = xy2polar(data.x - radius, data.y - radius);
            // Limit radial distance to radius
            r = Math.min(r, radius);
            const [x, y] = polar2xy(r, phi);
            setPosition({ x: x + radius, y: y + radius });
        },
        [radius]
    );

    const harmonyPairs = useMemo(() => {
        const x = position.x - radius;
        const y = position.y - radius;

        const [r, phi] = xy2polar(x, y);

        const hue = rad2deg(phi);
        const saturation = r / radius;
        const value = 1.0;

        const colors = harmony.map((harmonyHue: any) => {
            let newHue = (hue + harmonyHue) % 360;
            newHue = newHue < 0 ? 360 + newHue : newHue;

            const [x, y] = polar2xy(r, newHue * (Math.PI / 180));
            return { x: -x + radius, y: -y + radius, hue: newHue, saturation, value };
        });

        onChange?.([{ hue, saturation, value }, ...colors]);
        return [{ hue, saturation, value }, ...colors];
    }, [position, harmony, polar2xy, xy2polar, rad2deg, radius]);

    const drawCircle = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const image = ctx.createImageData(2 * radius, 2 * radius);
            const data = image.data;

            for (let x = -radius; x < radius; x++) {
                for (let y = -radius; y < radius; y++) {
                    const [r, phi] = xy2polar(x, y);

                    const deg = rad2deg(phi);

                    // Figure out the starting index of this pixel in the image data array.
                    const rowLength = 2 * radius;
                    const adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    const adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    const pixelWidth = 4; // each pixel requires 4 slots in the data array
                    const index = (adjustedX + adjustedY * rowLength) * pixelWidth;

                    const hue = deg;
                    const saturation = r / radius;
                    const value = 1.0;

                    const [red, green, blue] = hsv2rgb(hue, saturation, value);
                    const alpha = 255;

                    data[index] = red;
                    data[index + 1] = green;
                    data[index + 2] = blue;
                    data[index + 3] = alpha;
                }
            }

            ctx.putImageData(image, 0, 0); // Draw with padding
        },
        [radius]
    );

    const [r, g, b] = useMemo(() => xy2rgb(position.x, position.y, radius), [position, radius]);

    return (
        <div className="w-full md:w-1/2 h-fit min-w-min ">
            <div className="px-4">
                <p className="text-xl underline underline-offset-8">Harmony Selector</p>
                <p className="text-sm">
                    The color wheel is a visual representation of the HSV color space. You can
                    select a color by clicking and dragging on the wheel. The color wheel will
                    display the selected color and its harmonies based on the selected harmony.
                </p>
            </div>
            <div className={clsx("flex flex-wrap justify-center space-x-4 px-5 py-4", className)}>
                <div
                    style={{
                        position: "relative",
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`
                    }}
                >
                    <canvas
                        ref={ref}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "9999px"
                        }}
                    />
                    {harmonyPairs.map((harmony: any, i: number) => {
                        if (i === 0) return null;
                        const [r, g, b] = hsv2rgb(harmony.hue, harmony.saturation, harmony.value);
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    top: "-12px",
                                    left: "-12px",
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "999px",
                                    border: "2px solid #fff",
                                    backgroundColor: `rgb(${r}, ${g}, ${b})`,
                                    transform: `translate(${harmony.x}px, ${harmony.y}px)`,
                                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)"
                                }}
                            />
                        );
                    })}
                    <Draggable onDrag={handleDrag} position={position}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                top: "-12px",
                                left: "-12px",
                                width: "24px",
                                height: "24px",
                                borderRadius: "99px",
                                border: "2px solid rgba(255, 255, 255, 1)",
                                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                                boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)"
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "99px",
                                    backgroundColor: "#fff"
                                }}
                            />
                        </div>
                    </Draggable>
                </div>
                <div className="flex items-center justify-center w-auto sm:w-72 sm:block">
                    <div>
                        <Dropdown
                            label="Harmony"
                            value={selectedHarmony}
                            onChange={(value) => {
                                if (!value) return;
                                if (!harmonies[value as keyof typeof harmonies]) {
                                    return;
                                }
                                setSelectedHarmony(value as keyof typeof harmonies);
                            }}
                            options={Object.keys(harmonies).map((key) => ({
                                label: key,
                                value: key
                            }))}
                        />
                        <div className="">
                            <div>
                                <p>Color Combination</p>
                            </div>
                            <div className="space-x-1 flex items-center ">
                                {harmonyPairs.map((harmony: any, i: number) => {
                                    const [r, g, b] = hsv2rgb(
                                        harmony.hue,
                                        harmony.saturation,
                                        harmony.value
                                    );
                                    return (
                                        <div
                                            key={i}
                                            className="rounded-lg w-14 h-14 "
                                            style={{
                                                backgroundColor: `rgb(${r}, ${g}, ${b})`
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
