#!/usr/bin/env node

// index.js
// This program displays a game of Trouble.
// Author: Russell Gregory
// Date: 17/2/22

//The UI is made by generating a grid of 2584 blank characters, or 'pixels'.
//Each playable space consists of 4x2 'pixels'. To display these I have
//made a list (places.js) of their respective properties, using the top left
//pixel as a reference coordinate and then using a loop to find the other
//seven. Once the properties have been applied to the array of blank pixels
//they are displayed using Chalk to denote the background and text colour.
//When a piece is moved the properties of both the place and piece are
//adjusted accordingly, the pixels are updated, and the board refreshes.

import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import {places} from './places.js'; //THESE ARE THE LOCATIONS OF THE TOP LEFT 
import {pieces} from './pieces.js';
import {names} from './names.js';

var pixels = [];
var playerNames = [];

for (let i = 0; i < 4; i++) {	//GENERATES RANDOM NAMES AND PREVENTS DUPLICATES
	var rndmName = names[Math.floor(Math.random() * (19-i))]

	playerNames[i] = {name: rndmName, wins: 0}
	names.splice(names.indexOf(rndmName), 1)
}

///MAIN MENU///
async function menu() {
	const ans = await askQuestion("1. Play Game\n2. View Players\n")

		ans == 1 ? start()
		: ans == 2 ? showPlayers()
		: menu()
}

//AWAITS USER INPUT FOR MENU AND TO TRIGGER THE NEXT TURN///
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
	pixels = [];
	const rows = 34;
	const columns = 76;

	for (let r = 0; r < rows; r++) { //CREATES ARRAY OF COORDINATES WITH BLANK PROPERTIES TO BE ADJUSTED IN updatePixels()
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

	places.forEach(a => { //TO FIND THE 4x2 BLANK PIXELS THAT MATCH THE PLAYABLE SPACES IN places.js
		var match = pixels.findIndex(p => { //TO FIND THE TOP LEFT PIXEL
			return p.c == a.c && p.r == a.r
		})
		applyProperties(match, a) //PIXEL SENT OFF TO HAVE PROPERTIES APPLIED TO IT AND THE THREE TO ITS RIGHT

		var match = pixels.findIndex(p => { //TO FIND THE BOTTOM LEFT PIXEL
			return p.c == a.c && p.r == a.r + 1
		})
		applyProperties(match, a) //PIXEL SENT OFF TO HAVE PROPERTIES APPLIED TO IT AND THE THREE TO ITS RIGHT
	})
}

///READS PROPERTIES OF THE PIXELS AND PRINTS THEM TO CONSOLE///
function refreshBoard() {
	var loops = 0
	var output = ''
	for (let i = 0; i < pixels.length; i++){ //FOR EACH PIXEL READ THE BACKGROUND AND TEXT COLOUR TO IDENTIFY CORRECT CHALK PARAMETERS
		var c
		switch (pixels[i].bgColour) { //CHECK BACKGROUND COLOUR
			case 'red':
				switch (pixels[i].colour) { //CHECK TEXT COLOUR
					case 'red': c = chalk.bgRgb(69, 3, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(69, 3, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(69, 3, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(69, 3, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(69, 3, 0)(pixels[i].char); break;
				}	

				break;
			case 'blue':
				switch (pixels[i].colour) { //CHECK TEXT COLOUR
					case 'red': c = chalk.bgRgb(0, 34, 69).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(0, 34, 69).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(0, 34, 69).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(0, 34, 69).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(0, 34, 69)(pixels[i].char); break;
				}	

				break;
			case 'white':
				switch (pixels[i].colour) { //CHECK TEXT COLOUR
					case 'red': c = chalk.bgRgb(64, 64, 64).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(64, 64, 64).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(64, 64, 64).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(64, 64, 64).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(64, 64, 64)(pixels[i].char); break;
				}	

				break;
			case 'green':
				switch (pixels[i].colour) { //CHECK TEXT COLOUR
					case 'red': c = chalk.bgRgb(0, 69, 6).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(0, 69, 6).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(0, 69, 6).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(0, 69, 6).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(0, 69, 6)(pixels[i].char); break;
				}	

				break;
			case 'yellow':
				switch (pixels[i].colour) { //CHECK TEXT COLOUR
					case 'red': c = chalk.bgRgb(69, 65, 0).red.bold(pixels[i].char); break;
					case 'blue': c = chalk.bgRgb(69, 65, 0).blue.bold(pixels[i].char); break;
					case 'yellow': c = chalk.bgRgb(69, 65, 0).yellow.bold(pixels[i].char); break;
					case 'green': c = chalk.bgRgb(69, 65, 0).green.bold(pixels[i].char); break;
					default: c = chalk.bgRgb(69, 65, 0).yellow.bold(pixels[i].char); break;
				}

				break;
			default: //IF PIXEL HAS NO BACKGROUND COLOUR, DO NOT COLOUR IN
				c = chalk.rgb(0,0,0)(pixels[i].char); break;
		}
		output += c //CONCAT CHALK PARAMETERS
		loops++
		if (loops == 76) { //THERE ARE 76 COLOUMNS. SO IF THE 76th CHARACTER HAS BEEN CHECKED, PRINT TO CONSOLE START NEXT ROW.
			console.log(output)
			output = ''
			loops = 0
		}
	}
}

///GAME START///
async function start() {
	var players = ['red', 'blue', 'yellow', 'green']
	var turn = 0
	var activePlayer, finished, roll, playerPieces, startPos, newPos, endPos, unableToMove, captured, capturedPieces, rollover, choice, playerName //VARIABLES USED ACROSS MULTIPLE FUNCTIONS

	///RESETS PIECE AND PLACE PROPERTIES TO DEFAULTS///
	function resetGame() {
		pieces.forEach(a => {
			a.pos = a.num;
			a.state = 'home'
			a.distance = 0
		})
		places.forEach(a => {
			a.type == 'home' ? a.occupied = a.colour : a.occupied = ''
		})
	}

	///SETS PLAYERS START POSITION AND NAME FOR REFERENCING DURING THEIR TURN///
	function setPlayer() {
		switch (activePlayer){
			case 'red':
				startPos = 1
				playerName = chalk.red(playerNames[0].name)
				break;
			case 'blue':
				startPos = 8
				playerName = chalk.blue(playerNames[1].name)
				break;
			case 'yellow':
				startPos = 15
				playerName = chalk.yellow(playerNames[2].name)
				break;
			case 'green':
				startPos = 22
				playerName = chalk.green(playerNames[3].name)
				break;
		}
	}

	///DETERMINES THE STATE OF THE PLAYERS PIECES. USED TO DETERMINE WHERE THEY CAN AND SHOULD MOVE///
	function checkPieces(player) { 
		var homePieces = pieces.filter(a => a.state == 'home' && a.colour == player) //WHAT PIECES ARE IN THE PLAYERS HOME AREA
		var boardPieces = pieces.filter(a => a.state == '' && a.colour == player && a.pos != startPos) //WHAT PIECES ARE NOT IN THE PLAYERS HOME OR FINAL AREA
		var finalPieces = pieces.filter(a => a.state == 'final' && a.colour == player) //WHAT PIECES ARE IN THE PLAYERS FINAL AREA
		var startPieces = pieces.find(a => a.pos == startPos && a.state == '' && a.colour == activePlayer) //WHAT PIECE IS IN THE PLAYERS START POSITION
		return [homePieces, boardPieces, finalPieces, startPieces]
	}

	///CHECKS IF IDEAL MOVE IS POSSIBLE///
	function checkPlace(pos, type, colour) {
		if (type == 'final') { //COLOUR NEEDS TO BE ADDED TO THE CHECK IF ITS THE PLAYERS FINAL AREA
			if (places.find(a => a.pos == pos && a.type == type && a.colour == colour).occupied == '') {
				return true
			}
		} else if (places.find(a => a.pos == pos && a.type == type).occupied == '') {
			return true
		}
	}

	///MOVES THE PLAYERS PIECE OUT OF HOME AND ONTO THEIR START POSITION///
	function leaveHome(homePiece) {
			choice = homePiece.num 	//TO REPORT WHICH OF THE PLAYERS PIECES HAS BEEN MOVED IN report()
			var piece = pieces.findIndex(a => a.num == homePiece.num && a.colour == activePlayer) 						//FINDS PIECE PLAYER HAS CHOSEN TO MOVE
			var place = places.findIndex(a => a.pos == homePiece.num && a.colour == activePlayer && a.type == 'home') 	//FINDS PLACE PLAYERS PIECE IS CURRENTLY IN
			var newPlace = places.findIndex(a => a.pos == startPos && a.type == '') //FINDS PLACE PLAYER HAS CHOSEN TO MOVE THEIR PIECE TO
			pieces[piece].distance = 1 					//SETS THE DISTANCE THE PIECE HAS MOVED TO 1. USED TO DETERMINE IF PIECE HAS GONE AROUND THE BOARD BEFORE ENTERNG FINAL AREA
			pieces[piece].state = '' 					//CHANGES THE PIECES STATE FROM 'home' to ''. USED TO DETERMINE BEST MOVE.
			pieces[piece].pos = places[newPlace].pos 	//UPDATES THE PIECES POSITION. USED TO UPDATE ITS POSITION ON THE BOARD.
			places[place].occupied = '' 				//UPDATES THE OCCUPANCY STATUS OF THE PLACE. USED TO DETERMINE IF A PIECE CAN MOVE TO IT.
			places[newPlace].occupied = activePlayer 	//UPDATES THE OCCUPANCY STATUS OF THE PIECE. USED TO UPDATE ITS APPEARANCE ON THE BOARD.
	}

	function movePiece(stdPiece, type) {
		choice = stdPiece.num
		var piece = pieces.findIndex(a => a.num == stdPiece.num && a.colour == activePlayer)	//FINDS PIECE PLAYER HAS CHOSEN TO MOVE
		var place = places.findIndex(a => a.pos == stdPiece.pos && a.type == '')				//FINDS PLACE PLAYERS PIECE IS CURRENTLY IN

		if (type == '') {	//FINDS PLACE PLAYER HAS CHOSEN TO MOVE THEIR PIECE TO, DEPENDING ON WHETHER ITS IN FINAL AREA OR NOT
			var newPlace = places.findIndex(a => a.pos == newPos && a.type == type)
		} else if (type == 'final') {
			var newPlace = places.findIndex(a => a.pos == newPos && a.type == type && a.colour == activePlayer)
		}
		if (rollover == true) { //SEARCHES FOR PIECES THAT HAVE BEEN CAPTURED BY THE ACTIVE PLAYER.
			capturedPieces = pieces.filter(a => a.state == type && a.pos > pieces[piece].pos && a.pos <= 28) 			//THERE ARE ONLY 28 PLACES BEFORE THE POSTION #s TICK BACK OVER TO 1
			capturedPieces.concat(pieces.filter(a => a.state == type && a.pos >= 1 && a.pos < places[newPlace].pos))	//THIS ENSURES IT SEARCHES FOR THE PIECES HOPPED OVER BETWEEN THAT ROLLOVER
		} else {
			capturedPieces = pieces.filter(a => a.state == type && a.pos > pieces[piece].pos && a.pos < places[newPlace].pos)
		}
		
		pieces[piece].distance += roll				//UPDATES PIECES TOTAL DISTANCE COVERED. TO DETERMINE IF IT SHOULD ENTER FINAL ZONE UPON ARRIVAL
		pieces[piece].pos = places[newPlace].pos	//UPDATES THE PIECES POSITION. USED TO UPDATE ITS POSITION ON THE BOARD.
		pieces[piece].state = type					//UPDATES THE PIECES STATE. USED TO DETERMINE BEST MOVE.
		places[place].occupied = ''					//UPDATES THE OCCUPANCY STATUS OF THE PLACE. USED TO DETERMINE IF A PIECE CAN MOVE TO IT.
		places[newPlace].occupied = activePlayer	//UPDATES THE OCCUPANCY STATUS OF THE PIECE. USED TO UPDATE ITS APPEARANCE ON THE BOARD.

		capturedPieces.length > 0 ? returnPieces(capturedPieces) : captured = false		//SENDS OFF DETAILS OF CAPTURED PIECES IF ANY
	}

	///RETURNS CAPTURED PIECES TO THEIR HOME AREA///
	function returnPieces(stdPieces){
		captured = true		//USED TO REPORT CAPTURED PIECES
		capturedPieces = stdPieces.filter(a => a.colour != activePlayer)	//ENSURES PLAYER DOES NOT CAPTURE OWN PIECES
		capturedPieces.forEach(a => {	//FINDS DETAILS OF PIECES AND PLACES OF CAPTURED PIECES
			var piece = pieces.findIndex(b => b.num == a.num && b.colour == a.colour)
			var place = places.findIndex(b => b.pos == a.pos && b.type == a.state)
			var newPlace = places.findIndex(b => b.colour == a.colour && b.pos == a.num && b.type == 'home')

			pieces[piece].distance = 0							//UPDATES PIECES TOTAL DISTANCE COVERED. TO DETERMINE IF IT SHOULD ENTER FINAL ZONE UPON ARRIVAL
			pieces[piece].pos = places[newPlace].pos			//UPDATES THE PIECES POSITION. USED TO UPDATE ITS POSITION ON THE BOARD.
			pieces[piece].state = 'home'						//UPDATES THE PIECES STATE. USED TO DETERMINE BEST MOVE.
			places[place].occupied = ''							//UPDATES THE OCCUPANCY STATUS OF THE PLACE. USED TO DETERMINE IF A PIECE CAN MOVE TO IT.
			places[newPlace].occupied = pieces[piece].colour	//UPDATES THE OCCUPANCY STATUS OF THE PIECE. USED TO UPDATE ITS APPEARANCE ON THE BOARD.
		})
	}

	///EVENT REPORTING FOR CONSOLE///
	function report() {
		var place, name

		function numToWord(number) { //TURNS NUMBER INTO WORD FOR CHALK/CONSOLE
			switch (number) {
				case 1 : return 'first';
				case 2 : return 'second';
				case 3 : return 'third';
				case 4 : return 'fourth';
			}
		}

		console.log(playerName + ' has rolled a ' + roll)

		if (captured == true) { //REPORTS CAPTURED PIECES WITH COLOURED NAMES
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

	///CHECKS IF WINNING CONDIONS HAVE BEEN MET///
	function checkWinner() {
		var finishedPieces = pieces.filter(a => a.colour == activePlayer && a.state == 'final')
		if (finishedPieces != null && finishedPieces.length == 4) { //IF ACTIVE PLAYER HAS FOUR PIECES IN THEIR FINAL AREA
			finished = 1
			playerNames[turn].wins++ //INCREASES WIN COUNT FOR WINNING PLAYER
		}
	}

	resetGame()
	pixelGen()

	///BEGINNING OF GAME///
	///LOOPING FOR EACH PLAYERS TURN UNTIL WINNING CONDITIONS ARE MET///
	do {
		turn++
		if (turn == 4) turn = 0
		activePlayer = players[turn]
		unableToMove = true
		captured = false
		rollover = false
		setPlayer()
	
		roll = Math.floor(Math.random() * 6) + 1;

		playerPieces = checkPieces(activePlayer)

		if (playerPieces[0].length > 0 && playerPieces[1].length < 2 && roll == 6 && checkPlace(startPos, '', activePlayer)) { //IF PLAYER HAS ROLLED A 6, HAS AT LEAST ONE HOME PIECE, LESS THAN TWO PIECES ON THE BOARD, AND IF THE START POSTION IS AVAILIABLE
			leaveHome(playerPieces[0][0]) //SENDS HOME PIECE TO BE MOVED
			unableToMove = false
		} else if (playerPieces[3] != null && checkPlace((playerPieces[3].pos + roll), '', activePlayer)) { //IF PLAYER HAS A PIECE ON THEIR START PLACE, AND IF IT CAN BE MOVED WITH THE CURRENT ROLL.
			newPos = playerPieces[3].pos + roll //USED FOR REFERENCING IN OTHER FUNCTIONS
			movePiece(playerPieces[3], '') 		//SENDS PIECE TO BE MOVED
			unableToMove = false
		} else if (playerPieces[1] != null) { 					//IF PLAYER HAS AT LEAST ONE PIECE ON THE BOARD (NOT INLUDING START OR FINAL AREA)
			for (let i = 0; i < playerPieces[1].length; i++){ 	//CHECK EACH OF THOSE PIECES FOR AVAILIABLE MOVES
				newPos = playerPieces[1][i].pos + roll
				if (newPos > 28) {			//THERE ARE ONLY 28 POSITIONS ON THE BOARD BESIDES HOME AND FINAL AREAS, THIS CHECKS TO SEE IF IT IS SEARCHING FOR A 29th PLACE OR HIGHER
					newPos -= 28
					rollover = true			//FOR REFERENCE IN OTHER FUNCTIONS
				}

				if (activePlayer == 'red') {									//USED TO CALCULATE POSITION IN FINAL AREA IN CASE IT HAS GONE AROUND THE BOARD
					var endPos = (roll - ((29 - 1) - playerPieces[1][i].pos))	//RED NEEDS TO BE CALCULATED DIFFERENTLY DUE TO THE 28TH -> 1ST ROLLOVER BEING ON IT'S START POSITION
				} else {
					var endPos = (roll - ((startPos - 1) - playerPieces[1][i].pos))
				}

				if (playerPieces[1][i].distance + roll > 28) {		//CHECKS IF THE PIECE HAS GONE AROUND THE BOARD
					if ((endPos < 5) && checkPlace(endPos, 'final', activePlayer)) {	//CHECKS IF POSITION IN FINAL AREA IS AVAILABLE
						newPos = endPos
						movePiece(playerPieces[1][i], 'final') //SEND PIECE TO BE MOVED INTO FINAL AREA
						unableToMove = false
						break;
					}
				} else if (checkPlace(newPos, '', activePlayer)) { 	//CHECKS IF POSITION ON BOARD IS AVAILIABLE
					movePiece(playerPieces[1][i], '') 				//SENDS PIECE OFF TO BE MOVED
					unableToMove = false
					break;
				}
			}
		}

		console.clear()
		updatePixels()
		refreshBoard()
		report()

		checkWinner()
		await askQuestion('')
		
	} while (finished != 1)

	console.log(playerName + ' has won the game!')
	menu()
}

///DISPLAYS CURRENT PLAYERS AND WIN COUNT///
function showPlayers(){
	console.clear()
	console.log('Current Players:')
	for (let i = 0; i < 4; i++) { //CYCLES THROUGH EACH PLAYER, READING NAME AND WIN COUNT
		console.log(playerNames[i].name + ' - Wins: ' + playerNames[i].wins)
	}
	console.log()
	menu()
}

menu()