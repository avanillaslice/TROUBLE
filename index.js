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
			
			if (place.type == 'final'){
				pixels[pixel+i].char = ' '
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
					case 'red': c = chalk.bgRgb(153, 0, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(153, 0, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(153, 0, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(153, 0, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(153, 0, 0)(pixels[i].char); break;
				}	

				break;
			case 'blue':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(42, 0, 250).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(42, 0, 250).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(42, 0, 250).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(42, 0, 250).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(42, 0, 250)(pixels[i].char); break;
				}	

				break;
			case 'white':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(135, 135, 135).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(135, 135, 135).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(135, 135, 135).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(135, 135, 135).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(135, 135, 135)(pixels[i].char); break;
				}	

				break;
			case 'green':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(2, 128, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(2, 128, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(2, 128, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(2, 128, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(2, 128, 0)(pixels[i].char); break;
				}	

				break;
			case 'yellow':
				switch (pixels[i].colour) {
					case 'red': c = chalk.bgRgb(163, 141, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(163, 141, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(163, 141, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(163, 141, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(163, 141, 0).yellow.bold(pixels[i].char); break;
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
	var activePlayer, finished, roll, playerPieces, startPos, newPos, unableToMove, captured, capturedPieces, rollover, choice

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
		var boardPieces = pieces.filter(a => a.state == '' && a.colour == player)
		var finalPieces = pieces.filter(a => a.state == 'final' && a.colour == player)
		var startPieces = pieces.find(a => a.pos == startPos && a.state == '')
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
			pieces[piece].state = ''
			pieces[piece].pos = places[newPlace].pos
			places[place].occupied = ''
			places[newPlace].occupied = activePlayer
	}

	function movePiece(stdPiece) {
		choice = stdPiece.num
		var piece = pieces.findIndex(a => a.num == stdPiece.num && a.colour == activePlayer)
		var place = places.findIndex(a => a.pos == stdPiece.pos && a.type == '')
		var newPlace = places.findIndex(a => a.pos == newPos && a.type == '')
		//

		if (rollover == true) {
			capturedPieces = pieces.filter(a => a.state == '' && a.pos > pieces[piece].pos && a.pos <= 28)
			capturedPieces.concat(pieces.filter(a => a.state == '' && a.pos >= 1 && a.pos < places[newPlace].pos))
		} else {
			capturedPieces = pieces.filter(a => a.state == '' && a.pos > pieces[piece].pos && a.pos < places[newPlace].pos)
		}
		
		pieces[piece].pos = places[newPlace].pos
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

			pieces[piece].pos = places[newPlace].pos
			pieces[piece].state = 'home'
			places[place].occupied = ''
			places[newPlace].occupied = pieces[piece].colour
		})
	}

	function report() {
		var name, place, playerName

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

	do {
		if (turn == 4) turn = 0
		activePlayer = players[turn]
		unableToMove = false
		captured = false
		rollover = false
		setStartPos()
	
		roll = Math.floor(Math.random() * 6) + 1;

		playerPieces = checkPieces(activePlayer)

		if (playerPieces[0].length > 0 && roll == 6 && checkPlace(startPos, '', activePlayer)) { //IF PLAYER HAS AT LEAST ONE HOME PIECE
				leaveHome(playerPieces[0][0])
		} else if (playerPieces[1].length > 0) { //IF PLAYER HAS AT LEAST ONE PIECE ON THE BOARD (NOT INCLUDING FINAL STRETCH)
			if (playerPieces[3] != null && playerPieces[3].colour == activePlayer) {
				newPos = playerPieces[3].pos + roll
				if (checkPlace(newPos, '', activePlayer)) {
					movePiece(playerPieces[3])
				}
			} else {
				for (let i = 0; i < playerPieces[1].length; i++){
					newPos = playerPieces[1][i].pos + roll
					if (newPos > 28) {
						newPos -= 28
						rollover = true
					}
					if (checkPlace(newPos, '', activePlayer)) {
						movePiece(playerPieces[1][i])
						break;
					}
				}
			}
		} else {
			unableToMove = true
		}

		updatePixels()
		refreshBoard()
		report()

		await askQuestion("Press Enter to Continue")

		turn++
	} while (finished != 1)
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