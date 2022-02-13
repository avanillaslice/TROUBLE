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
	var pixels = [];

	function storeCoordinate(cVal, rVal, array){
		array.push({c: cVal, r: rVal, colour: ''});
	}

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			storeCoordinate(c, r, pixels)
		}	
	}

	var count = 0
	places.forEach(a => {
		var match = pixels.findIndex(p => {
			return p.c == a.c && p.r == a.r
		})

		for (let i = 0; i < 4; i++){
			pixels[match+i].colour = a.colour
		}

		var match = pixels.findIndex(p => {
			return p.c == a.c && p.r == a.r + 1
		})

		for (let i = 0; i < 4; i++){
			pixels[match+i].colour = a.colour
		}
	})

	console.log(pixels)
}

function displayGame(){
	pixelGen()

}

function showPlayers(){
	console.log('ShowPlayers')
}

const ans = await askQuestion("1. Play Game\n2. View Players\n")
// console.clear();

ans == 1 ? displayGame() 
: ans == 2 ? showPlayers()
: console.log('Invalid Input')