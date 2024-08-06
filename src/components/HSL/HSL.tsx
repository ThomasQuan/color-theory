import { clsx } from "clsx";
import { FC, useEffect, useState } from "react";

import Hue from "./Hue";
import Lightness from "./Lightness";
import Saturation from "./Saturation";
import { ColorWheel } from "../ColorWheel";
import { hsl2hsv, hsl2rgb, rgbToHex } from "../../helpers";

interface HSLValProps {
    hue: number;
    saturation: number;
    lightness: number;
}

const HSL: FC<{ className?: string }> = ({ className = "" }) => {
    const [hue, setHue] = useState(360);
    const [saturation, setSaturation] = useState(95);
    const [lightness, setLightness] = useState(50);
    const [rgb, setRGB] = useState({ red: 255, green: 0, blue: 0 });
    const [hex, setHex] = useState("#FF0000");
    const [normalTextRating, setNormalTextRating] = useState("AAA");
    const [largeTextRating, setLargeTextRating] = useState("AAA");

    const [hsv, setHsv] = useState<{ h: number; s: number; v: number }>();

    useEffect(() => {
        const [red, green, blue] = hsl2rgb(hue, saturation, lightness);
        const _hex = rgbToHex(`${red},${green},${blue}`);
        setRGB({ red, green, blue });
        setHex(_hex);
        const [h, s, v] = hsl2hsv(hue, saturation, lightness);
        setHsv({
            h,
            s,
            v
        });
        setNormalTextRating(normalTextRating);
        setLargeTextRating(largeTextRating);
    }, [hue, saturation, lightness]);

    return (
        <div className="flex flex-wrap">
            <div className="flex flex-col space-y-4">
                <div className="">
                    <div
                        className={clsx(
                            "flex flex-wrap items-center justify-center w-full h-full "
                        )}
                    >
                        <Hue
                            hue={hue}
                            saturation={saturation}
                            lightness={lightness}
                            setHue={setHue}
                        />
                        <div className="flex">
                            <Saturation
                                hue={hue}
                                saturation={saturation}
                                lightness={lightness}
                                setSaturation={setSaturation}
                            />
                            <Lightness
                                hue={hue}
                                saturation={saturation}
                                lightness={lightness}
                                setLightness={setLightness}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center mx-auto sm:mx-0  space-y-4  px-5 py-4 rounded-xl">
                    <div className="space-x-2 space-y-2 flex items-center justify-center flex-wrap ">
                        <div
                            style={{
                                backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`
                            }}
                            className=" w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] flex items-center justify-center rounded-xl shadow-md"
                        >
                            <p>{normalTextRating}</p> /{" "}
                            <p className="text-2xl"> {largeTextRating}</p>
                        </div>
                        <div className="flex flex-wrap flex-col space-y-1 sm:space-y-4">
                            <div className="text-gray-300 pt-0 text-sm box-border font-thin">
                                HSL: {`hsl(${hue}, ${saturation}%, ${lightness}%)`}
                            </div>
                            <div className="text-gray-300 text-sm box-border font-thin">
                                RGB: {`rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`}
                            </div>
                            <div className="text-gray-300 text-sm box-border font-thin">
                                HEX: {hex}
                            </div>
                            <div className="text-gray-300 text-sm box-border font-thin">
                                Normal Text Rating: {largeTextRating}
                            </div>
                            <div className="text-gray-300 text-sm box-border font-thin">
                                Large Text Rating: {largeTextRating}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ColorWheel
                color={
                    hsv && {
                        hue: hsv?.h,
                        saturation: hsv?.s,
                        value: hsv?.v
                    }
                }
                defaultHarmony="analogous"
                radius={100}
            />
        </div>
    );
};

export { HSL };
export default HSL;
