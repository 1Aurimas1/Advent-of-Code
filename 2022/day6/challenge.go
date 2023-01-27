package main

import (
	"fmt"
	"os"
	"strings"
)

const startOfPacketLength int = 4
const startOfMessageLength int = 14

type Buffer struct {
	arr     []rune
}

func makeBuffer(arr []rune) Buffer {
	return Buffer{arr}
}

func (b *Buffer) enqueue(c rune) {
	i := 0
	for ; i < len(b.arr)-1; i++ {
		b.arr[i] = b.arr[i+1]
	}
	b.arr[i] = c
}

func (b *Buffer) hasDuplicates() bool {
	for i := 0; i < len(b.arr); i++ {
		for j := i + 1; j < len(b.arr); j++ {
			if b.arr[i] == b.arr[j] {
				return true
			}
		}
	}
	return false
}

func readData(fileName string) string {
	input, _ := os.ReadFile(fileName)

	return string(input)
}

func findPacketMarkerEndingPos(datastream string) int {
	buffer := makeBuffer([]rune(datastream[:startOfPacketLength]))

	for i := startOfPacketLength; i < len(datastream); i++ {
		if !buffer.hasDuplicates() {
			return i
		}
		buffer.enqueue(rune(datastream[i]))
	}

	return -1
}

func findMessageMarkerEndingPos(datastream string) int {
	buffer := makeBuffer([]rune(datastream[:startOfMessageLength]))

	for i := startOfMessageLength; i < len(datastream); i++ {
		if !buffer.hasDuplicates() {
			return i
		}
		buffer.enqueue(rune(datastream[i]))
	}

	return -1
}

func main() {
	fileName := "./data.txt"

	datastream := readData(fileName)
    // to check multiple streams from example_data.txt
	streams := strings.Split(datastream, "\n")
	for i := 0; i < len(streams)-1; i++ {
        // first part
		//fmt.Println(findPacketMarkerEndingPos(streams[i]))
        // second part
		fmt.Println(findMessageMarkerEndingPos(streams[i]))
	}
}
