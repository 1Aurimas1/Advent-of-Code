class Operation {
    private operator: string;
    private operand: string;

    constructor(operator: string, operand: string) {
        this.operator = operator;
        this.operand = operand;
    }

    public calculate(operand: number): number {
        if (this.operand === "old") {
            return operand * operand;
        }

        let result = 0;
        switch (this.operator) {
            case "+":
                result = +this.operand + operand;
                break;
            case "-":
                result = +this.operand - operand;
                break;
            case "*":
                result = +this.operand * operand;
                break;
            case "/":
                result = +this.operand / operand;
                break;
        }
        return result;
    }
}

class Test {
    private divisor: number;
    private passed: number;
    private failed: number;

    constructor(divisor: number, passed: number, failed: number) {
        this.divisor = divisor;
        this.passed = passed;
        this.failed = failed;
    }

    public outcome(result: number): number {
        if (result % this.divisor === 0) {
            return this.passed;
        }
        return this.failed;
    }

    public getDivisor() {
        return this.divisor;
    }
}

type Monkey = {
    startingItems: number[];
    operation: Operation;
    test: Test;
};

function readData(fileName: string): string {
    return Deno.readTextFileSync(fileName);
}

function parseData(input: string): Monkey[] {
    return input.split("\n\n").filter((x) => x).map((monkey) => {
        const parts = monkey.split("    ");
        const lines = parts[0].split("\n").slice(1);
        const startingItems: number[] = lines[0].split(":")[1].split(",").map(
            (item) => +item.trim(),
        );
        const operation = lines[1].split(":")[1].split(" ");
        const divisor: number = +lines[2].split(" ").pop()!;
        const passed: number = +parts[1].split(" ").pop()!;
        const failed: number = +parts[2].split(" ").pop()!;
        const op: Operation = new Operation(
            operation[operation.length - 2],
            operation[operation.length - 1],
        );
        return {
            startingItems: startingItems,
            operation: op,
            test: new Test(divisor, passed, failed),
        };
    });
}

function numberOfInspectionsByTwoMonkeysMultiplied(
    monkeys: Monkey[],
    rounds: number,
): number {
    const totalInspections: number[] = Array.from(
        { length: monkeys.length },
        (_) => 0,
    );

    for (let i = 0; i < rounds; i++) {
        for (let j = 0; j < monkeys.length; j++) {
            while (monkeys[j].startingItems.length > 0) {
                let worryLevel: number = monkeys[j].startingItems.shift()!;
                worryLevel = Math.floor(
                    monkeys[j].operation.calculate(worryLevel) / 3,
                );
                const monkeyIdx = monkeys[j].test.outcome(worryLevel);
                monkeys[monkeyIdx].startingItems.push(worryLevel);
                totalInspections[j]++;
            }
        }
    }

    totalInspections.sort((a, b) => b - a);
    return totalInspections[0] * totalInspections[1];
}

function numberOfInspectionsByTwoMonkeysMultiplied2(
    monkeys: Monkey[],
    rounds: number,
): number {
    const totalInspections: number[] = Array.from(
        { length: monkeys.length },
        (_) => 0,
    );

    const divisor = monkeys.reduce((a, b) => {
        return a * b.test.getDivisor();
    }, 1);

    for (let i = 0; i < rounds; i++) {
        for (let j = 0; j < monkeys.length; j++) {
            while (monkeys[j].startingItems.length > 0) {
                let worryLevel: number = monkeys[j].startingItems.shift()!;
                worryLevel = monkeys[j].operation.calculate(worryLevel);
                worryLevel = worryLevel % divisor;
                const monkeyIdx = monkeys[j].test.outcome(worryLevel);
                monkeys[monkeyIdx].startingItems.push(worryLevel);
                totalInspections[j]++;
            }
        }
    }

    totalInspections.sort((a, b) => b - a);
    return totalInspections[0] * totalInspections[1];
}

const fileName = "./data.txt";
let rounds = 20;
console.log(
    numberOfInspectionsByTwoMonkeysMultiplied(parseData(readData(fileName)), rounds),
);
rounds = 10000;
console.log(
    numberOfInspectionsByTwoMonkeysMultiplied2(
        parseData(readData(fileName)),
        rounds,
    ),
);
