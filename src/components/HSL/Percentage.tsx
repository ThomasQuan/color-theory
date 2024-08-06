import React, { FC, useEffect, useState } from "react";
import { fromEvent, merge } from "rxjs";
import { concatMap, map, takeUntil } from "rxjs/operators";

interface PercentageProps {
    type: string;
    value: number;
    gradient: JSX.Element;
    hue: number;
    saturation: number;
    lightness: number;
    set: (value: number) => void;
}

const PADDING = 10;
const INNER_SIZE = 200;

const Percentage: FC<PercentageProps> = ({
    type,
    value,
    gradient,
    hue,
    saturation,
    lightness,
    set
}) => {
    const padding = PADDING / 2;
    const innerSize = INNER_SIZE;
    const outterSize = INNER_SIZE + PADDING;
    const barOffsetX = INNER_SIZE - 100;
    const [dragging, setDragging] = useState(false);

    const [selector, setSelector] = useState<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!selector) return;

        const mouseDowns = fromEvent<MouseEvent>(selector, "mousedown");
        const mouseMoves = fromEvent<MouseEvent>(selector, "mousemove");
        const mouseUps = fromEvent<MouseEvent>(selector, "mouseup");
        const mouseLeaves = fromEvent<MouseEvent>(selector, "mouseleave");

        const touchStarts = fromEvent<TouchEvent>(selector, "touchstart");
        const touchMoves = fromEvent<TouchEvent>(selector, "touchmove");
        const touchEnds = fromEvent<TouchEvent>(selector, "touchend");

        const mouseDrags = mouseDowns.pipe(
            concatMap((clickEvent) => {
                const yMouseShouldBe = (1 - value / 100) * innerSize;
                const yMouseIs = clickEvent.clientY;
                const yMouseDelta = yMouseIs - yMouseShouldBe;
                return mouseMoves.pipe(
                    takeUntil(merge(mouseUps, mouseLeaves)),
                    map((moveEvent) => {
                        const y = moveEvent.clientY - yMouseDelta;
                        let percentage = (1 - y / innerSize) * 100;
                        percentage = Math.min(percentage, 100);
                        percentage = Math.max(percentage, 0);
                        return parseInt(percentage.toString(), 10);
                    })
                );
            })
        );

        const touchDrags = touchStarts.pipe(
            concatMap((startEvent) => {
                startEvent.preventDefault();
                const yTouchShouldBe = (1 - value / 100) * innerSize;
                const yTouchIs = startEvent.touches[0].clientY;
                const yTouchDelta = yTouchIs - yTouchShouldBe;
                return touchMoves.pipe(
                    takeUntil(touchEnds),
                    map((moveEvent) => {
                        moveEvent.preventDefault();
                        const y = moveEvent.touches[0].clientY - yTouchDelta;
                        let percentage = (1 - y / innerSize) * 100;
                        percentage = Math.min(percentage, 100);
                        percentage = Math.max(percentage, 0);
                        return parseInt(percentage.toString(), 10);
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

        drags.forEach((percentage) => {
            set(percentage);
        });

        dragEnds.forEach(() => {
            setDragging(false);
        });
    }, [value, innerSize, set, selector, dragging]);

    return (
        <svg
            ref={(ref) => setSelector(ref as SVGSVGElement)}
            width={outterSize - 75}
            height={outterSize}
            viewBox={`0 0 ${outterSize - 75} ${outterSize}`}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
        >
            <defs>{gradient}</defs>
            <g transform={`translate(${padding},${padding})`}>
                <g>
                    <rect
                        x={barOffsetX}
                        y="0"
                        width="10"
                        height={innerSize}
                        strokeWidth="10"
                        fill={`url(#${type})`}
                    />
                    <g>
                        <rect
                            x={barOffsetX - 10}
                            y={innerSize * (1 - value / 100) - 15 / 2}
                            width="30"
                            height="15"
                            strokeWidth="10"
                            fill={dragging ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : "white"}
                        />
                    </g>
                </g>
                <g>
                    <text
                        x="40"
                        y="120"
                        textAnchor="middle"
                        fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                        stroke={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                    >
                        {value}%
                    </text>
                    <text
                        className="label"
                        x="40"
                        y="145"
                        textAnchor="middle"
                        fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                        stroke={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                    >
                        {type}
                    </text>
                </g>
            </g>
        </svg>
    );
};

export default Percentage;
export { Percentage };
