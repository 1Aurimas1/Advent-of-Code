package main

import (
    "fmt"
    "os"
    "strings"
    "strconv"
)

type Food struct {
    calories int
}

type Elf struct {
    food []Food
}

func readData(fileName string) string {
    data, _ := os.ReadFile(fileName)
    return string(data)
}

func parseData(data string) []Elf {
    var elves []Elf
    var food []Food
    words := strings.Split(data, "\n")

    for i := 0; i < len(words); i++ {
        if len(strings.TrimSpace(words[i])) == 0 { 
            elves = append(elves, Elf{food: food})
            food = []Food{}
            continue
        }

        calNum, _ := strconv.Atoi(words[i])
        food = append(food, Food{calories: calNum})
    }

    return elves
}

func findMostCaloriesCarried(elves []Elf) int {
    maxCal := 0

    for _, elf := range elves {
        tempCal := 0
        for _, food := range elf.food {
            tempCal += food.calories
        }
        if tempCal > maxCal {
            maxCal = tempCal
        }
    }

    return maxCal
}

func findMostCaloriesCarriedByThree(elves []Elf) int {
    const size int = 3
    var maxCals [size]int

    for _, elf := range elves {
        tempCal := 0
        for _, food := range elf.food {
            tempCal += food.calories
        }

        changeIdx := -1
        for i := 0; i < size; i++ {
            if tempCal > maxCals[i] {
                changeIdx = i
            }
        }
        if changeIdx < 0 { continue }

        for i := changeIdx - 1; i > 0; i-- {
            maxCals[i] = maxCals[i + 1]
        }
        maxCals[changeIdx] = tempCal
    }

    totalCal := 0
    for i := 0; i < size; i++ {
        totalCal += maxCals[i]
    }

    return totalCal
}

func main() {
    fileName := "./data.txt"

    elves := parseData(readData(fileName))
    fmt.Println(findMostCaloriesCarried(elves))
    fmt.Println(findMostCaloriesCarriedByThree(elves))
}
