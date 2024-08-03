import React, { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

import { harmonies, hsv2rgb, hsv2xy, polar2xy, rad2deg, xy2polar, xy2rgb } from "../helpers";

export type ColorWheelProps = Omit<ComponentProps<"div">, "color"> & {
    radius: number;
    harmony: keyof typeof harmonies;
    color?: { hue: number; saturation: number; value: number };
    defaultColor?: { hue: number; saturation: number; value: number };
    onChange?: (colors: { hue: number; saturation: number; value: number }[]) => void;
};

export const ColorWheel = ({
    radius,
    harmony: harmonyName,
    color,
    defaultColor,
    onChange,
    ...props
}: ColorWheelProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [position, setPosition] = useState(
        defaultColor
            ? hsv2xy(defaultColor.hue, defaultColor.saturation, defaultColor.value, radius)
            : hsv2xy(0, 1, 1, radius)
    );
    const harmony = useMemo(() => harmonies[harmonyName], [harmonies, harmonyName]);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = ref.current.getContext("2d");

        if (!ctx) return;

        ctx.canvas.width = radius * 2;
        ctx.canvas.height = radius * 2;

        drawCircle(ctx);
    }, []);

    useEffect(() => {
        if (color) {
            setPosition(hsv2xy(color.hue, color.saturation, color.value, radius));
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

        return colors;
    }, [position, harmony, polar2xy, onChange, xy2polar, rad2deg, radius]);

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

            ctx.putImageData(image, 0, 0);
        },
        [radius]
    );

    const [r, g, b] = useMemo(() => xy2rgb(position.x, position.y, radius), [position, radius]);

    return (
        <div
            style={{
                position: "relative",
                width: `${radius * 2}px`,
                height: `${radius * 2}px`
            }}
            {...props}
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
    );
};
