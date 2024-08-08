import React, { FC, useEffect } from "react";
import { fromEvent, merge } from "rxjs";
import { concatMap, takeUntil } from "rxjs/operators";

import HueSlice from "./HueSlice";

interface HueProps {
    hue: number;
    saturation: number;
    lightness: number;
    setHue: (hue: number) => void;
}

const Hue: FC<HueProps> = ({ hue, saturation, lightness, setHue }) => {
    const padding = 20;
    const innerSize = 200;
    const radius = innerSize / 2;
    const outterSize = innerSize + padding * 2;
    const centerOffset = padding + innerSize / 2;

    const [dragging, setDragging] = React.useState(false);

    const [canvas, setCanvas] = React.useState<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!canvas) return;

        const mouseDowns = fromEvent<MouseEvent>(canvas, "mousedown");
        const mouseMoves = fromEvent<MouseEvent>(canvas, "mousemove");
        const mouseUps = fromEvent<MouseEvent>(canvas, "mouseup");
        const mouseLeaves = fromEvent<MouseEvent>(canvas, "mouseleave");

        const touchStarts = fromEvent<TouchEvent>(canvas, "touchstart");
        const touchMoves = fromEvent<TouchEvent>(canvas, "touchmove");
        const touchEnds = fromEvent<TouchEvent>(canvas, "touchend");

        const mouseDrags = mouseDowns.pipe(
            concatMap(() => {
                return mouseMoves.pipe(
                    takeUntil(mouseUps),
                    takeUntil(mouseLeaves),
                    concatMap((moveEvent) => {
                        const xRelativeToCenter =
                            moveEvent.clientX -
                            (canvas.getBoundingClientRect().left + centerOffset);
                        const yRelativeToCenter =
                            moveEvent.clientY - (canvas.getBoundingClientRect().top + centerOffset);
                        const degree =
                            (Math.atan2(yRelativeToCenter, xRelativeToCenter) * 180) / Math.PI + 90;
                        return [parseInt(String(degree >= 0 ? degree : degree + 360))];
                    })
                );
            })
        );

        const touchDrags = touchStarts.pipe(
            concatMap((startEvent) => {
                startEvent.preventDefault();
                return touchMoves.pipe(
                    takeUntil(touchEnds),
                    concatMap((moveEvent) => {
                        moveEvent.preventDefault();
                        const xRelativeToCenter =
                            moveEvent.touches[0].clientX -
                            (canvas.getBoundingClientRect().left + centerOffset);
                        const yRelativeToCenter =
                            moveEvent.touches[0].clientY -
                            (canvas.getBoundingClientRect().top + centerOffset);
                        const degree =
                            (Math.atan2(yRelativeToCenter, xRelativeToCenter) * 180) / Math.PI + 90;
                        return [parseInt(String(degree >= 0 ? degree : degree + 360))];
                    })
                );
            })
        );

        const dragStarts = merge(mouseDowns, touchStarts);
        const drags = merge(mouseDrags, touchDrags);
        const dragEnds = merge(mouseUps, mouseLeaves, touchEnds);

        dragStarts.forEach(() => {
            setDragging(true);
        });

        drags.forEach((degree: any) => {
            if (isNaN(degree)) setHue(0);
            setHue(degree);
        });

        dragEnds.forEach(() => {
            setDragging(false);
        });
    }, [canvas, dragging, hue, radius, setHue]);

    return (
        <svg
            ref={(canvas) => {
                setCanvas(canvas);
            }}
            width={outterSize}
            height={outterSize}
            viewBox={`0 0 ${outterSize} ${outterSize}`} // fix size issue
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
        >
            <g transform={`translate(${centerOffset},${centerOffset})`}>
                {Array.from({ length: 360 }, (_, key) => (
                    <HueSlice
                        degree={key}
                        radius={radius}
                        color={`hsl(${key}, ${saturation}%, ${lightness}%)`}
                        marker={false}
                    />
                ))}
                <g>
                    <HueSlice
                        key={radius}
                        degree={hue}
                        radius={radius}
                        color={dragging ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : "white"}
                        marker={true}
                    />
                </g>
                <text
                    x="10"
                    y="20"
                    textAnchor="middle"
                    fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                    stroke={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                >
                    {hue}°
                </text>
                <text
                    className="label"
                    x="0"
                    y="40"
                    textAnchor="middle"
                    fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                    stroke={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                >
                    Hue
                </text>
            </g>
        </svg>
    );
};

export default Hue;
export { Hue };
