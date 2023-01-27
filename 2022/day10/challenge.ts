function readData(fileName: string): string {
    return Deno.readTextFileSync(fileName);
}

type Instruction = {
    name: string;
    value: number;
};

function parseData(input: string): Instruction[] {
    return input.split("\n").filter((x) => x).map((x) => {
        const parts = x.split(" ");
        return { name: parts[0], value: +parts[1] | 0 };
    });
}

function sumSignalStrengths(instructions: Instruction[]): number {
    let X = 1;
    let sumStrengths = 0;
    let currInstructionCycle = 0;
    let cycleCount = 0;
    const strengthCycle = 40;
    const endCycle = 220;

    for (let i = 0; i < instructions.length;) {
        if (instructions[i].name === "addx") {
            if (currInstructionCycle == 2) {
                currInstructionCycle = 0;
            }
        } else {
            currInstructionCycle = 1;
        }

        cycleCount++;
        if ((cycleCount - strengthCycle / 2) % strengthCycle == 0) {
            sumStrengths += X * cycleCount;
            if (endCycle == cycleCount) {
                break;
            }
        }

        currInstructionCycle++;
        if (currInstructionCycle == 2) {
            X += instructions[i].value;
            i++;
        }
    }

    return sumStrengths;
}

function renderImage(instructions: Instruction[]): string {
    let X = 1;
    let currCRTRow = "";
    let image = "";
    let currInstructionCycle = 0;
    let cycleCount = 0;
    const strengthCycle = 40;
    const endCycle = 240;

    for (let i = 0; i < instructions.length;) {
        if (instructions[i].name === "addx") {
            if (currInstructionCycle == 2) {
                currInstructionCycle = 0;
            }
        } else {
            currInstructionCycle = 1;
        }

        if (X - 1 <= currCRTRow.length && currCRTRow.length <= X + 1) {
            currCRTRow += "#";
        } else {
            currCRTRow += ".";
        }

        cycleCount++;
        if (cycleCount % strengthCycle == 0) {
            image += currCRTRow + "\n";
            currCRTRow = "";
            if (endCycle == cycleCount) {
                break;
            }
        }

        currInstructionCycle++;
        if (currInstructionCycle == 2) {
            X += instructions[i].value;
            i++;
        }
    }

    return image;
}

const fileName = "./data.txt";
console.log(sumSignalStrengths(parseData(readData(fileName))));
console.log(renderImage(parseData(readData(fileName))));
