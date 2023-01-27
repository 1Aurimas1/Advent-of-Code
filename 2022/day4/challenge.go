package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Section struct {
    start int
    end int
}

type Assignment struct {
    sections []Section
}

func readData(fileName string) string {
    input, _ := os.ReadFile(fileName)
    return string(input)
}

func parseData(input string) []Assignment {
    var assignments []Assignment

    lines := strings.Split(input, "\n")
    lines = lines[:len(lines) - 1]
    for _, line := range lines {
        var section Section
        var assignment Assignment

        sections := strings.Split(line, ",")
        for _, sectionRange := range sections {
            secRange := strings.Split(sectionRange, "-")
            section.start, _ = strconv.Atoi(secRange[0])
            section.end, _ = strconv.Atoi(secRange[1])
            assignment.sections = append(assignment.sections, section)
        }

        assignments = append(assignments, assignment)
    }

    return assignments
}

func fullyContainedSections(assignments []Assignment) int {
    fullyContained := 0

    for i := 0; i < len(assignments); i++ {
        assignment := assignments[i]
        if assignment.sections[0].start >= assignment.sections[1].start &&
        assignment.sections[0].end <= assignment.sections[1].end || 
        assignment.sections[1].start >= assignment.sections[0].start && 
        assignment.sections[1].end <= assignment.sections[0].end {
            fullyContained++
        }
    }

    return fullyContained
}

func overlapsBetweenSections(assignments []Assignment) int {
    overlapCount := 0

    for i := 0; i < len(assignments); i++ {
        assignment := assignments[i]
        if assignment.sections[0].start <= assignment.sections[1].end &&
        assignment.sections[0].end >= assignment.sections[1].end || 
        assignment.sections[1].start <= assignment.sections[0].end && 
        assignment.sections[1].end >= assignment.sections[0].end {
            overlapCount++
        }
    }

    return overlapCount
}

func main() {
    fileName := "./data.txt"

    assignments := parseData(readData(fileName))
    fmt.Println(fullyContainedSections(assignments))
    fmt.Println(overlapsBetweenSections(assignments))
}

