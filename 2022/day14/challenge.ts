const Y_MAX = 1000;
const X_MAX = 1000;

enum Character {
    Air = ".",
    Rock = "#",
    Source = "+",
    Sand = "o",
}

type Point = {
    X: number;
    Y: number;
};

const POURING_LOCATION: Point = { X: 500, Y: 0 };

type Scan = {
    map: string[][];
    floorY: number;
};

function readData(fileName: string): string {
    return Deno.readTextFileSync(fileName);
}

function parseData(input: string): Scan {
    const scan: Scan = {
        map: Array.from(
            { length: Y_MAX },
            () =>
                Array.from({ length: X_MAX }, () => {
                    return Character.Air;
                }),
        ),
        floorY: 0,
    };

    input.split("\n").filter((x) => x).forEach((line) => {
        const points: Point[] = line.split("->").map((x) => {
            const coords: string[] = x.trim().split(",");
            return { X: +coords[0], Y: +coords[1], char: Character.Air };
        });

        for (let i = 0; i < points.length - 1; i++) {
            const minX = Math.min(points[i].X, points[i + 1].X);
            const maxX = Math.max(points[i].X, points[i + 1].X);
            for (let x = minX; x <= maxX; x++) {
                const minY = Math.min(points[i].Y, points[i + 1].Y);
                const maxY = Math.max(points[i].Y, points[i + 1].Y);
                if (scan.floorY < maxY) {
                    scan.floorY = maxY;
                }
                for (let y = minY; y <= maxY; y++) {
                    scan.map[y][x] = Character.Rock;
                }
            }
        }
    });

    scan.floorY += 2;

    return scan;
}

const FALL_DIRECTIONS: Point[] = [
    { X: 0, Y: 1 },
    { X: -1, Y: 1 },
    { X: 1, Y: 1 },
];

function maxUnitsOfSandResting(scan: Scan): number {
    let maxUnits = 0;

    while (true) {
        const currUnit: Point = { ...POURING_LOCATION };
        let isOutOfBounds = false;
        while (true) {
            let nextDir = { X: 0, Y: 0 };
            for (const d of FALL_DIRECTIONS) {
                const tempDir = scan.map[currUnit.Y + d.Y][currUnit.X + d.X];
                if (tempDir !== Character.Rock && tempDir !== Character.Sand) {
                    nextDir = { ...d };
                    break;
                }
            }
            if (nextDir.X === 0 && nextDir.Y === 0) {
                scan.map[currUnit.Y][currUnit.X] = Character.Sand;
                break;
            }
            currUnit.X += nextDir.X;
            currUnit.Y += nextDir.Y;
            if (currUnit.Y >= scan.map.length - 1) {
                isOutOfBounds = true;
                break;
            }
        }
        if (isOutOfBounds === true) {
            break;
        }
        maxUnits++;
    }

    return maxUnits;
}

function maxUnitsOfSandRestingWithFloor(scan: Scan): number {
    for (let x = 0; x < X_MAX; x++) {
        scan.map[scan.floorY][x] = Character.Rock;
    }

    let maxUnits = 0;

    while (true) {
        const currUnit: Point = { ...POURING_LOCATION };
        let isFilled = false;
        while (true) {
            let nextDir = { X: 0, Y: 0 };
            for (const d of FALL_DIRECTIONS) {
                const tempDir = scan.map[currUnit.Y + d.Y][currUnit.X + d.X];
                if (tempDir !== Character.Rock && tempDir !== Character.Sand) {
                    nextDir = { ...d };
                    break;
                }
            }
            if (nextDir.X === 0 && nextDir.Y === 0) {
                scan.map[currUnit.Y][currUnit.X] = Character.Sand;
                if (
                    currUnit.X === POURING_LOCATION.X &&
                    currUnit.Y === POURING_LOCATION.Y
                ) {
                    isFilled = true;
                }
                break;
            }
            currUnit.X += nextDir.X;
            currUnit.Y += nextDir.Y;
        }
        maxUnits++;
        if (isFilled === true) {
            break;
        }
    }

    return maxUnits;
}

const fileTest = "./example_data.txt";
const fileActual = "./data.txt";

console.log(maxUnitsOfSandResting(parseData(readData(fileActual))));
console.log(maxUnitsOfSandRestingWithFloor(parseData(readData(fileActual))));
