#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import {places} from './places.js';
import {pieces} from './pieces.js';
var pixels = [];

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
			pixels.push({c: c, r: r, colour: '', char: ' ', type:'', piece:''});
		}	
	}
}

///APPLIES PROPERTIES OF PLAYABLE SPACES ONTO PIXELS///
function updatePixels() {
	function applyProperties(pixel, place, array){
		for (let i = 0; i < 4; i++){
			pixels[pixel+i].colour = place.colour
			pixels[pixel+i].type = place.type
			if (place.type =='home'){
					pixels[pixel+i].piece = place.colour
					pixels[pixel+i].char = '\u256C'
			} else if (place.type == 'final'){
				pixels[pixel+i].char = '\u2573'
			}
			array.push(pixels[pixel+i])
		}
	}
	///FINDS THE MATCHING PIXELS FOR THE PLAYABLE SPACES///
	var playablePlaces = []
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
		///PIXEL DISPLAY///
	var loops = 0
	var output = ''
	for (let i = 0; i < pixels.length; i++){
		var c
		switch (pixels[i].colour) {
			case 'red':
				c = chalk.bgRgb(153, 0, 0).red.bold(pixels[i].char);
				break;
			case 'blue':
				c = chalk.bgBlue.black(pixels[i].char);
				break;
			case 'white':
				c = chalk.bgRgb(135, 135, 135).red.bold(pixels[i].char);
				break;
			case 'green':
				c = chalk.bgGreen.black(pixels[i].char);
				break;
			case 'yellow':
				c = chalk.bgYellow.black(pixels[i].char);
				break;
			default:
				c = chalk.rgb(0,0,0)(pixels[i].char);
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
	function move(){
		pieces[0].pos = 1
		pieces[0].state = ''
		updatePixels();
		refreshBoard()
		console.log(pieces[0])
	}

	const ans = await askQuestion("1. Move\n")
	console.clear()

	ans == 1 ? move() : console.log('invalid input')
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