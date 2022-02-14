#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import {places} from './places.js';

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

function pixelGen(){
	const rows = 34;
	const columns = 76;
	var pixels = []

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			pixels.push({c: c, r: r, colour: '', char: ' ', type:''});
		}	
	}

	function applyProperties(pixel, place, array){
		for (let i = 0; i < 4; i++){
			pixels[pixel+i].colour = place.colour
			pixels[pixel+i].type = place.type
			if (place.type =='home'){
					pixels[pixel+i].char = '\u256C'
			} else if (place.type == 'final'){
				pixels[pixel+i].char = '\u2573'
			}
			array.push(pixels[pixel+i])
		}
	}

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

	console.log(playablePlaces.length)
	

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
	// const wordywords = chalk.blue('ooooooo')
	// console.log("ooooooooooooo" + wordywords)
}

function displayGame(){
	pixelGen()
}

function showPlayers(){
	console.log('ShowPlayers')
}

const ans = await askQuestion("1. Play Game\n2. View Players\n")
console.clear();

ans == 1 ? displayGame() 
: ans == 2 ? showPlayers()
: console.log('Invalid Input')