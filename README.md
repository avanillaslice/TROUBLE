# TROUBLE
 Developer Project for UseVerb


PROCESS

Decided on a few modules to decorate console text
Created initial menu
Currently investigating methods to generate the board
	-Needs 60 playable spaces
 		-BG colour to denote each players home territory
 		-Text colour to denote the place and occupancy
	-Potentially create an array of objects containing unique properties
		- {ROW, COLUMN, BASE COLOUR, (CURRENTLY OCCUPIED COLOUR/UNOCCUPIED COLOUR}
		-Then use a nested loop to concat a console.log for each row, using the properties to determine state...