type Point = {
    X: number;
    Y: number;
};

type Zone = {
    sensor: Point;
    beacon: Point;
};

function readData(fileName: string): string {
    return Deno.readTextFileSync(fileName);
}

function parseData(input: string): Zone[] {
    return input.split("\n").filter((x) => x).map((line) => {
        const parts = line.split(":");
        const coords: number[] = [];
        for (const part of parts) {
            const xy = part.split(",");
            for (const coord of xy) {
                const c = coord.split("=");
                coords.push(+c[1]);
            }
        }
        return {
            sensor: { X: coords[0], Y: coords[1] },
            beacon: { X: coords[2], Y: coords[3] },
        };
    });
}

function taxicabDistance(p1: Point, p2: Point) {
    return Math.abs(p1.X - p2.X) + Math.abs(p1.Y - p2.Y);
}

function totalSignalContainedPositions(zones: Zone[], rowY: number): number {
    const postionsContainedBySignals: number[] = [];

    for (const zone of zones) {
        const dist = taxicabDistance(zone.sensor, zone.beacon);
        const startY = zone.sensor.Y - dist;
        const endY = zone.sensor.Y + dist;
        if (startY <= rowY && rowY <= endY) {
            const offsetY = Math.abs(zone.sensor.Y - rowY);
            const middleToSideLength = dist - offsetY;
            const startX = zone.sensor.X - middleToSideLength;
            const endX = zone.sensor.X + middleToSideLength;
            for (let x = startX; x <= endX; x++) {
                if (zone.beacon.X === x && zone.beacon.Y === rowY) {
                    continue;
                }
                postionsContainedBySignals.push(x);
            }
        }
    }

    const uniquePos = [...new Set(postionsContainedBySignals)];
    return uniquePos.length;
}

function findTuningFrequency(
    zones: Zone[],
    range: number[],
    multiplier: number,
): number {
    let tuningFrequency = 0;

    for (let x = range[0]; x < range[1]; x++) {
        for (let y = range[0]; y < range[1]; y++) {
            let notContained = true;
            for (const zone of zones) {
                const distanceSensorToBeacon = taxicabDistance(
                    zone.sensor,
                    zone.beacon,
                );
                const distanceSensorToPoint = taxicabDistance(zone.sensor, {
                    X: x,
                    Y: y,
                });
                if (distanceSensorToBeacon >= distanceSensorToPoint) {
                    const offsetX = Math.abs(zone.sensor.X - x);
                    y = zone.sensor.Y + distanceSensorToBeacon - offsetX;
                    notContained = false;
                    break;
                }
            }
            if (notContained === true) {
                tuningFrequency = x * multiplier + y;
                return tuningFrequency;
            }
        }
    }

    return tuningFrequency;
}

const fileTest = "./example_data.txt";
const rowYTest = 10;
const fileActual = "./data.txt";
const rowYActual = 2000000;

console.log(
    totalSignalContainedPositions(parseData(readData(fileActual)), rowYActual),
);

const multiplier = 4000000;
const rangeTest = [0, 20];
const rangeActual = [0, 4000000];

console.log(
    findTuningFrequency(
        parseData(readData(fileActual)),
        rangeActual,
        multiplier,
    ),
);
