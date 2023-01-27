package main

import (
	"fmt"
	"os"
	"strings"
)

const (
	Rock     int = 1
	Paper        = 2
	Scissors     = 3
)

const (
	Lose = 'X'
	Draw = 'Y'
	Win  = 'Z'
)

type Game struct {
	opponentChoices []byte
	playerChoices   []byte
	length          int
}

func readData(fileName string) string {
	data, _ := os.ReadFile(fileName)
	return string(data)
}

func parseData(data string) Game {
	var game Game

	lines := strings.Split(data, "\n")
	game.length = len(lines) - 1
	for i := 0; i < game.length; i++ {
		choices := strings.Split(lines[i], " ")
		game.opponentChoices = append(game.opponentChoices, []byte(choices[0])[0])
		game.playerChoices = append(game.playerChoices, []byte(choices[1])[0])
	}

	return game
}

func calculateRoundScore(opponentChoice int, playerChoice int) int {
	score := playerChoice

	if opponentChoice == playerChoice {
		score += 3
	} else if opponentChoice == Rock && playerChoice == Paper ||
		opponentChoice == Paper && playerChoice == Scissors ||
		opponentChoice == Scissors && playerChoice == Rock {
		score += 6
	}

	return score
}

func findTotalScore1(game Game, weights map[byte]int) int {
	totalScore := 0

	for i := 0; i < game.length; i++ {
		opponentChoice := weights[game.opponentChoices[i]]
		playerChoice := weights[game.playerChoices[i]]

		totalScore += calculateRoundScore(opponentChoice, playerChoice)
	}

	return totalScore
}

func findTotalScore2(game Game, weights map[byte]int) int {
	totalScore := 0

	for i := 0; i < game.length; i++ {
		opponentChoice := weights[game.opponentChoices[i]]
		playerChoice := weights[game.playerChoices[i]]
		playerSymbol := game.playerChoices[i]
        
		if playerSymbol == Draw {
			playerChoice = opponentChoice
		} else if playerSymbol == Win {
			if opponentChoice == Rock {
				playerChoice = Paper
			} else if opponentChoice == Paper {
				playerChoice = Scissors
			} else {
				playerChoice = Rock
			}
		} else if playerSymbol == Lose {
			if opponentChoice == Rock {
				playerChoice = Scissors
			} else if opponentChoice == Paper {
				playerChoice = Rock
			} else {
				playerChoice = Paper
			}
		}
		totalScore += calculateRoundScore(opponentChoice, playerChoice)
	}

	return totalScore
}

func main() {
	fileName := "./data.txt"

	game := parseData(readData(fileName))
	weights := make(map[byte]int)
	weights['A'] = Rock
	weights['B'] = Paper
	weights['C'] = Scissors
	weights['Y'] = Paper
	weights['X'] = Rock
	weights['Z'] = Scissors
	fmt.Println(findTotalScore1(game, weights))
	fmt.Println(findTotalScore2(game, weights))
}
