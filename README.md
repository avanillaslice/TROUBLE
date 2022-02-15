# TROUBLE
 Developer Project for UseVerb


PROCESS

Decided on a few modules to decorate console text
Created initial menu

Currently investigating methods to generate the board
	-Needs 60 playable spaces
 		-BG colour to denote each players home territory
 		-Text colour to denote the space and it's occupancy
	-How many rows and columns do I need to maintain the board parameters?
		-I'll generate text grids and map some pieces over it in photoshop to see what works...
		-One ASCII character per space does not provide enough resolution for the center lines. Will experiment with 2x2 characters per space...
		-2x2 characters per space creates rectangular spaces. Expanding to 4x2 per piece...
		-4x2 per piece fits the whole game well with 34 rows and 76 columns (zero indexed).
	-Potentially create an array of objects containing the unique properties of each character...
		- {ROW, COLUMN, PLAYABLE:(1/0), BASE COLOUR, (CURRENTLY OCCUPIED COLOUR/UNOCCUPIED COLOUR)}
		-Then use a nested loop to concat a console.log for each row, referencing the properties of each pixel.
		-Will I need to use classes to interact with the coordinates effectively?
			-Will attempt to use standard array functions/methods before adding classes.
		-Each space is represented by 8 characters. I'll need to be able to alter the status of that set when a piece is moved.
		-I'll want to group the coords of each space into sets, and then have those sets ordered by their position on the board
			-There will be seperate groups for the home and final stretch spaces, some logic to check colour upon arrival determining the switch.
		-What will I need to do to these sets(spaces)?
			-Adjust and read the properties of the constituent "pixels" for board generation.
	-Generate the array of blank pixels -> apply properties of playable spaces -> LOOP: if not playable - concat a blank "o", if playable - concat relevant character/colour
		-Just now realising I'll need to figure out a way to adjust the properties of 480 pixels (8 pixels x 60 spaces)...
			-Could do it manually.. Or I could just list the locations of the top left pixel for each space and have a loop apply the properties to the other 7
				-Added list of playable places in 'places.js'
				-Added loop to apply basic colour to surrounding pixels.
	-Pixel Display
		-Created loop that concats chalk colours relative to the pixels colour
		-Determining colours/characters that best present the places and pieces...
	-Pixel Sets
		-When assigning properties of playable spaces to blank pixels I should group them into sets to reference later. Ordering them in a clockwise fashion.
		-Home spaces and final runs should have their own sets
			-Added "type" to 'places.js' to define home/final/neutral
			-Modified pixelGen() to apply places.js properties to pixels
		 		-Moved property application process into applyProperties() to minimise repetition
		-Added 'pos' property to places.js to determine direction of movement

Updating Board
	-Will start by trying to move a piece around the board
		-I'll need to make a movement function
			-Pieces need references
				-Added 'pieces.js' which includes colour, position, and state(home/neutral/final)
				-pieces.js will need to apply to places before the pixels are updated
					-places needs 'occupied' property
					-Created updatePlaces()
			-On move, change piece status, refresh board
		-Refactoring will be needed to avoid repetition
			-applyProperties() can be adjusted to be updateProperties()
	-Created basic movement function for inital move

Game logic
	-Setting loop to go through each player until winning parameters are met
	-Optimal play probably prioritises ensuring no pieces are on your start place and using your 6's to release your pieces whenever possible. Although that would also set you up to have more pieces sent home... Potentially some middle ground there.
		-Each move starts with dice roll
		-Check if all pieces are in home
			-If rolled a 6 place it at start
			-Else check for pieces on board and move then
			-Else end turn
	-Refactoring necessary to fascilitate all possibilities and minimise repetition. Ironically I keep repeating that last part.
	-Check for pieces capturing others...
		-As long as it's not the activePlayers piece, send to movePiece()
			-Ahh too much refactoring for minimal gain, I'll make a seperate returnPieces()

TODO:
IF DONE LOOP, GO FOR FINAL
IF ALL FOUR IN FINAL DECLARE WINNER
REPORTING OF WINNER
FIX UP CHARACTERS/COLOURS
REMOVE REDUNDANT CODE
CLEAR CONSOLE ON REFRESH
README ON OPERATION
		 	