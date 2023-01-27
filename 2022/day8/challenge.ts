const fileName = "./data.txt";

function readData(): string {
    return Deno.readTextFileSync(fileName);
}

function parseData(input: string): Uint8Array[] {
    return input.split("\n").filter((x) => x).map((line) =>
        new Uint8Array(line.split("").map((char) => +char))
    );
}

function treesVisibleFromOutside(grid: Uint8Array[]): number {
    let visibleTreeCount = 0;
    const rowPrevMax = new Uint8Array(grid[0]);

    for (let i = 1; i < grid.length - 1; i++) {
        let colPrevMax = -1;
        for (let j = 1; j < grid[i].length - 1; j++) {
            if (grid[i][j - 1] > colPrevMax) {
                colPrevMax = grid[i][j - 1];
            }
            if (grid[i - 1][j] > rowPrevMax[j]) {
                rowPrevMax[j] = grid[i - 1][j];
            }
            if (grid[i][j] > rowPrevMax[j] || grid[i][j] > colPrevMax) {
                visibleTreeCount++;
                continue;
            }
            let isVisible = true;
            // col-wise forward check
            for (let k = j + 1; k < grid[i].length; k++) {
                if (grid[i][j] <= grid[i][k]) {
                    isVisible = false;
                    break;
                }
            }
            if (isVisible) {
                visibleTreeCount++;
                continue;
            }
            isVisible = true;
            // row-wise bottom check
            for (let k = i + 1; k < grid.length; k++) {
                if (grid[i][j] <= grid[k][j]) {
                    isVisible = false;
                    break;
                }
            }
            if (isVisible) {
                visibleTreeCount++;
                continue;
            }
        }
    }
    //add trees on the edge
    visibleTreeCount += grid.length * 2 + (grid[0].length - 2) * 2;

    return visibleTreeCount;
}

function highestScenicScoreForAnyTree(grid: Uint8Array[]): number {
    let scenicScoreMax = 0;

    for (let i = 1; i < grid.length - 1; i++) {
        for (let j = 1; j < grid[i].length - 1; j++) {
            let scenicScore = 1;
            let visibleTrees = 0;
            // col-wise left check
            for (let k = j - 1; k >= 0; k--) {
                visibleTrees++;
                if (grid[i][j] <= grid[i][k]) {
                    break;
                }
            }
            scenicScore *= visibleTrees;

            visibleTrees = 0;
            // row-wise top check
            for (let k = i - 1; k >= 0; k--) {
                visibleTrees++;
                if (grid[i][j] <= grid[k][j]) {
                    break;
                }
            }
            scenicScore *= visibleTrees;
            visibleTrees = 0;
            // col-wise forward check
            for (let k = j + 1; k < grid[i].length; k++) {
                visibleTrees++;
                if (grid[i][j] <= grid[i][k]) {
                    break;
                }
            }
            scenicScore *= visibleTrees;

            visibleTrees = 0;
            // row-wise bottom check
            for (let k = i + 1; k < grid.length; k++) {
                visibleTrees++;
                if (grid[i][j] <= grid[k][j]) {
                    break;
                }
            }
            scenicScore *= visibleTrees;
            if (scenicScoreMax < scenicScore) {
                scenicScoreMax = scenicScore;
            }
        }
    }

    return scenicScoreMax;
}

console.log(treesVisibleFromOutside(parseData(readData())));
console.log(highestScenicScoreForAnyTree(parseData(readData())));
