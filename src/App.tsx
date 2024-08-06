import "./App.css";

import { HSL } from "./components";

function App() {
    return (
        <div className="App">
            <div className="h-20 text-3xl font-semibold flex items-center justify-center">
                <h1>Color Theory</h1>
            </div>
            <div className=" space-y-4 p-2 md:p-10">
                <HSL />

                {/* <TextTable /> */}
            </div>
        </div>
    );
}

export default App;
