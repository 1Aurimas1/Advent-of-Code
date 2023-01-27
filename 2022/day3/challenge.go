package main

import (
	"fmt"
	"os"
	"strings"
)

func readData(fileName string) string {
	input, _ := os.ReadFile(fileName)
	return string(input)
}

func parseData(input string) []string {
	var lines []string = strings.Split(input, "\n")

	return lines[:len(lines)-1]
}

func sharedItemSum(lines []string) rune {
	var prioritySum rune = 0
	const firstHalf = -1
	const secondHalf = 1

	for _, line := range lines {
		uniqueItems := make(map[rune]int)
		for idx, letter := range line {
			if idx >= len(line)/2 {
				if val, exists := uniqueItems[letter]; exists && val < secondHalf {
					if 'a' <= letter && letter <= 'z' {
						prioritySum += letter - 'a' + 1
					} else if 'A' <= letter && letter <= 'Z' {
						prioritySum += letter - 'A' + 27
					}
				}
				uniqueItems[letter] = 1
			} else {
				uniqueItems[letter] = -1
			}
		}
	}

	return prioritySum
}

func sharedItemSumInGroup(lines []string) rune {
	var prioritySum rune = 0
	uniqueItems := make(map[rune]int)
	const group int = 3
	groupItemOccurence := 1

	for idx, line := range lines {
		if idx%group == 0 {
			uniqueItems = make(map[rune]int)
			groupItemOccurence = 1
		}

		for _, letter := range line {
			if val, _ := uniqueItems[letter]; val+1 == groupItemOccurence {
				uniqueItems[letter] = groupItemOccurence
				if groupItemOccurence%group == 0 {
					if 'a' <= letter && letter <= 'z' {
						prioritySum += letter - 'a' + 1
					} else if 'A' <= letter && letter <= 'Z' {
						prioritySum += letter - 'A' + 27
					}
                    break;
				}
			}
		}
		groupItemOccurence++
	}

	return prioritySum
}

func main() {
	fileName := "./data.txt"

	lines := parseData(readData(fileName))
	fmt.Println(sharedItemSum(lines))
	fmt.Println(sharedItemSumInGroup(lines))
}
