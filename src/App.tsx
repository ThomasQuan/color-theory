import { useState } from "react";
import "./App.css";

import { ColorWheel } from "./components";

function App() {
    const [brightness, setBrightness] = useState(1);

    const handleBrightnessChange = (newBrightness: number) => {
        setBrightness(newBrightness);
        console.log(`Brightness: ${newBrightness}`);
    };
    return (
        <div className="App">
            <div className="flex justify-center items-center">
                <div className="relative ">
                    <div className="w-fit absolute top-5 left-5 z-[999]">
                        <ColorWheel harmony="analogous" radius={200} />
                    </div>
                </div>
                {/* <TextTable /> */}
            </div>
        </div>
    );
}

export default App;
