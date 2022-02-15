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
	function applyProperties(pixel, place, array){
		for (let i = 0; i < 4; i++){
			pixels[pixel+i].bgColour = place.colour
			pixels[pixel+i].colour = place.occupied
			if (place.occupied == ''){
				pixels[pixel+i].char = ' '
			} else {
				pixels[pixel+i].char = '\u256C'
			}
			
			if (place.type == 'final'){
				pixels[pixel+i].char = '\u2573'
			}

			array.push(pixels[pixel+i])
		}
	}

	///FINDS THE MATCHING PIXELS FOR THE PLAYABLE SPACES///
	
	places.forEach(a => {
		var playablePixelSet = []
		
		var match = pixels.findIndex(p => {
			return p.c == a.c && p.r == a.r
		})
		applyProperties(match, a, playablePixelSet)

		var match = pixels.findIndex(p => {
			return p.c == a.c && p.r == a.r + 1
		})
		applyProperties(match, a, playablePixelSet)

		playablePlaces.push(playablePixelSet)
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

async function start(){
	

	const ans = await askQuestion("1. Move\n")
	console.clear()

	//player red rolls a 6 and chooses piece 1
	var activePlayer = 'red'
	var roll = 6
	var choice = 1
	var startPos
	switch (activePlayer){
		case 'red':
			startPos = 10
			break;
		case 'blue':
			startPos = 18
			break;
		case 'yellow':
			startPos = 49
			break;
		case 'green':
			startPos = 41
			break;
	}

	if (roll = 6) {
		//pick a piece to move (assuming piece 1)
		var piece = pieces.findIndex(a => a.num == choice && a.colour == activePlayer)
		var place = places.findIndex(a => a.type == pieces[piece].state && a.pos == pieces[piece].pos && a.occupied == activePlayer)
		//if piece 1 state = home
			//move piece to active players startPos (pos 1)
			//set current place to unoccupied and position 1 to occupied and piece state to ''
			
			pieces[piece].state = ''
			pieces[piece].pos = 1
			places[place].occupied = ''
			places[startPos].occupied = activePlayer

			updatePixels()
			refreshBoard()
		
	} else if (roll < 6) {
		console.log("lower than 6")//does active player have any pieces outside of home?
	}

	// ans == 1 ? move() : console.log('invalid input')
}

function playGame(){
	pixelGen()
	updatePixels()
	refreshBoard()
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