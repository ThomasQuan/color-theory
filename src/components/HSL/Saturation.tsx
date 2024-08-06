import React, { FC } from "react";

import Percentage from "./Percentage";

interface SaturationProps {
    hue: number;
    saturation: number;
    lightness: number;
    setSaturation: (saturation: number) => void;
}
const Saturation: FC<SaturationProps> = ({ hue, saturation, lightness, setSaturation }) => {
    const gradient = (
        <linearGradient id="Saturation" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue}, 100%, ${lightness}%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, 0%, ${lightness}%)`} />
        </linearGradient>
    );
    return (
        <Percentage
            type="Saturation"
            value={saturation}
            gradient={gradient}
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            set={setSaturation}
        />
    );
};

export default Saturation;
export { Saturation };
