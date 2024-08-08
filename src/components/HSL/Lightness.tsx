import { FC } from "react";

import Percentage from "./Percentage";

interface LightnessProps {
    hue: number;
    saturation: number;
    lightness: number;
    setLightness: (lightness: number) => void;
}
const Lightness: FC<LightnessProps> = ({ hue, saturation, lightness, setLightness }) => {
    const gradient = (
        <linearGradient id="Lightness" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue}, ${saturation}%, 100%)`} />
            <stop offset="50%" stopColor={`hsl(${hue}, ${saturation}%, 50%)`} />
            <stop offset="100%" stopColor={`hsl(${hue}, ${saturation}%, 0%)`} />
        </linearGradient>
    );
    return (
        <Percentage
            type="Lightness"
            value={lightness}
            gradient={gradient}
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            set={setLightness}
        />
    );
};

export default Lightness;
export { Lightness };
