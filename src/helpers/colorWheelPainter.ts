// utils.ts
const WIDTH = 320;
const HEIGHT = 250;
const SCALE = 1;
const MIDDLE_X = WIDTH / 2;
const MIDDLE_Y = HEIGHT / 2;

const LIGHTNESS = 0.5;

let ctx: CanvasRenderingContext2D | null;

/**
 * Stores the canvas context passed by the React component in the module for later use.
 * @param context The canvas 2D context
 */
export function setContext(context: CanvasRenderingContext2D) {
    ctx = context;
}

/**
 * Draws the color wheel at the center of the canvas.
 */
export function drawColorWheel() {
    if (!ctx) throw new Error("Context not found, please call setContext().");

    for (let h = 0; h <= 360; h++) {
        for (let s = 0; s <= 100; s++) {
            ctx.beginPath();
            ctx.fillStyle = `hsl(${h}, ${s}%, ${LIGHTNESS * 100}%)`;
            const posX = MIDDLE_X + Math.cos(degreeToRadian(h)) * s * SCALE;
            const posY = MIDDLE_Y - Math.sin(degreeToRadian(h)) * s * SCALE;
            ctx.arc(posX, posY, (SCALE * s) / 100 + 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawColorWheelBorder();
}

/**
 * Draws a thick invisible border around the color wheel to smooth the outer ring of colors.
 */
function drawColorWheelBorder() {
    if (!ctx) throw new Error("Context not found, please call setContext().");

    ctx.beginPath();
    ctx.strokeStyle = "#fefefe";
    ctx.lineWidth = 10;
    ctx.arc(MIDDLE_X, MIDDLE_Y, 100 * SCALE + 5, 0, 2 * Math.PI);
    ctx.stroke();
}

/**
 * Returns the hsl color for the current cursor position.
 * @param x The relative horizontal (x) position of the cursor on the canvas
 * @param y The relative vertical (y) position of the cursor on the canvas
 * @returns {{h: number, s: number, l: number}} The hsl color for the current cursor position
 */
export function getColorForPoint(x: number, y: number): { h: number; s: number; l: number } {
    const dist = getDistanceFromCenter(x, y);

    if (dist > 100 * SCALE) return { h: 0, s: 0, l: 1 };

    const s = dist / SCALE;
    let h = radianToDegree(Math.acos((x - MIDDLE_X) / s / SCALE));
    if (y > MIDDLE_Y) h = 360 - h;
    return { h, s: s / 100, l: LIGHTNESS };
}

/**
 * Utility functions
 */

function getDistanceFromCenter(x: number, y: number): number {
    const offsetX = Math.abs(MIDDLE_X - x);
    const offsetY = Math.abs(MIDDLE_Y - y);
    return Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
}

function degreeToRadian(deg: number): number {
    return (deg * Math.PI) / 180;
}

function radianToDegree(rad: number): number {
    return (rad * 180) / Math.PI;
}
