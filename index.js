#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation'

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

function displayGame(){
	gridInit()
}

function gridInit(){
	function storeCoordinate(xVal, yVal, array){
		array.push({x: xVal, y: yVal});
	}

	const rows = 20;
	const columns = 50;
	var coords = [];

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			storeCoordinate(r, c, coords)
		}	
	}
	
	for (let r = 0; r < rows; r++) {
		var row = ''
		for (let c = 0; c < columns; c++) {
			row += 'X'
		}	
		console.log(row)
	}
	
}

function showPlayers(){
	console.log('ShowPlayers')
}

const ans = await askQuestion("1. Play Game\n2. View Players\n")
console.clear();

if (ans == 1) {
	displayGame();
} else if (ans == 2) {
	showPlayers()
}