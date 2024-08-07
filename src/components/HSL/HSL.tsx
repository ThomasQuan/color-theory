import { clsx } from "clsx";
import { FC, useEffect, useState } from "react";

import Hue from "./Hue";
import Lightness from "./Lightness";
import Saturation from "./Saturation";
import { ColorWheel } from "../ColorWheel";
import InputField from "../Input";
import {
    getContrast,
    getTextColor,
    hexToHSL,
    hsl2hsv,
    hsl2rgb,
    isValidHex,
    rgbToHex
} from "../../helpers";

const HSL: FC = () => {
    const [hue, setHue] = useState(360);
    const [saturation, setSaturation] = useState(95);
    const [lightness, setLightness] = useState(50);
    const [rgb, setRGB] = useState({ red: 255, green: 0, blue: 0 });
    const [hex, setHex] = useState("#FF0000");
    const [normalTextRating, setNormalTextRating] = useState("AAA");
    const [largeTextRating, setLargeTextRating] = useState("AAA");
    const [textColor, setTextColor] = useState("#ffffff");
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
        const bestTextColor = getTextColor(_hex);
        const contrast = getContrast(_hex, bestTextColor);
        const normalTextRating = contrast >= 4.5 ? "AAA" : contrast >= 3 ? "AA" : "Fail";
        const largeTextRating = contrast >= 7 ? "AAA" : contrast >= 4.5 ? "AA" : "Fail";
        setNormalTextRating(normalTextRating);
        setLargeTextRating(largeTextRating);
        setTextColor(bestTextColor);
    }, [hue, saturation, lightness]);

    return (
        <div className="flex justify-center sm:justify-between w-full flex-wrap">
            <div className=" w-full md:w-1/2 min-w-min">
                <div className="px-4">
                    <p className="text-xl underline underline-offset-8">Main Color Selector</p>
                    <p className="text-sm">
                        HSL is a cylindrical-coordinate representation of points in an RGB color
                        model. It is widely used in color selection tools, and is also used in CSS
                        to describe colors.
                    </p>
                </div>
                <div>
                    <InputField
                        label="Hex"
                        description="Enter a hex value"
                        placeholder="#FF0000"
                        onChange={(e) => {
                            if (isValidHex(e.target.value)) {
                                const { h, s, l } = hexToHSL(e.target.value);
                                setHue(h);
                                setSaturation(s);
                                setLightness(l);
                            }
                        }}
                    />
                </div>
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
                            <div className="space-x-2 space-y-2 flex items-start justify-center  ">
                                <div
                                    style={{
                                        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                                        color: textColor
                                    }}
                                    className=" w-[180px] h-[180px] flex items-center justify-center rounded-xl shadow-md"
                                >
                                    <p>{normalTextRating}</p> /{" "}
                                    <p className="text-2xl"> {largeTextRating}</p>
                                </div>
                                <div className="flex flex-wrap flex-col space-y-1 ">
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
                </div>
            </div>
            <ColorWheel
                className="sm:!items-start sm:!justify-start"
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
