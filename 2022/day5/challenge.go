package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type Stack struct {
	crates []rune
}

type Procedure struct {
	move int
	from int
	to   int
}

func (s *Stack) getSize() int {
	return len(s.crates)
}

func (s *Stack) pop() rune {
	idx := s.getSize() - 1
	topCrate := s.crates[idx]
	s.crates = s.crates[:idx]

	return topCrate
}

func (s *Stack) peek() rune {
	return s.crates[s.getSize()-1]
}

func readData(fileName string) string {
	input, _ := os.ReadFile(fileName)

	return string(input)
}

func parseData(input string) ([]Stack, []Procedure) {
	parts := strings.Split(input, "\n\n")

	return parseStacks(parts[0]), parseProcedures(parts[1])
}

func parseStacks(input string) []Stack {
	lines := strings.Split(input, "\n")
	idx := len(lines) - 1
	stackNums := strings.Split(lines[idx], " ")
	totalStacks, _ := strconv.Atoi(stackNums[len(stackNums)-2])
	stacks := make([]Stack, totalStacks)
	for i := idx - 1; i >= 0; i-- {
		stackIdx := 0
		line := []rune(lines[i])
		for j := 1; j < len(line); j += 4 {
			crateLetter := line[j]
			if crateLetter != ' ' {
				stacks[stackIdx].crates = append(stacks[stackIdx].crates, crateLetter)
			}
			stackIdx++
		}
	}

	return stacks
}

func parseProcedures(input string) []Procedure {
	var procedures []Procedure
	lines := strings.Split(input, "\n")
	for i := 0; i < len(lines)-1; i++ {
		reg := regexp.MustCompile("[0-9]+")
		nums := reg.FindAllString(lines[i], -1)

		var parsedNums []int
		for _, num := range nums {
			n, _ := strconv.Atoi(num)
			parsedNums = append(parsedNums, n)
		}

		procedures = append(procedures, Procedure{parsedNums[0], parsedNums[1], parsedNums[2]})
	}

	return procedures
}

func rearrangeCrates(stacks []Stack, procedures []Procedure) {
	for _, procedure := range procedures {
		for i := 0; i < procedure.move; i++ {
			crate := stacks[procedure.from-1].pop()
			stacks[procedure.to-1].crates = append(stacks[procedure.to-1].crates, crate)
		}
	}
}

func rearrangeCrates2(stacks []Stack, procedures []Procedure) {
	for _, procedure := range procedures {
		crates := make([]rune, procedure.move)
		for i := 0; i < procedure.move; i++ {
			crate := stacks[procedure.from-1].pop()
			crates[i] = crate
		}
		for i := len(crates) - 1; i >= 0; i-- {
			stacks[procedure.to-1].crates = append(stacks[procedure.to-1].crates, crates[i])
		}
	}
}

func topCrates(stacks []Stack) []rune {
	var crates []rune
	for _, stack := range stacks {
		crates = append(crates, stack.peek())
	}
	return crates
}

func main() {
	fileName := "./data.txt"

	stacks, procedures := parseData(readData(fileName))
    // Part 1
	//rearrangeCrates(stacks, procedures)
	//fmt.Println(string(topCrates(stacks)))
    // Part 2
	rearrangeCrates2(stacks, procedures)
	fmt.Println(string(topCrates(stacks)))
}
