#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import {places} from './places.js';
import {pieces} from './pieces.js';
var pixels = [];
var playablePlaces = []

function askQuestion(query) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise(answer => rl.question(query, ans => {
		rl.close();
		answer(ans);
	}))
}

///GENERATES INITAL BLANK PIXELS///
function pixelGen(){
	const rows = 34;
	const columns = 76;

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			pixels.push({c: c, r: r, bgColour: '', colour: '', char: ' ', type:'', piece:''});
		}	
	}
}

///APPLIES PROPERTIES OF PLAYABLE SPACES ONTO PIXELS///
function updatePixels() {
	function applyProperties(pixel, place){
		for (let i = 0; i < 4; i++){
			pixels[pixel+i].bgColour = place.colour
			pixels[pixel+i].colour = place.occupied
			if (place.occupied == ''){
				pixels[pixel+i].char = ' '
			} else {
				pixels[pixel+i].char = '\u256C'
			}
		}
	}

	///FINDS THE MATCHING PIXELS FOR THE PLAYABLE SPACES///
	places.forEach(a => {
		var match = pixels.findIndex(p => {
			return p.c == a.c && p.r == a.r
		})
		applyProperties(match, a)

		var match = pixels.findIndex(p => {
			return p.c == a.c && p.r == a.r + 1
		})
		applyProperties(match, a)
	})
}

///DISPLAYS BOARD///
function refreshBoard() {
	var loops = 0
	var output = ''
	for (let i = 0; i < pixels.length; i++){
		var c
		switch (pixels[i].bgColour) {
			case 'red':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(69, 3, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(69, 3, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(69, 3, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(69, 3, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(69, 3, 0)(pixels[i].char); break;
				}	

				break;
			case 'blue':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(0, 34, 69).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(0, 34, 69).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(0, 34, 69).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(0, 34, 69).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(0, 34, 69)(pixels[i].char); break;
				}	

				break;
			case 'white':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(64, 64, 64).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(64, 64, 64).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(64, 64, 64).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(64, 64, 64).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(64, 64, 64)(pixels[i].char); break;
				}	

				break;
			case 'green':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(0, 69, 6).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(0, 69, 6).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(0, 69, 6).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(0, 69, 6).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(0, 69, 6)(pixels[i].char); break;
				}	

				break;
			case 'yellow':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(69, 65, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(69, 65, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(69, 65, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(69, 65, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(69, 65, 0).yellow.bold(pixels[i].char); break;
				}

				break;
			default:
				c = chalk.rgb(0,0,0)(pixels[i].char); break;
		}
		output += c
		loops++
		if (loops == 76) {
			console.log(output)
			output = ''
			loops = 0
		}
	}
}

async function start() {
	var players = ['red', 'blue', 'yellow', 'green']
	var turn = 0
	var activePlayer, finished, roll, playerPieces, startPos, newPos, endPos, unableToMove, captured, capturedPieces, rollover, choice, distance, playerName

	function setStartPos() {
		switch (activePlayer){
			case 'red':
				startPos = 1
				break;
			case 'blue':
				startPos = 8
				break;
			case 'yellow':
				startPos = 15
				break;
			case 'green':
				startPos = 22
				break;
		}
	}

	function checkPieces(player) { //POTENTIALLY CHECKS ALL STATES AND RETURNS PROFILE OF ALL PIECES TO BE REFERRED TO THROUGHOUT TURN
		var homePieces = pieces.filter(a => a.state == 'home' && a.colour == player)
		var boardPieces = pieces.filter(a => a.state == '' && a.colour == player && a.pos != startPos)
		var finalPieces = pieces.filter(a => a.state == 'final' && a.colour == player)
		var startPieces = pieces.find(a => a.pos == startPos && a.state == '' && a.colour == activePlayer)
		return [homePieces, boardPieces, finalPieces, startPieces]
	}

	function checkPlace(pos, type, colour) {
		if (type == 'final') {
			if (places.find(a => a.pos == pos && a.type == type && a.colour == colour).occupied == '') {
				return true
			}
		} else if (places.find(a => a.pos == pos && a.type == type).occupied == '') {
			return true
		}
	}

	function leaveHome(homePiece) {
			choice = homePiece.num
			var piece = pieces.findIndex(a => a.num == homePiece.num && a.colour == activePlayer)
			var place = places.findIndex(a => a.pos == homePiece.num && a.colour == activePlayer && a.type == 'home')
			var newPlace = places.findIndex(a => a.pos == startPos && a.type == '')
			pieces[piece].distance = 1
			pieces[piece].state = ''
			pieces[piece].pos = places[newPlace].pos
			places[place].occupied = ''
			places[newPlace].occupied = activePlayer
	}

	function movePiece(stdPiece, type) {
		choice = stdPiece.num
		var piece = pieces.findIndex(a => a.num == stdPiece.num && a.colour == activePlayer)
		var place = places.findIndex(a => a.pos == stdPiece.pos && a.type == '')

		if (type == '') {
			var newPlace = places.findIndex(a => a.pos == newPos && a.type == type)
		} else if (type == 'final') {
			var newPlace = places.findIndex(a => a.pos == newPos && a.type == type && a.colour == activePlayer)
		}
		

		if (rollover == true) {
			capturedPieces = pieces.filter(a => a.state == type && a.pos > pieces[piece].pos && a.pos <= 28)
			capturedPieces.concat(pieces.filter(a => a.state == type && a.pos >= 1 && a.pos < places[newPlace].pos))
		} else {
			capturedPieces = pieces.filter(a => a.state == type && a.pos > pieces[piece].pos && a.pos < places[newPlace].pos)
		}
		
		pieces[piece].distance += roll
		pieces[piece].pos = places[newPlace].pos
		pieces[piece].state = type
		places[place].occupied = ''
		places[newPlace].occupied = activePlayer

		capturedPieces.length > 0 ? returnPieces(capturedPieces) : captured = false
	}

	function returnPieces(stdPieces){
		captured = true
		capturedPieces = stdPieces.filter(a => a.colour != activePlayer)
		capturedPieces.forEach(a => {
			var piece = pieces.findIndex(b => b.num == a.num && b.colour == a.colour)
			var place = places.findIndex(b => b.pos == a.pos && b.type == a.state)
			var newPlace = places.findIndex(b => b.colour == a.colour && b.pos == a.num && b.type == 'home')

			pieces[piece].distance = 0
			pieces[piece].pos = places[newPlace].pos
			pieces[piece].state = 'home'
			places[place].occupied = ''
			places[newPlace].occupied = pieces[piece].colour
		})
	}

	function report() {
		var place, name

		function numToWord(number) {
			switch (number) {
				case 1 : return 'first'; break;
				case 2 : return 'second'; break;
				case 3 : return 'third'; break;
				case 4 : return 'fourth'; break;
			}
		}

		switch (activePlayer) {
			case 'red' : playerName = chalk.red('Red'); break;
			case 'blue' : playerName = chalk.blue('Blue'); break;
			case 'yellow' : playerName = chalk.yellow('Yellow') ; break;
			case 'green' : playerName = chalk.green('Green'); break;
		}

		console.log(playerName + ' has rolled a ' + roll)

		if (captured == true) {
			capturedPieces.forEach(a => {
				switch (a.colour) {
					case 'red' : name = chalk.red('Reds'); break;
					case 'blue' : name = chalk.blue('Blues'); break;
					case 'yellow' : name = chalk.yellow('Yellows') ; break;
					case 'green' : name = chalk.green('Greens'); break;
				}
			console.log(numToWord(a.num) + ' ' + place + ' piece was sent home by ' + playerName + '!')
			})
		}
		if (unableToMove) {
			console.log(playerName + ' is unable to move...')
		} else {
			console.log(playerName + ' moved their ' + numToWord(choice) + ' piece')
		}
	}

	function checkWinner() {
		var finishedPieces = pieces.filter(a => a.colour == activePlayer && a.state == 'final')
		if (finishedPieces != null && finishedPieces.length == 4) {
			finished = 1
		}
	}

	do {
		turn++
		if (turn == 4) turn = 0
		activePlayer = players[turn]
		unableToMove = true
		captured = false
		rollover = false
		setStartPos()
	
		roll = Math.floor(Math.random() * 6) + 1;

		playerPieces = checkPieces(activePlayer)

		if (playerPieces[0].length > 0 && roll == 6 && checkPlace(startPos, '', activePlayer)) { //IF PLAYER HAS AT LEAST ONE HOME PIECE
			leaveHome(playerPieces[0][0])
			unableToMove = false
		} else if (playerPieces[3] != null && checkPlace((playerPieces[3].pos + roll), '', activePlayer)) { //IF PLAYER HAS A PIECE ON THEIR START PLACE
			newPos = playerPieces[3].pos + roll
			movePiece(playerPieces[3], '')
			unableToMove = false
		} else if (playerPieces[1] != null) { //IF PLAYER HAS AT LEAST ONE PIECE ON THE BOARD (NOT INLUDING START)
			for (let i = 0; i < playerPieces[1].length; i++){

				newPos = playerPieces[1][i].pos + roll
				if (newPos > 28) {
					newPos -= 28
					rollover = true
				}

				if (activePlayer == 'red') {
					var endPos = (roll - ((29 - 1) - playerPieces[1][i].pos))
				} else {
					var endPos = (roll - ((startPos - 1) - playerPieces[1][i].pos))
				}

				if (playerPieces[1][i].distance + roll > 28) {
					if ((endPos < 5) && checkPlace(endPos, 'final', activePlayer)) {
						newPos = endPos
						movePiece(playerPieces[1][i], 'final') //need to ensure looking for pos 1-4 in final that is also active player colour
						unableToMove = false
						break;
					}
				} else if (checkPlace(newPos, '', activePlayer)) {
					movePiece(playerPieces[1][i], '')
					unableToMove = false
					break;
				}
			}
		}

		console.clear()
		updatePixels()
		refreshBoard()
		report()

		console.log()
		console.log()

		await askQuestion("Press Enter to Continue")
		checkWinner()
	} while (finished != 1)

	console.log(playerName + ' has won the game!')
}

function playGame(){
	pixelGen()
	start()
}

function showPlayers(){
	console.log('ShowPlayers')
}

const ans = await askQuestion("1. Play Game\n2. View Players\n")
console.clear();

ans == 1 ? playGame() 
: ans == 2 ? showPlayers()
: console.log('Invalid Input')