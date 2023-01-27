const fileName = "./data.txt";

class Directory {
    name: string;
    size: number;

    constructor(name: string, size: number = 0) {
        this.name = name;
        this.size = size;
    }
}

function readData() {
    return Deno.readTextFileSync(fileName);
}

function parseData(input: string) {
    return input.split("\n").filter((x) => x);
}

function firstPart(logLines: string[]) {
    const minSize = 100000;
    const dirCandidates: Directory[] = [];
    const dirStack: Directory[] = [];
    for (const line of logLines) {
        const parts = line.split(" ");
        if (parts[0] === "$") {
            if (parts[1] === "cd") {
                if (parts[2] !== "..") {
                    dirStack.push(new Directory(parts[2]));
                } else {
                    const dir = dirStack.pop();
                    if (dir) {
                        if (dir.size <= minSize) {
                            dirCandidates.push(dir);
                        }
                        dirStack[dirStack.length - 1].size += dir.size;
                    }
                }
            }
        } else if (parts[0] !== "dir") {
            dirStack[dirStack.length - 1].size += +parts[0];
        }
    }

    let totalSize = 0;
    for (const dir of dirCandidates) {
        totalSize += dir.size;
    }
    console.log(totalSize);
}

function secondPart(logLines: string[]) {
    const diskMaxSize = 70000000;
    const diskFreeTargetSize = 30000000;
    const dirStack: Directory[] = [];
    let minDiff = diskMaxSize;
    const dirs = new Map<string, number>();
    for (const line of logLines) {
        const parts = line.split(" ");
        if (parts[0] === "$") {
            if (parts[1] === "cd") {
                if (parts[2] !== "..") {
                    dirStack.push(new Directory(parts[2]));
                } else {
                    const dir = dirStack.pop();
                    if (dir) {
                        dirs.set(dir.name, dir.size);
                        dirStack[dirStack.length - 1].size += dir.size;
                    }
                }
            }
        } else if (parts[0] !== "dir") {
            dirStack[dirStack.length - 1].size += +parts[0];
        }
    }

    let totalSpaceUsed = 0;
    while (dirStack.length > 0) {
        const dir = dirStack.pop();
        if (dir) {
            totalSpaceUsed += dir.size;
            dirs.set(dir.name, totalSpaceUsed);
        }
    }

    for (const val of dirs.values()) {
        if (diskMaxSize - totalSpaceUsed + val >= diskFreeTargetSize) {
            if (minDiff > val) minDiff = val;
        }
    }
    console.log(minDiff);
}

firstPart(parseData(readData()));
secondPart(parseData(readData()));
