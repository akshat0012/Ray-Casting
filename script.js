console.log("Billie Jean by MJ 1982");

let wallArray = [ 100, 100, 400, 400,
                  600,  200, 800,  700,
                  300,  500,  800,  500
];

function drawLine(x, y, a, b, R, G, B, s) {
    strokeWeight(s);
    stroke(R, G, B);
    line(x, y, a, b);
}

function getIntersection(x, y, wallStartingX, wallStartingY, wallEndingX, wallEndingY) {
    const line1StartX = mouseX;
    const line1StartY = mouseY;
    const line1EndX = x;
    const line1EndY = y;

    const line2StartX = wallStartingX;
    const line2StartY = wallStartingY;
    const line2EndX = wallEndingX;
    const line2EndY = wallEndingY;

    const denominator = (line1StartX - line1EndX) * (line2StartY - line2EndY) - (line1StartY - line1EndY) * (line2StartX - line2EndX);

    if (Math.abs(denominator) < 0.00001) {
        // Lines are parallel, return null indicating no intersection
        return null;
    }

    const t = ((line1StartX - line2StartX) * (line2StartY - line2EndY) - (line1StartY - line2StartY) * (line2StartX - line2EndX)) / denominator;
    const u = -((line1StartX - line1EndX) * (line1StartY - line2StartY) - (line1StartY - line1EndY) * (line1StartX - line2StartX)) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const intersectionX = line1StartX + t * (line1EndX - line1StartX);
        const intersectionY = line1StartY + t * (line1EndY - line1StartY);
        return { x: intersectionX, y: intersectionY };
    }

    // No intersection, return null
    return null;
}

function drawSource() {
    let radianAngle = 0;
    let length = 10000;

    for (let angleDegrees = 0; angleDegrees <= 360; angleDegrees += 10) {
        radianAngle = angleDegrees * (Math.PI / 180);
        let ray_X = mouseX + length * Math.sin(radianAngle);
        let ray_Y = mouseY + length * Math.cos(radianAngle);

        for (let i = 0; i <= wallArray.length - 4; i += 4) {
            let intersection = getIntersection(ray_X, ray_Y, wallArray[i], wallArray[i+1], wallArray[i+2], wallArray[i+3]);
            if (intersection) {
                ray_X = intersection.x
                ray_Y = intersection.y
            }
        }
        drawLine(mouseX, mouseY, ray_X, ray_Y, 255, 235, 205, 2);
        circle(ray_X, ray_Y, 10)                                                                                                // Draws a circle at every intersection
        fill(0, 0, 0);
    }
}

let isMouseInside = true; 

// this function is automatically called when mouse is moved { see processing Documentation }
function mouseMoved() {
    // Update the boolean variable based on mouse position
    isMouseInside = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function setup() {
    let canvasContainer = select(".main > .canvas");
    let cnv = createCanvas(1000, 800);
    cnv.parent(canvasContainer);
    lastFrame = createGraphics(width, height);
}


function draw() {
    background(15, 15, 15);
    frameRate(500);
    // draw the walls
    if (isMouseInside) {
        for (let i = 0; i <= wallArray.length - 4; i += 4){
            drawLine(wallArray[i], wallArray[i+1], wallArray[i+2], wallArray[i+3], 255, 75, 129, 4);
        }
        // Draw something when the mouse is inside the sketch
        drawSource();
        lastFrame.clear();
        lastFrame.image(get(), 0, 0);
    } else {
        // Draw the last frame when the mouse is outside the sketch
        image(lastFrame, 0, 0);
    }
}

