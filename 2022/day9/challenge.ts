enum Directions {
    Up = "U",
    Right = "R",
    Down = "D",
    Left = "L",
}

interface Point {
    X: number;
    Y: number;
}

interface Motion {
    direction: Directions;
    steps: number;
}

interface Position {
    [visited: string]: number;
}

function readFile(): string {
    const fileName = "./data.txt";
    return Deno.readTextFileSync(fileName);
}

function parseData(input: string): Motion[] {
    return input.split("\n").filter((x) => x).map((line) => {
        const pair: string[] = line.split(" ");
        return { direction: pair[0] as Directions, steps: +pair[1] };
    });
}

function tailPositionCount(motions: Motion[]): number {
    const positions: Position = {};
    const curr: Point = { X: 0, Y: 0 };
    const tailPos: Point[] = [];

    tailPos.push({ X: curr.X, Y: curr.Y });
    positions[curr.X.toString() + curr.Y.toString()] = 1;

    for (const motion of motions) {
        let modifierX = 0;
        let modifierY = 0;
        switch (motion.direction) {
            case Directions.Up:
                modifierY = 1;
                break;
            case Directions.Right:
                modifierX = 1;
                break;
            case Directions.Down:
                modifierY = -1;
                break;
            case Directions.Left:
                modifierX = -1;
                break;
            default:
                console.log("Undefined move");
                break;
        }

        let candidate: Point = { X: curr.X, Y: curr.Y };
        for (let i = 0; i < motion.steps; i++) {
            candidate = { X: curr.X, Y: curr.Y };
            curr.X += modifierX;
            curr.Y += modifierY;
            if (
                Math.abs(curr.X - tailPos[tailPos.length - 1].X) < 2 &&
                Math.abs(curr.Y - tailPos[tailPos.length - 1].Y) < 2
            ) {
                candidate = { X: curr.X, Y: curr.Y };
                continue;
            }
            tailPos.push({ X: candidate.X, Y: candidate.Y });
        }
    }

    let totalUniquePos = 0;
    for (let i = 0; i < tailPos.length; i++) {
        let exists = false;
        for (let j = i + 1; j < tailPos.length; j++) {
            if (
                tailPos[i].X === tailPos[j].X && tailPos[i].Y === tailPos[j].Y
            ) {
                exists = true;
                break;
            }
        }
        if (exists == false) {
            totalUniquePos++;
        }
    }

    return totalUniquePos;
}

const DIRECTIONS: Point[] = [
    { X: 0, Y: 1 },
    { X: 0, Y: -1 },
    { X: 1, Y: 0 },
    { X: -1, Y: 0 },
    { X: -1, Y: 1 },
    { X: 1, Y: 1 },
    { X: -1, Y: -1 },
    { X: 1, Y: -1 },
];

function distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.X - p1.X, 2) + Math.pow(p2.Y - p1.Y, 2));
}

function tailPositionCount2(motions: Motion[]): number {
    const positions: Position = {};
    const curr: Point = { X: 0, Y: 0 };
    const tailPos: Point[] = [];
    const rope: Point[] = Array.from({ length: 10 }, () => {
        return { X: 0, Y: 0 };
    });

    tailPos.push({ X: curr.X, Y: curr.Y });
    positions[curr.X.toString() + curr.Y.toString()] = 1;

    for (const motion of motions) {
        let modifierX = 0;
        let modifierY = 0;
        switch (motion.direction) {
            case Directions.Up:
                modifierY = 1;
                break;
            case Directions.Right:
                modifierX = 1;
                break;
            case Directions.Down:
                modifierY = -1;
                break;
            case Directions.Left:
                modifierX = -1;
                break;
            default:
                console.log("Undefined move");
                break;
        }

        for (let i = 0; i < motion.steps; i++) {
            rope[0].X += modifierX;
            rope[0].Y += modifierY;
            for (let j = 1; j < rope.length; j++) {
                if (
                    Math.abs(rope[j - 1].X - rope[j].X) > 1 ||
                    Math.abs(rope[j - 1].Y - rope[j].Y) > 1
                ) {
                    let minDist = distance({
                        X: rope[j].X + DIRECTIONS[0].X,
                        Y: rope[j].Y + DIRECTIONS[0].Y,
                    }, rope[j - 1]);
                    let nextDir = { X: DIRECTIONS[0].X, Y: DIRECTIONS[0].Y };

                    DIRECTIONS.forEach((p) => {
                        const newDist = distance({
                            X: rope[j].X + p.X,
                            Y: rope[j].Y + p.Y,
                        }, rope[j - 1]);
                        if (newDist < minDist) {
                            minDist = newDist;
                            nextDir = { X: p.X, Y: p.Y };
                        }
                    });

                    rope[j] = {
                        X: rope[j].X + nextDir.X,
                        Y: rope[j].Y + nextDir.Y,
                    };
                } 
            }

            tailPos.push({
                X: rope[rope.length - 1].X,
                Y: rope[rope.length - 1].Y,
            });
            positions[
                rope[rope.length - 1].X.toString() +
                rope[rope.length - 1].Y.toString()
            ] = 1;
        }
    }

    let uniqueTailPos = 0;
    for (let i = 0; i < tailPos.length; i++) {
        let exists = false;
        for (let j = i + 1; j < tailPos.length; j++) {
            if (
                tailPos[i].X === tailPos[j].X && tailPos[i].Y === tailPos[j].Y
            ) {
                exists = true;
                break;
            }
        }
        if (exists == false) {
            uniqueTailPos++;
        }
    }

    return uniqueTailPos;
}

console.log(tailPositionCount(parseData(readFile())));
console.log(tailPositionCount2(parseData(readFile())));
